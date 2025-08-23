import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

import { Link } from 'react-router-dom';

const Navbar = () => {
  const [siteName, setSiteName] = useState('');
  const [siteLogo, setSiteLogo] = useState('');
  const [instaID, setInstaID] = useState('');
  const [phone, setPhone] = useState('');
  const [categories, setCategories] = useState([]);
  const [notification, setNotification] = useState(''); // NEW STATE
const [showWomen, setShowWomen] = useState(false);
const [showKids, setShowKids] = useState(false);
const [showContact, setShowContact] = useState(false);


  useEffect(() => {
        const db = getFirestore();
    const fetchStoreDetails = async () => {
      const db = getFirestore();
      const dataCollection = collection(db, 'storeDetails');
      try {
        const querySnapshot = await getDocs(dataCollection);
        if (!querySnapshot.empty) {
          const siteInfo = querySnapshot.docs[0].data();
          setSiteName(siteInfo.siteName);
          setSiteLogo(siteInfo.storeLogo);
          setInstaID(siteInfo.instaID);
          setPhone(siteInfo.phone);
        } else {
          console.log('No documents found!');
        }
      } catch (error) {
        console.error("Error retrieving store data: ", error);
      }
    };

    const fetchCategories = async () => {
      const db = getFirestore();
      const categoryCollection = collection(db, 'Category');
      try {
        const snapshot = await getDocs(categoryCollection);
        const data = snapshot.docs.map(doc => doc.data());
        console.log('Categories fetched:', data);
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchStoreDetails();
    fetchCategories();

     const fetchNotification = async () => {
      try {
        const notificationsRef = collection(db, 'notifications');
        const q = query(notificationsRef, orderBy('createdAt', 'desc'), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          setNotification(data.message || '');
        }
      } catch (err) {
        console.error('❌ Error fetching notification:', err);
      }
    };

 
    fetchNotification(); // CALL IT

  }, []);

  

  function handleHamburger() {
    const mobilenav = document.getElementById('mobilenav');
    mobilenav.style.display = mobilenav.style.display === 'flex' ? 'none' : 'flex';
  }

  function handleSearch() {
    const searchContainer = document.getElementById('searchContainer');
    searchContainer.style.display = searchContainer.style.display === 'flex' ? 'none' : 'flex';
  }

  const renderCategoryLinks = (mainCategory) => {
    const filtered = categories.filter(cat => cat.main === mainCategory);
    return (
      <ul className="dropdown">
        {filtered.map((cat, index) => (
          <li key={index}>
            <Link to={`/category/${cat.name}`} className="no-decoration navLink">
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    );
  };
const closeMobileNav = () => {
  const mobilenav = document.getElementById('mobilenav');
  if (mobilenav) {
    mobilenav.style.display = 'none';
  }
  setShowWomen(false);
  setShowKids(false);
  setShowContact(false);
};

  return (
    <>
      <div className='notification'>
        <p>{notification || 'Free shipping on shopping of Rs:3000 or above.'}</p>
      </div>

      <div className="wrapper">
        <div className="navbar sticky">
          <div className="cover">
            <div className="header">
              <div className="nav-container hamburger">
                <button className="toggle-button" style={{ color: 'black' }} onClick={handleHamburger}>
                  <i className="fa-solid fa-bars"></i>
                </button>
              </div>
              <div className="nav-container links">
                <Link to="/" className='no-decoration navLink'><p>Home</p></Link>
                <p style={{ opacity: '0%' }}>--</p>
                <Link to="/About" className='no-decoration navLink'><p>About</p></Link>
                <p style={{ opacity: '0%' }}>--</p>
                <Link to="/Sale" className='no-decoration navLink'><p>Sale</p></Link>
                <p style={{ opacity: '0%' }}>--</p>
                <Link to="/ForHer" className='no-decoration navLink'><p>For Her</p></Link>
                <p style={{ opacity: '0%' }}>--</p>
                <Link to="/Contact" className='no-decoration navLink'><p>Contact</p></Link>
              </div>
              <div className="nav-container logo-holder">
                {siteLogo ? (
                  <Link to="/"><img src={siteLogo} alt="Logo" className="logo" /></Link>
                ) : (
                  <Link to="/"><h1>{siteName}</h1></Link>
                )}
              </div>
              <div className="nav-container actions">
                <Link to="/GiftPage" className="no-decoration navLink new-icon">
                  <i className="fa-solid fa-gift"></i>
                </Link>
                <p style={{ opacity: '0%' }} className='new-icon'>--</p>
                <Link to="/Cart" className="no-decoration navLink new-icon">
                  <i className="fa-regular fas fa-cart-shopping"></i>
                </Link>
                <p style={{ opacity: '0%' }} className='new-icon'>--</p>
                <Link to="/Login" className="no-decoration navLink">
                  <i className="fa-regular fa-user"></i>
                </Link>
              </div>
            </div>

      <div className="mobile-nav" id="mobilenav">
  <Link to="/Sale" className="no-decoration navLink">
    <p>Sale</p>
  </Link>
  <Link to="/ForHer" className="no-decoration navLink">
    <p>For Her</p>
  </Link>

  {/* Women Dropdown */}
  <div className="dropdown-section">
    <p onClick={() => setShowWomen(!showWomen)} className="dropdown-title clickable">
      Women {showWomen ? '▲' : '▼'}
    </p>
    {showWomen && (
      <ul className="dropdown">
        {categories
          .filter(cat =>
            [
              'Bow Scrunchies',
              'Scrunchies',
              'Sailor Bow',
              'Classic Bow',
              'Bow Ties',
              'Tail Bow',
     
            ].includes(cat.categoryName)
          )
          .map((cat, i) => (
            <li key={i}>
              <Link to={`/category/${cat.categoryName}`} className="no-decoration navLink" onClick={closeMobileNav}>
                {cat.categoryName}
              </Link>
            </li>
          ))}
      </ul>
    )}
  </div>

  {/* Kids Dropdown */}
  <div className="dropdown-section">
    <p onClick={() => setShowKids(!showKids)} className="dropdown-title clickable">
      Kids {showKids ? '▲' : '▼'}
    </p>
    {showKids && (
      <ul className="dropdown">
        {categories
          .filter(cat =>
            [
              'Sailor Bow',
              'Classic Bow',
              'Butterfly Bows',
              'Hair pins for babies',
              'Kids Hair Bands',
              'Hair pins for girls'
            ].includes(cat.categoryName)
          )
          .map((cat, i) => (
            <li key={i}>
              <Link to={`/category/${cat.categoryName}`} className="no-decoration navLink" onClick={closeMobileNav}>
                {cat.categoryName}
              </Link>
            </li>
          ))}
      </ul>
    )}
  </div>

  {/* Contact Dropdown */}
  <div className="dropdown-section">
    <p onClick={() => setShowContact(!showContact)} className="dropdown-title clickable">
      Contact Us {showContact ? '▲' : '▼'}
    </p>
    {showContact && (
      <ul className="dropdown">
        {instaID && (
          <li>
            <a
              href={`https://instagram.com/${instaID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="no-decoration navLink"
              onClick={closeMobileNav}
            >
              Instagram
            </a>
          </li>
        )}
        <li>
          <a
            href="https://www.facebook.com/profile.php?id=61578300291320"
            target="_blank"
            rel="noopener noreferrer"
            className="no-decoration navLink"
            onClick={closeMobileNav}
          >
            Facebook
          </a>
        </li>
        {phone && (
          <li>
            <a
              href={`https://wa.me/${phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="no-decoration navLink"
              onClick={closeMobileNav}
            >
              WhatsApp
            </a>
          </li>
        )}
      </ul>
    )}
  </div>
</div>


          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
