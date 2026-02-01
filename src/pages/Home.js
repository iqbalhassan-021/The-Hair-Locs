import React from 'react';
import '../App.css';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import HeroSlider from '../components/heroSlider';
import ProductShowcase from '../components/Products';
import QuickBuy from '../components/QuickBuy';
import Categories from '../components/Categories';
import FullScreenSlider from '../components/FullScreenSlider';
import OurDeliverAbles from '../components/OurDeliverAbles';
import NewAlerts from '../components/NewAlerts';
import OfferSlider from '../components/OfferSlider';
import ForHerComponent from '../components/forHer';
import BottomBar from '../components/BottomBar';
import AllProducts from '../components/AllProducts';
import GiftComp from '../components/giftComp';
import OnSalePage from '../components/saleComp';
import Heromobile from '../components/HeroMobile';
import Celebration from '../components/Celebration';
import { Helmet } from "react-helmet-async";
function Home(){
    return (
        <>
      
     <Helmet>
        <title>Imzalocc | Premium Hair Accessories</title>

        <meta
          name="description"
          content="Imzalocc offers premium hair products and accessories designed for healthy, strong, and stylish hair."
        />

        <meta
          name="keywords"
          content="Imzalocc, hair products, hair accessories, hair care, beauty brand"
        />

        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content="Imzalocc | Premium Hair Products & Accessories" />
        <meta
          property="og:description"
          content="Discover premium hair products and accessories by Imzalocc."
        />
        <meta property="og:url" content="https://imzalocc.com" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://imzalocc.com/og-image.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Imzalocc | Premium Hair Products & Accessories" />
        <meta
          name="twitter:description"
          content="Premium hair products and accessories for modern hair care."
        />
        <meta name="twitter:image" content="https://imzalocc.com/og-image.jpg" />
      </Helmet>

      <h1 style={{display:'none'}} >Imzalocc – Premium Hair Accessories</h1>
            <Navbar/>
       
     
            <HeroSlider/>
            <NewAlerts />
            <Categories/>
            <Heromobile/>
            <AllProducts/>
            <OfferSlider/>
            <OnSalePage/>
            <GiftComp/>
            <FullScreenSlider/>
            <BottomBar/>
            <Footer/>

        </>

    );
}
export default Home;
