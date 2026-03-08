import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getFirestore, collection, getDocs,query, orderBy  } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ITEMS_PER_LOAD = 8;

const FIlteredProducts = () => {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const [loadingMore, setLoadingMore] = useState(false);
  const observer = useRef();
  const [priceSort, setPriceSort] = useState("");
  
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

      const saleMap = new Map();
      saleSnap.docs.forEach(doc => saleMap.set(doc.id, doc.data()));

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

      // Add sale prices
      const mergedList = productList.map(product => {
        const individualSale = saleMap.get(product.id);

        if (individualSale?.salePrice) return { ...product, salePrice: individualSale.salePrice };

        const categoryKey = product.productType?.toLowerCase().trim();
        const categorySalePercentage = categorySalesMap.get(categoryKey);

        if (categorySalePercentage && product.productPrice) {
          const discountedPrice =
            product.productPrice - (product.productPrice * categorySalePercentage) / 100;
          return { ...product, salePrice: parseFloat(discountedPrice.toFixed(2)) };
        }

        return product;
      });

      // Separate products with and without createdAt
      const withTimestamp = mergedList
        .filter(p => p.createdAt)
        .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds); // newest first

      const withoutTimestamp = mergedList.filter(p => !p.createdAt);

      // Merge them: newest first, then old products without createdAt
      const finalList = [...withTimestamp, ...withoutTimestamp];

      setProducts(finalList);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
    }
  };

  fetchAllProducts();
}, []);

  const loadMoreProducts = useCallback(() => {
    if (visibleCount >= products.length) return;

    setLoadingMore(true);

    // small delay so skeleton is actually visible
    setTimeout(() => {
      setVisibleCount(prev =>
        Math.min(prev + ITEMS_PER_LOAD, products.length)
      );
      setLoadingMore(false);
    }, 600);
  }, [products.length, visibleCount]);

  const lastProductRef = useCallback(
    node => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          loadMoreProducts();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadMoreProducts]
  );

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

    // ✅ Fire Meta AddToCart Event
      if (window.fbq) {
        console.log("Meta AddToCart Fired");
        window.fbq('track', 'AddToCart', {
          content_ids: [product.id],
          content_name: product.productName,
          content_type: 'product',
          value: actualPrice,
          currency: 'PKR'
        });
      }

  } catch (error) {
    console.error('❌ Error adding to cart:', error);
    toast.error('Failed to add to cart.', { position: 'bottom-right' });
  }
};

  const skeletons = Array.from({ length: ITEMS_PER_LOAD });
const sortedProducts = [...products].sort((a, b) => {
  const priceA = a.salePrice || a.productPrice;
  const priceB = b.salePrice || b.productPrice;

  if (priceSort === "low-high") {
    return priceA - priceB;
  }

  if (priceSort === "high-low") {
    return priceB - priceA;
  }

  return 0;
});
  return (
    <>
      <div className="product-container">
        <div className="body-cover">
          <div className="products">
               <div className='new-filter' style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection:'row',
                  }}>
                    <p></p>
         <div style={{ marginBottom: "20px",  display: 'flex', alignItems: 'center' }}>
  <p style={{marginRight:'10px'}}>  Filter Products </p>
  <select
    value={priceSort}
    onChange={(e) => setPriceSort(e.target.value)}
    style={{ padding: "8px", cursor: "pointer" }}
  >
    <option value="">Sort By Price</option>
    <option value="low-high">Price: Low to High</option>
    <option value="high-low">Price: High to Low</option>
  </select>
</div>
</div>
            <div className="grid-4x">
              {products.length === 0 ? (
                skeletons.map((_, i) => (
                  <div className="product-card skeleton-card" key={i}>
                    <div className="skeleton skeleton-img"></div>
                    <div className="skeleton skeleton-text"></div>
                    <div className="skeleton skeleton-price"></div>
                  </div>
                ))
              ) : (
                sortedProducts.slice(0, visibleCount).map((product, index) => {
                  const isLast = index === visibleCount - 1;

                  return (
                    <Link
                      to={`/product/${product.id}`}
                      className="no-decoration"
                      key={product.id}
                      ref={isLast ? lastProductRef : null}
                    >
                      <div className="product-card">
                        <div
                          className="product-img-container"
                          style={{
                            backgroundImage: `url(${product.productImage})`,
                          }}
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
                  );
                })
              )}

              {loadingMore &&
                skeletons.map((_, i) => (
                  <div className="product-card skeleton-card" key={`load-${i}`}>
                    <div className="skeleton skeleton-img"></div>
                    <div className="skeleton skeleton-text"></div>
                    <div className="skeleton skeleton-price"></div>
                  </div>
                ))}
            </div>

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

export default FIlteredProducts;
