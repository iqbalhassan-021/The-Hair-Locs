import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const db = getFirestore();
        const productsRef = collection(db, "products");
        const snapshot = await getDocs(productsRef);

        const slideData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSlides(slideData);
      } catch (error) {
        console.error("❌ Error fetching products for slider:", error);
      }
    };

    fetchSlides();
  }, []);

  const settings = {
    arrows: false,
    dots: false,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: false,
    pauseOnFocus: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 500,
    cssEase: "ease-in-out",
  };

  return (
    <div className="hero-container">
      <div className="body-cover">
        {slides.length === 0 ? (
          <p style={{ textAlign: "center" }}>Loading products...</p>
        ) : (
          <Slider {...settings} className="hero">
            {slides.map((slide, index) => (
              <div className="hero-slide" key={slide.id || index}>
                <div className="hero-text-holder">
                  <p className="hero-heading">{slide.productName}</p>
                  <p className="hero-subheading">{slide.productDescription}</p>
                  <Link to="/products" className="primary-button">
                    Shop Now
                  </Link>
                </div>
                <div className="hero-img-holder">
                        <div class="image-wrapper-hero">
                        <div class="the-hero-img" style={{ backgroundImage: `url(${slide.productImage})` }}>
                            
                        </div>
                    </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default HeroSlider;
