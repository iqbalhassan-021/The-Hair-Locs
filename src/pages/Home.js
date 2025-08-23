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

function Home(){
    return (
        <>
      
        <div className='sticky'>
            <Navbar/>
        </div>
     
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
