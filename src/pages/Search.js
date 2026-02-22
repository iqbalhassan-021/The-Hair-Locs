import React, { useEffect, useState, useMemo } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import Footer from "../components/footer";
import Navbar from "../components/navBar";
import BottomBar from "../components/BottomBar";

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  useEffect(() => {
    const fetchAllProducts = async () => {
      const db = getFirestore();
      const productsRef = collection(db, "products");
      const onSaleRef = collection(db, "onSale");
      const storeSaleRef = collection(db, "storeSale");

      try {
        const [productSnap, saleSnap, storeSaleSnap] = await Promise.all([
          getDocs(productsRef),
          getDocs(onSaleRef),
          getDocs(storeSaleRef),
        ]);

        const productList = productSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const saleMap = new Map();
        saleSnap.docs.forEach((doc) =>
          saleMap.set(doc.id, doc.data())
        );

        const categorySalesMap = new Map();
        storeSaleSnap.docs.forEach((doc) => {
          const data = doc.data();
          if (data.categoryId && data.salePercentage) {
            categorySalesMap.set(
              data.categoryId.toLowerCase().trim(),
              data.salePercentage
            );
          }
        });

        const mergedList = productList.map((product) => {
          const individualSale = saleMap.get(product.id);

          if (individualSale?.salePrice)
            return { ...product, salePrice: individualSale.salePrice };

          const categoryKey = product.productType?.toLowerCase().trim();
          const categorySalePercentage =
            categorySalesMap.get(categoryKey);

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

        setProducts(mergedList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];

    return products.filter((product) => {
      const text = searchTerm.toLowerCase();
      return (
        product.productName?.toLowerCase().includes(text) ||
        product.productCode?.toLowerCase().includes(text) ||
        product.productType?.toLowerCase().includes(text)
      );
    });
  }, [searchTerm, products]);

  return (
    <>
    <Navbar />
    <div
      style={{
        maxWidth: "900px",
        margin: "60px auto",
        padding: "0 20px",
        fontFamily: "Helvetica, Arial, sans-serif",
      }}
    >
      {/* Title */}
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "500",
          marginBottom: "30px",
          letterSpacing: "0.5px",
        }}
      >
        Search
      </h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "14px 16px",
          fontSize: "16px",
          border: "1px solid #e5e5e5",
          outline: "none",
          marginBottom: "30px",
          transition: "border 0.2s ease",
        }}
        onFocus={(e) => (e.target.style.border = "1px solid #000")}
        onBlur={(e) => (e.target.style.border = "1px solid #e5e5e5")}
      />

      {/* Results */}
      <div>
        {loading ? (
          <p style={{ color: "#777" }}>Loading products...</p>
        ) : searchTerm && filteredProducts.length === 0 ? (
          <p style={{ color: "#777" }}>No results found.</p>
        ) : (
          filteredProducts.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "16px 0",
                textDecoration: "none",
                borderBottom: "1px solid #f0f0f0",
                color: "inherit",
                transition: "background 0.2s ease",
              }}
            >
              <img
                src={product.productImage}
                alt={product.productName}
                style={{
                  width: "70px",
                  height: "70px",
                  objectFit: "cover",
                  marginRight: "20px",
                  border: "1px solid #f0f0f0",
                }}
              />

              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "16px",
                    margin: "0 0 6px 0",
                    fontWeight: "500",
                  }}
                >
                  {product.productName}
                </p>

                {product.salePrice &&
                product.salePrice !== product.productPrice ? (
                  <div>
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "#888",
                        marginRight: "8px",
                        fontSize: "14px",
                      }}
                    >
                      Rs.{product.productPrice}
                    </span>
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: "600",
                      }}
                    >
                      Rs.{product.salePrice}
                    </span>
                  </div>
                ) : (
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: "500",
                    }}
                  >
                    Rs.{product.productPrice}
                  </span>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
    <BottomBar />
    <Footer />
    </>
  );
};

export default SearchPage;
