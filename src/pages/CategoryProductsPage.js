import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, orderBy, where} from 'firebase/firestore';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import BottomBar from '../components/BottomBar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryProductsPage = () => {
  const { categoryName } = useParams(); // grabs category name from URL
  const [products, setProducts] = useState([]);
  const [storeSales, setStoreSales] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [currentMin, setCurrentMin] = useState(0);
  const [currentMax, setCurrentMax] = useState(0);
  const [priceSort, setPriceSort] = useState("");

useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  useEffect(() => {
    const fetchSales = async () => {
      const db = getFirestore();
      const salesCollection = collection(db, 'storeSale');
      const salesSnapshot = await getDocs(salesCollection);
      const salesList = salesSnapshot.docs.map(doc => doc.data());
      setStoreSales(salesList);
    };

    fetchSales();
  }, []);

useEffect(() => {
  const fetchData = async () => {
    const db = getFirestore();

    try {
      const productsSnap = await getDocs(collection(db, 'products'));
      const allProducts = productsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Local filter with safe normalization
      const filtered = allProducts.filter(
        p => (p.productType || '').toLowerCase().trim() === (categoryName || '').toLowerCase().trim()
      );

      // Apply sales logic
      const finalProducts = filtered.map(product => {
        const matchingSale = storeSales.find(
          sale =>
            (sale.categoryId || '').toLowerCase().trim() ===
            (product.productType || '').toLowerCase().trim()
        );

        if (matchingSale) {
          const discount = (product.productPrice * matchingSale.salePercentage) / 100;
          return { ...product, salePrice: Math.round(product.productPrice - discount) };
        }
        return product;
      });

      setProducts(finalProducts);
      if (finalProducts.length > 0) {
  const prices = finalProducts.map(p => p.salePrice || p.productPrice);
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  setMinPrice(min);
  setMaxPrice(max);
  setCurrentMin(min);
  setCurrentMax(max);
  setFilteredProducts(finalProducts);
}

    } catch (err) {
      console.error(err);
    }
  };

  if (categoryName) fetchData();
}, [categoryName, storeSales]);




const addToCart = (product) => {
  try {
    // 🚫 Prevent adding if out of stock
    if (product.stockStatus === "out") {
      toast.error("This product is currently out of stock.", {
        position: "bottom-right",
      });
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const actualPrice = product.salePrice || product.productPrice;

    const existingProduct = existingCart.find(
      item => item.id === product.id
    );

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
    window.dispatchEvent(new Event('toggle-cart'));

  } catch (error) {
    console.error('❌ Error adding to cart:', error);
    toast.error('Failed to add to cart.', { position: 'bottom-right' });
  }
};

useEffect(() => {
  let filtered = [...products];

  // Apply price range
  filtered = filtered.filter(product => {
    const price = product.salePrice || product.productPrice;
    return price >= currentMin && price <= currentMax;
  });

  // Apply sorting
  if (priceSort === "low-high") {
    filtered.sort((a, b) =>
      (a.salePrice || a.productPrice) -
      (b.salePrice || b.productPrice)
    );
  }

  if (priceSort === "high-low") {
    filtered.sort((a, b) =>
      (b.salePrice || b.productPrice) -
      (a.salePrice || a.productPrice)
    );
  }

  setFilteredProducts(filtered);
}, [currentMin, currentMax, priceSort, products]);

  return (
    <>
      <div className="sticky">
        <Navbar />
      </div>
      <div className="background">
        <div className="body-cover">
          <div className="banner-title">
            <h1>{categoryName} - {products.length}</h1>
          </div>
        </div>
      </div>

      <div className="product-container">
        <div className="body-cover">
          <div className="products">
                  <div className='new-filter' style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection:'row',
                  }}>
                  <h2>Products</h2>
           <div className="filter-container">
  <label htmlFor="price-filter">
    Filter Products by:
  </label>
 <select
      value={priceSort}
      onChange={(e) => setPriceSort(e.target.value)}
      style={{ padding: "6px" }}
    >
      <option value="">Default</option>
      <option value="low-high">Price: Low → High</option>
      <option value="high-low">Price: High → Low</option>
    </select>
</div>

                </div>
                <br/>
            <div className="grid-4x">
              {filteredProducts.length === 0 ? (
                <p>No products found for this category.</p>
              ) : (
                filteredProducts.map(product => (
                  <Link to={`/product/${product.id}`} className="no-decoration" key={product.id}>
                    <div className="product-card">
                      <div
                        className="product-img-container"
                        style={{ backgroundImage: `url(${product.productImage})` }}
                      >
                                          <div className="product-buttons">
  {product.stockStatus === "out" ? (
    <button className="product-button disabled" disabled style={{border:'none',backgroundColor:'red',color:'white'}}>
      Out of Stock
    </button>
  ) : (
    <button
      className="product-button"
      onClick={(e) => {
        e.preventDefault();
        addToCart(product);
      }}
    >
      <i className="fa-regular fas fa-cart-plus"></i>
    </button>
  )}
</div>
                      </div>
                      <div className="product-text-holder">
                        <div className="product-name">
                          <p className="product-name-text">{product.productName}</p>
                        </div>
                        <div className="product-price">
                          {product.salePrice ? (
                            <>
                              <p className="product-price-text">
                                <span style={{ textDecoration: 'line-through', color: 'gray' }}>
                                  Rs.{product.productPrice}
                                </span>{' '}
                                <span style={{ color: 'red', fontWeight: 'bold' }}>
                                  Rs.{product.salePrice}
                                </span>
                              </p>
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

      <ToastContainer />
      <BottomBar />
      <Footer />
    </>
  );
};

export default CategoryProductsPage;
