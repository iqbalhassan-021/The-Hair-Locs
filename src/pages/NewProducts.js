import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import BottomBar from '../components/BottomBar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewProducts = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Classic Bow');

  useEffect(() => {
    const fetchCategories = async () => {
      const db = getFirestore();
      const categoriesCollection = collection(db, 'Category');
      try {
        const querySnapshot = await getDocs(categoriesCollection);
        const categoryList = querySnapshot.docs.map(doc => doc.data().categoryName);
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const db = getFirestore();
      const productsCollection = collection(db, 'products');
      const onSaleCollection = collection(db, 'onSale');
      const storeSaleCollection = collection(db, 'storeSale');

      try {
        const [productSnap, saleSnap, storeSaleSnap] = await Promise.all([
          getDocs(productsCollection),
          getDocs(onSaleCollection),
          getDocs(storeSaleCollection)
        ]);

        const productList = productSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Build lookup maps
        const saleMap = new Map();
        saleSnap.docs.forEach(doc => {
          saleMap.set(doc.id, doc.data());
        });

        const categorySaleMap = new Map();
        storeSaleSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.categoryId && data.salePercentage) {
            categorySaleMap.set(data.categoryId.toLowerCase().trim(), data.salePercentage);
          }
        });

        // Merge discount logic
        const enrichedProducts = productList.map(product => {
          const individualSale = saleMap.get(product.id);

          if (individualSale?.salePrice) {
            return {
              ...product,
              salePrice: individualSale.salePrice
            };
          }

          const categoryKey = product.productType?.toLowerCase().trim();
          const categoryDiscount = categorySaleMap.get(categoryKey);

          if (categoryDiscount && product.productPrice) {
            const discountedPrice =
              product.productPrice - (product.productPrice * (categoryDiscount / 100));
            return {
              ...product,
              salePrice: parseFloat(discountedPrice.toFixed(2))
            };
          }

          return product;
        });

        const reversed = enrichedProducts.reverse();
        setProducts(reversed);

        // Default filtered set
        const defaultFiltered = sortProductsByCode(
          reversed.filter(product => product.productType === selectedCategory)
        );
        setFilteredProducts(defaultFiltered);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const sortProductsByCode = (productsArray) => {
    return productsArray.sort((a, b) => {
      const numA = parseInt(a.productCode?.replace(/[^0-9]/g, '') || '0', 10);
      const numB = parseInt(b.productCode?.replace(/[^0-9]/g, '') || '0', 10);
      return numB - numA;
    });
  };

  const handleCategoryClick = (categoryName) => {
    const filtered = sortProductsByCode(
      products.filter(product => product.productType === categoryName)
    );
    setFilteredProducts(filtered);
  };

  const handleSelectChange = (event) => {
    const categoryName = event.target.value;
    setSelectedCategory(categoryName);
    const filtered = sortProductsByCode(
      products.filter(product => product.productType === categoryName)
    );
    setFilteredProducts(filtered);
  };

  const getProductCount = (categoryName) => {
    return products.filter(product => product.productType === categoryName).length;
  };

  const addToCart = (product) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
      const actualPrice = product.salePrice || product.productPrice;
      let updatedCart;

      const existingProduct = existingCart.find(item => item.id === product.id);

      if (existingProduct) {
        updatedCart = existingCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [
          ...existingCart,
          {
            id: product.id,
            productName: product.productName,
            productPrice: actualPrice,
            productImage: product.productImage,
            productSize: product.productSize,
            productColor: product.productColor,
            productCode: product.productCode,
            productType: product.productType,
            quantity: 1,
          },
        ];
      }

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      toast.success(`${product.productName} added to cart!`, { position: 'bottom-right' });
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      toast.error('Failed to add to cart.', { position: 'bottom-right' });
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="background"></div>
        <div className="products-body">
          <div className="cover">
            <div className="products-partition">
              <div className="categories-section">
                <h2>Categories</h2>
                <ul>
                  {categories.length === 0 ? (
                    <li>No categories available</li>
                  ) : (
                    categories.map((category, index) => (
                      <li key={index}>
                        <button
                          onClick={() => handleCategoryClick(category)}
                          className="category-button"
                        >
                          {category} - {getProductCount(category)}
                        </button>
                      </li>
                    ))
                  )}
                </ul>

                <select
                  name='category'
                  id='category'
                  className='filter'
                  value={selectedCategory}
                  onChange={handleSelectChange}
                >
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category} - {getProductCount(category)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="products-sections">
                <h2>Products</h2>
                <div className="showcase grid-3x">
                  {filteredProducts.length === 0 ? (
                    <p>No products available</p>
                  ) : (
                    filteredProducts.map((product) => (
                      <Link to={`/product/${product.id}`} className="no-decoration" key={product.id}>
                        <div className="product-card">
                          <div
                            className="product-img-container"
                            style={{ backgroundImage: `url(${product.productImage})` }}
                          >
                            <div className="product-buttons">
                              <button
                                className="product-button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  addToCart(product);
                                }}
                              >
                                <i className="fa-regular fas fa-cart-plus"></i>
                              </button>
                            </div>
                          </div>
                          <div className="product-text-holder">
                            <div className="product-name">
                              <p className="product-name-text">{product.productName}</p>
                            </div>
                            <div className="product-price">
                              {product.salePrice && product.salePrice !== product.productPrice ? (
                                <>
                                  <p className="product-price-text text-strike">Rs.{product.productPrice}</p>
                                  <p className="product-sale-price-text">Rs.{product.salePrice}</p>
                                </>
                              ) : (
                                <p className="product-price-text">Rs.{product.productPrice}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
      <BottomBar />
      <Footer />
    </>
  );
};

export default NewProducts;
