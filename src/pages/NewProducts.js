import React, { useState, useEffect } from 'react';

import Navbar from '../components/navBar';
import Footer from '../components/footer';
import BottomBar from '../components/BottomBar';
import 'react-toastify/dist/ReactToastify.css';
import AllProducts from '../components/AllProducts';
import FIlteredProducts from '../components/FIlteredProducts';

const NewProducts = () => {
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  return (
    <>
      <Navbar />
      <FIlteredProducts/>
      <BottomBar />
      <Footer />
    </>
  );
};

export default NewProducts;
