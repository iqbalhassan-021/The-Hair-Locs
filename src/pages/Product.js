import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import AllProducts from '../components/AllProducts';
import BottomBar from '../components/BottomBar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [instaID, setInstaID] = useState('');
  const [currency, setcurrency] = useState('');
  const [whsappID, setwhsappID] = useState('');
  const [shippingrate, setshippingrate] = useState('');
  const [products, setProducts] = useState([]);
  const [salePrice, setSalePrice] = useState(null);
  const [mainImage, setMainImage] = useState('');

  const [showDetails, setShowDetails] = useState({
    type: false,
    code: false,
    desc: false,
    shipping: false,
    color: false,
    size: false,
  });

  const toggleSection = (key) => {
    setShowDetails((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const fetchProductData = async () => {
      const db = getFirestore();
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          console.error("❌ Product not found");
          return;
        }

        const prodData = docSnap.data();
        setProduct(prodData);

        // set default main image
        setMainImage(prodData.productImage);

        const onSaleSnap = await getDocs(collection(db, 'onSale'));
        const onSaleMatch = onSaleSnap.docs.find(
          (doc) => doc.data().productCode === prodData.productCode
        );
        if (onSaleMatch) {
          setSalePrice(onSaleMatch.data().salePrice);
        } else {
          const storeSaleSnap = await getDocs(collection(db, 'storeSale'));
          storeSaleSnap.forEach((saleDoc) => {
            const saleData = saleDoc.data();
            if (
              saleData.categoryId === prodData.productType ||
              saleData.categoryId === prodData.categoryId
            ) {
              const discount =
                (prodData.productPrice * saleData.salePercentage) / 100;
              const discountedPrice = prodData.productPrice - discount;
              setSalePrice(discountedPrice.toFixed(2));
            }
          });
        }
      } catch (error) {
        console.error("❌ Error loading product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  useEffect(() => {
    const fetchProductsList = async () => {
      const db = getFirestore();
      try {
        const dataCollection = collection(db, 'products');
        const querySnapshot = await getDocs(dataCollection);
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
      } catch (error) {
        console.error("❌ Error retrieving product list:", error);
      }
    };
    fetchProductsList();
  }, []);

  useEffect(() => {
    const fetchSiteInfo = async () => {
      const db = getFirestore();
      try {
        const siteSnap = await getDocs(collection(db, 'storeDetails'));
        if (!siteSnap.empty) {
          const siteData = siteSnap.docs[0].data();
          setInstaID(siteData.instaID);
          setwhsappID(siteData.phone);
          setcurrency(siteData.currency);
          setshippingrate(siteData.shippingrate);
        }
      } catch (error) {
        console.error("❌ Error fetching site info:", error);
      }
    };
    fetchSiteInfo();
  }, []);

  const addToCart = (product) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
      const actualPrice = salePrice || product.productPrice;

      let updatedCart;

      const existingProduct = existingCart.find((item) => item.id === product.id);

      if (existingProduct) {
        updatedCart = existingCart.map((item) =>
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
            productSize: product.productSize || "Not Specified",
            productColor: product.productColor || "Not Specified",
            productCode: product.productCode,
            productType: product.productType,
            quantity: 1,
          },
        ];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      
       window.dispatchEvent(new Event('toggle-cart'));
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      toast.error("Failed to add to cart.", { position: "bottom-right" });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>No product found</p>;

  const images = [
    product.productImage,
    product.productImage1,
    product.productImage2,
    product.productImage3,
  ].filter(Boolean);

  return (
    <>
   
        <Navbar />
    

      <div className="quick-buy">
        <div className="cover">
          <div className="container">
            <div className="the-product">
              {images.length > 0 && (
                <>
                  <div className="main-image">
                    <img
                      src={mainImage}
                      alt="Main product"
                      style={{ width: "100%", maxHeight: "400px", objectFit: "contain" }}
                    />
                  </div>

                  <div className="thumbnail-row" style={{ marginTop: "10px" }}>
                    {images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`thumb-${idx}`}
                        onClick={() => setMainImage(img)}
                        style={{
                          width: "60px",
                          height: "60px",
                          margin: "5px",
                          cursor: "pointer",
                          border: mainImage === img ? "2px solid black" : "1px solid #ccc",
                          objectFit: "cover",
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="the-details">
              <p className="title">{product.productName}</p>
              <br />
              <p className="price">
                {salePrice ? (
                  <>
                    <span className="original-price">
                      From {currency}
                      {product.productPrice}
                    </span>
                    <span className="sale-price">
                      {" "}
                      {currency}
                      {salePrice}
                    </span>
                  </>
                ) : (
                  <>From {currency}{product.productPrice}</>
                )}
              </p>
              <br />

              {/* Details sections (color, size, etc.) */}
              <div className="shopify-box" onClick={() => toggleSection("color")}>
                <div className="shopify-box-inner">
                  <i className="fas fa-palette shopify-icon"></i>
                  <div className="shopify-text">
                    <span className="shopify-label">Color</span>
                    {showDetails.color && (
                      <p className="shopify-value">
                        {product.productColor || "Not Specified yet"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="shopify-box" onClick={() => toggleSection("size")}>
                <div className="shopify-box-inner">
                  <i className="fas fa-expand shopify-icon"></i>
                  <div className="shopify-text">
                    <span className="shopify-label">Size</span>
                    {showDetails.size && (
                      <p className="shopify-value">
                        {product.productSize || "Not Specified yet"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="shopify-box" onClick={() => toggleSection("desc")}>
                <div className="shopify-box-inner">
                  <i className="fas fa-align-left shopify-icon"></i>
                  <div className="shopify-text">
                    <span className="shopify-label">Description</span>
                    {showDetails.desc && (
                      <p className="shopify-value">
                        {product.productDescription ||
                          "No description available"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div
                className="shopify-box"
                onClick={() => toggleSection("shipping")}
              >
                <div className="shopify-box-inner">
                  <i className="fas fa-truck shopify-icon"></i>
                  <div className="shopify-text">
                    <span className="shopify-label">Shipping</span>
                    {showDetails.shipping && (
                      <p className="shopify-value">
                        Average Shipping Rate {currency}
                        {shippingrate}, may change based on location.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {products
                .filter((pay) => pay.productCode === product.productCode)
                .map((pay) => (
                  <button
                    className="primary-button"
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product);
                    }}
                  >
                    <p>Add to Cart</p>
                    <i className="fas fa-shopping-cart"></i>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
      <AllProducts />
      <BottomBar />
      <Footer />
    </>
  );
};

export default Product;
