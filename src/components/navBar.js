import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [siteName, setSiteName] = useState('');
  const [siteLogo, setSiteLogo] = useState('');
  const [instaID, setInstaID] = useState('');
  const [phone, setPhone] = useState('');
  const [categories, setCategories] = useState([]);
  const [notification, setNotification] = useState('');
  const [showWomen, setShowWomen] = useState(false);
  const [showKids, setShowKids] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // Cart drawer states
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartVersion, setCartVersion] = useState(0);


  useEffect(() => {
    const db = getFirestore();

    const fetchStoreDetails = async () => {
      const dataCollection = collection(db, 'storeDetails');
      try {
        const querySnapshot = await getDocs(dataCollection);
        if (!querySnapshot.empty) {
          const siteInfo = querySnapshot.docs[0].data();
          setSiteName(siteInfo.siteName);
          setSiteLogo(siteInfo.storeLogo);
          setInstaID(siteInfo.instaID);
          setPhone(siteInfo.phone);
        }
      } catch (error) {
        console.error("Error retrieving store data: ", error);
      }
    };

    const fetchCategories = async () => {
      const categoryCollection = collection(db, 'Category');
      try {
        const snapshot = await getDocs(categoryCollection);
        const data = snapshot.docs.map(doc => doc.data());
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

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

    fetchStoreDetails();
    fetchCategories();
    fetchNotification();


  }, []);

  function handleHamburger() {
    const mobilenav = document.getElementById('mobilenav');
    mobilenav.style.display = mobilenav.style.display === 'flex' ? 'none' : 'flex';
  }

useEffect(() => {
  const loadCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(cart);
    } catch {
      setCartItems([]);
    }
  };

  loadCart();

  // check cart every 500ms
  const interval = setInterval(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      setCartVersion(v => v + 1);
    }
  }, 500);

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  try {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);
  } catch {
    setCartItems([]);
  }
}, [cartVersion]);


  const closeMobileNav = () => {
    const mobilenav = document.getElementById('mobilenav');
    if (mobilenav) {
      mobilenav.style.display = 'none';
    }
    setShowWomen(false);
    setShowKids(false);
    setShowContact(false);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };




const updateQuantity = (id, delta) => {
  setCartItems(prevItems => {
    const updated = prevItems.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
        : item
    );

    // ✅ sync with localStorage so polling doesn't overwrite
    localStorage.setItem('cart', JSON.stringify(updated));

    return updated;
  });
};

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.productPrice) * item.quantity,
    0
  );
  const total = subtotal;
  
  return (
    <>
      {/* Notification */}
      <div className='notification'>
        <p>{notification || 'Free shipping on shopping of Rs:3000 or above.'}</p>
      </div>

      {/* Navbar */}
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
                <Link to="/About" className='no-decoration navLink'><p>About</p></Link>
                <Link to="/Sale" className='no-decoration navLink'><p>Sale</p></Link>
                <Link to="/ForHer" className='no-decoration navLink'><p>For Her</p></Link>
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

                {/* Cart icon now toggles drawer */}
                <button className="no-decoration navLink new-icon" onClick={toggleCart} style={{ background: 'none', border: 'none' }}>
                  <i className="fa-solid fa-bag-shopping"></i>
                  {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
                </button>

                <Link to="/Login" className="no-decoration navLink">
                  <i className="fa-regular fa-user"></i>
                </Link>
              </div>
            </div>

            {/* Mobile Nav */}
            <div className="mobile-nav" id="mobilenav">
              <Link to="/Sale" className="no-decoration navLink"><p>Sale</p></Link>
              <Link to="/ForHer" className="no-decoration navLink"><p>For Her</p></Link>

              {/* Women Dropdown */}
              <div className="dropdown-section">
                <p onClick={() => setShowWomen(!showWomen)} className="dropdown-title clickable">

                  <span>Women</span>
                  <span>
                    {showWomen ? '▲' : '▼'}
                  </span>
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

                  <span>
                    Kids
                  </span>
                  <span>
                    {showKids ? '▲' : '▼'}
                  </span>
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

                  <span>Contact Us</span>
                  <span> {showContact ? '▲' : '▼'}</span>

                </p>
                {showContact && (
                  <ul className="dropdown">
                    {instaID && (
                      <li>
                        <a href={`https://instagram.com/${instaID}`} target="_blank" rel="noopener noreferrer" className="no-decoration navLink" onClick={closeMobileNav}>
                          Instagram
                        </a>
                      </li>
                    )}
                    <li>
                      <a href="https://www.facebook.com/profile.php?id=61578300291320" target="_blank" rel="noopener noreferrer" className="no-decoration navLink" onClick={closeMobileNav}>
                        Facebook
                      </a>
                    </li>
                    {phone && (
                      <li>
                        <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" className="no-decoration navLink" onClick={closeMobileNav}>
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

      {/* Shopify Style Cart Drawer */}
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button className="close-cart" onClick={toggleCart}>×</button>
        </div>
        {cartItems.length === 0 ? (
          <p className="empty-cart">Your cart is empty.</p>
        ) : (
          <div className="cart-items">
            {cartItems.map((item) => (
              <>
                <div className="cart-item" key={item.id}>
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="item-image"
                  />

                  <div className="item-details">
                    <h2>{item.productName}</h2>
                    <p>PKR {Number(item.productPrice).toFixed(2)}</p>
                    <div className="item-actions">
                      <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                      <button className="remove-item" onClick={() => removeItem(item.id)}>
                        x
                      </button>
                    </div>
                  </div>
                </div>


              </>
            ))}
          </div>
        )}
        <div className="cart-footer">
          <p>Order Summary</p>


          <p>Total: PKR {total.toFixed(2)}</p>

          <Link to="/checkout" className="checkout-btn no-decoration">
            Proceed to Checkout
          </Link>
        </div>
      </div>


    </>
  );
};

export default Navbar;
