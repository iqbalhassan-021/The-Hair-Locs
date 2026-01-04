import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ITEMS_PER_LOAD = 8;

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

  useEffect(() => {
    const fetchAllProducts = async () => {
      const db = getFirestore();
      const productsRef = collection(db, 'products');
      const onSaleRef = collection(db, 'onSale');
      const storeSaleRef = collection(db, 'storeSale');

      try {
        const [productSnap, saleSnap, storeSaleSnap] = await Promise.all([
          getDocs(productsRef),
          getDocs(onSaleRef),
          getDocs(storeSaleRef)
        ]);

        const productList = productSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Map for individual product discounts
        const saleMap = new Map();
        saleSnap.docs.forEach(doc => {
          saleMap.set(doc.id, doc.data());
        });

        // Map for category-specific sales
        const categorySalesMap = new Map();
        storeSaleSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.categoryId && data.salePercentage) {
            categorySalesMap.set(
              data.categoryId.toLowerCase().trim(),
              data.salePercentage
            );
          }
        });

        const mergedList = productList.map(product => {
          const individualSale = saleMap.get(product.id);

          if (individualSale?.salePrice) {
            return { ...product, salePrice: individualSale.salePrice };
          }

          const categoryKey = product.productType?.toLowerCase().trim();
          const categorySalePercentage = categorySalesMap.get(categoryKey);

          if (categorySalePercentage && product.productPrice) {
            const discountedPrice =
              product.productPrice -
              (product.productPrice * categorySalePercentage) / 100;

            return {
              ...product,
              salePrice: parseFloat(discountedPrice.toFixed(2)),
            };
          }

          return product;
        });

        mergedList.sort((a, b) =>
          b.productCode?.localeCompare(a.productCode)
        );

        setProducts(mergedList);
      } catch (error) {
        console.error('❌ Error fetching data:', error);
      }
    };

    fetchAllProducts();
  }, []);

  const loadMoreProducts = () => {
    setVisibleCount(prev =>
      Math.min(prev + ITEMS_PER_LOAD, products.length)
    );
  };

  const addToCart = (product) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
      const actualPrice = product.salePrice || product.productPrice;

      const existingProduct = existingCart.find(item => item.id === product.id);

      const updatedCart = existingProduct
        ? existingCart.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [
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

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      toast.success(`${product.productName} added to cart!`, {
        position: 'bottom-right',
      });
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      toast.error('Failed to add to cart.', { position: 'bottom-right' });
    }
  };

  return (
    <>
      <div className="product-container">
        <div className="body-cover">
          <div className="products">
            <div className="section-title">
              <p>All Products</p>
            </div>

            <div className="grid-4x">
              {products.length === 0 ? (
                <p>No products found.</p>
              ) : (
                products.slice(0, visibleCount).map(product => (
                  <Link
                    to={`/product/${product.id}`}
                    className="no-decoration"
                    key={product.id}
                  >
                    <div className="product-card">
                      <div
                        className="product-img-container"
                        style={{
                          backgroundImage: `url(${product.productImage})`,
                        }}
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
                          <p className="product-name-text">
                            {product.productName}
                          </p>
                        </div>

                        <div className="product-price">
                          {product.salePrice &&
                          product.salePrice !== product.productPrice ? (
                            <>
                              <p className="product-price-text text-strike">
                                Rs.{product.productPrice}
                              </p>
                              <p className="product-sale-price-text">
                                Rs.{product.salePrice}
                              </p>
                            </>
                          ) : (
                            <p className="product-price-text">
                              Rs.{product.productPrice}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {visibleCount < products.length && (
              <div style={{ textAlign: 'center', marginTop: '30px' , display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <button
                  onClick={loadMoreProducts}
                  className="primary-button"
                >
                  LOAD MORE
                </button>
              </div>
            )}

            {visibleCount >= products.length && (
              <p className="no-more-products">NO MORE PRODUCTS</p>
            )}
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default AllProducts;
