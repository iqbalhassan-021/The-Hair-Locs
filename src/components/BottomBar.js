import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, orderBy, limit, where  } from 'firebase/firestore';
import { Link, useLocation } from 'react-router-dom';

const BottomBar = () => {
    const [phone, setPhone] = useState('');
  useEffect(() => {
    const db = getFirestore();

    const fetchStoreDetails = async () => {
      const dataCollection = collection(db, 'storeDetails');
      try {
        const querySnapshot = await getDocs(dataCollection);
        if (!querySnapshot.empty) {
          const siteInfo = querySnapshot.docs[0].data();
       
          setPhone(siteInfo.phone);
        }
      } catch (error) {
        console.error("Error retrieving store data: ", error);
      }
    };
    fetchStoreDetails();



  }, []);




  const location = useLocation();
const handleCartClick = (e) => {
    e.preventDefault(); // Stop the Link from navigating if you use one
    window.dispatchEvent(new Event('toggle-cart'));
  };
  // Helper function to check if a link is active
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="bottom-bar">
        <Link to="/Products" className={`bottom-link ${isActive('/Products')}`}>
        <i className="fas fa-shop"></i>
        <span>Shop</span>
      </Link>


      <Link to="/Search" className={`bottom-link ${isActive('/Search')}`}>
        <i class="fa-solid fa-magnifying-glass"></i>
        <span>Search</span>
      </Link>

      <Link onClick={handleCartClick} className={`bottom-link ${isActive('/Sale')}`}>
        <i class="fa-solid fa-cart-shopping"></i>
        <span>Cart</span>
      </Link>

      <Link  to={`https://wa.me/${phone || ''}`}  className={`bottom-link ${isActive('/ForHer')}`}>
       <i class="fa-brands fa-whatsapp" style={{color:'green'}}></i>
        <span style={{color:'green'}}>Whatsapp</span>
      </Link>
    </div>
  );
};

export default BottomBar;