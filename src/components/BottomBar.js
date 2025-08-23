import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomBar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: 'fa-home' },
    { path: '/Products', label: 'SHOP', icon: 'fa-shop' },
    { path: '/Sale', label: 'Sale', icon: 'fa-tags' },
    { path: '/Cart', label: 'Cart', icon: 'fa-shopping-cart' },

  ];

  return (
    <div className="bottom-bar">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`bottom-link ${location.pathname === item.path ? 'active' : ''}`}
        >
          <i className={`fas ${item.icon}`}></i>
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default BottomBar;
