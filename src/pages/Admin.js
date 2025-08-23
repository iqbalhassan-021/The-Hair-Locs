import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc, getFirestore, getDocs, deleteDoc, doc, setDoc, updateDoc,serverTimestamp  } from 'firebase/firestore';
import { app } from '../firebase';

const AdminPage = () => {
  const db = getFirestore(app);

  // State for products, orders, categories, subscribers, product types, hero slider, sale, and banner
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [saleProduct, setSaleProduct] = useState(null);
  const [newSalePrice, setNewSalePrice] = useState('');
  const [forHerProduct, setForHerProduct] = useState(null);
  const [heroSlides, setHeroSlides] = useState([]);
  const [editingSlide, setEditingSlide] = useState(null);
  const [saleSections, setSaleSections] = useState([]);
  const [editingSaleSection, setEditingSaleSection] = useState(null);
  const [bannerSections, setBannerSections] = useState([]);
  const [editingBannerSection, setEditingBannerSection] = useState(null);
  const [onSale, setOnSale] = useState([]);
  const [salePercentage, setSalePercentage] = useState('');
  const [notification, setNotification] = useState('');
  const [floatingMessage, setFloatingMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
    const [sales, setSales] = useState([]);

    const fetchSales = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'storeSale'));
        const salesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSales(salesList);
      } catch (error) {
        console.error('❌ Error fetching sales:', error);
      }
    };
    useEffect(() => {
      fetchSales();
    }, []);
const handleDeleteSale = async (saleId) => {
  try {
    await deleteDoc(doc(db, 'storeSale', saleId));
    fetchSales(); // refresh list after deletion
  } catch (error) {
    console.error('❌ Failed to delete sale:', error);
    alert('Could not delete sale.');
  }
};
const handleEditSale = (sale) => {
  setSalePercentage(sale.salePercentage);
  setSelectedCategory(sale.categoryId);
  // You can add an "edit mode" flag if you want to actually update the existing sale instead of creating a new one
};

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const dataCollection = collection(db, 'products');
      try {
        const querySnapshot = await getDocs(dataCollection);
        const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productList);
        const uniqueProductTypes = [...new Set(productList.map(product => product.productType))];
        setProductTypes(uniqueProductTypes);
      } catch (error) {
        console.error("Error retrieving product data: ", error);
      }
    };
    fetchProducts();
  }, []);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      const dataCollection = collection(db, 'orders');
      const querySnapshot = await getDocs(dataCollection);
      if (!querySnapshot.empty) {
        const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersData);
      }
    };
    fetchOrders();
  }, []);
useEffect(() => {
  const fetchOnSaleItems = async () => {
    try {
      const dataCollection = collection(db, 'onSale');
      const querySnapshot = await getDocs(dataCollection);

      if (!querySnapshot.empty) {
        const saleItems = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOnSale(saleItems);
      } else {
        setOnSale([]); // Optional: clear if empty
      }
    } catch (error) {
      console.error("Error fetching onSale items:", error);
    }
  };

  fetchOnSaleItems();
}, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const dataCollection = collection(db, 'Category');
      const querySnapshot = await getDocs(dataCollection);
      if (!querySnapshot.empty) {
        const categoryData = querySnapshot.docs.map(doc => doc.data());
        setCategories(categoryData);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subscribers
  useEffect(() => {
    const fetchSubscribers = async () => {
      const dataCollection = collection(db, 'subscribers');
      try {
        const querySnapshot = await getDocs(dataCollection);
        const subscribersList = querySnapshot.docs.map(doc => doc.data());
        setSubscribers(subscribersList);
      } catch (error) {
        console.error("Error retrieving subscribers: ", error);
      }
    };
    fetchSubscribers();
  }, []);

  // Fetch main display product type
  useEffect(() => {
    const fetchMainDisplay = async () => {
      const mainDisplayDoc = await getDocs(collection(db, 'mainDisplay'));
      if (!mainDisplayDoc.empty) {
        const data = mainDisplayDoc.docs[0].data();
        setSelectedProductType(data.selectedProductType || '');
      }
    };
    fetchMainDisplay();
  }, []);

  // Fetch hero slider
  useEffect(() => {
    const fetchHeroSlides = async () => {
      const dataCollection = collection(db, 'heroSlider');
      try {
        const querySnapshot = await getDocs(dataCollection);
        const slideList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHeroSlides(slideList);
      } catch (error) {
        console.error("Error retrieving hero slider data: ", error);
      }
    };
    fetchHeroSlides();
  }, []);

  // Fetch sale sections
  useEffect(() => {
    const fetchSaleSections = async () => {
      const dataCollection = collection(db, 'saleSection');
      try {
        const querySnapshot = await getDocs(dataCollection);
        const saleList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSaleSections(saleList);
      } catch (error) {
        console.error("Error retrieving sale section data: ", error);
      }
    };
    fetchSaleSections();
  }, []);

  // Fetch banner sections
  useEffect(() => {
    const fetchBannerSections = async () => {
      const dataCollection = collection(db, 'bannerSection');
      try {
        const querySnapshot = await getDocs(dataCollection);
        const bannerList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBannerSections(bannerList);
      } catch (error) {
        console.error("Error retrieving banner section data: ", error);
      }
    };
    fetchBannerSections();
  }, []);

  // Handle product submission
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      productImage: document.getElementById('productImage').value,
      productName: document.getElementById('productName').value,
      productPrice: document.getElementById('productPrice').value,
      productCode: document.getElementById('productCode').value,
      productType: document.getElementById('productType').value,
      productSize: document.getElementById('productSize').value,
      productColor: document.getElementById('productColor').value,
      productDescription: document.getElementById('productDescription').value,
    };
    try {
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
        alert('Product updated successfully!');
        setEditingProduct(null);
      } else {
        await addDoc(collection(db, 'products'), productData);
        alert('Product added successfully!');
      }
      document.getElementById('productForm').reset();
      const querySnapshot = await getDocs(collection(db, 'products'));
      setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      showTab('hometab');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      setProducts(products.filter(product => product.id !== productId));
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    document.getElementById('productImage').value = product.productImage || '';
    document.getElementById('productName').value = product.productName || '';
    document.getElementById('productPrice').value = product.productPrice || '';
    document.getElementById('productCode').value = product.productCode || '';
    document.getElementById('productType').value = product.productType || '';
    document.getElementById('productDescription').value = product.productDescription || '';
    showTab('uploadtab');
  };

  // Handle category submission
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const categoryData = {
      categoryImage: document.getElementById('categoryImage').value,
      categoryName: document.getElementById('categoryName').value,
    };
    try {
      await addDoc(collection(db, 'Category'), categoryData);
      alert('Category added successfully!');
      const querySnapshot = await getDocs(collection(db, 'Category'));
      setCategories(querySnapshot.docs.map(doc => doc.data()));
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category. Please try again.');
    }
  };

  // Handle store submission
  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    const storeData = {
      storeLogo: document.getElementById('storeLogo').value,
      storeName: document.getElementById('storeName').value,
      instaID: document.getElementById('instaID').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
      address: document.getElementById('address').value,
      storeBanner: document.getElementById('storeBanner').value,
      storeSlogan: document.getElementById('storeSlogan').value,
      currency: document.getElementById('currency').value,
      shippingrate: document.getElementById('ratedollar').value,
      bankHolder: document.getElementById('accHolder').value,
      bankName: document.getElementById('bank').value,
      iban: document.getElementById('iban').value,
      about: document.getElementById('about').value,
    };
    try {
      await addDoc(collection(db, 'storeDetails'), storeData);
      alert('Store details saved successfully!');
    } catch (error) {
      console.error('Error saving store details:', error);
      alert('Error saving store details. Please try again.');
    }
  };

  // Handle blog submission
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    const blogData = {
      blogHeading: document.getElementById('blogHeading').value,
      blogImage: document.getElementById('blogImage').value,
      blogContent: document.getElementById('blogContent').value,
    };
    try {
      await addDoc(collection(db, 'blogs'), blogData);
      alert('Blog uploaded successfully!');
    } catch (error) {
      console.error('Error uploading blog:', error);
      alert('Error uploading blog. Please try again.');
    }
  };

  // Handle main display submission
  const handleMainDisplaySubmit = async (e) => {
    e.preventDefault();
    const selectedType = document.getElementById('mainDisplayType').value;
    try {
      await setDoc(doc(db, 'mainDisplay', 'settings'), { selectedProductType: selectedType });
      setSelectedProductType(selectedType);
      alert('Main display product type updated successfully!');
    } catch (error) {
      console.error('Error updating main display:', error);
      alert('Error updating main display. Please try again.');
    }
  };

  // Handle sale product submission
const handleSaleSubmit = async (e) => {
  e.preventDefault();
  if (!saleProduct) return;

  const percentage = parseFloat(newSalePrice);

  if (isNaN(percentage) || percentage <= 0 || percentage >= 100) {
    alert('Please enter a valid percentage (1-99).');
    return;
  }

  try {
    const discountAmount = saleProduct.productPrice * (percentage / 100);
    const salePrice = saleProduct.productPrice - discountAmount;

    await setDoc(doc(db, 'onSale', saleProduct.id), {
      ...saleProduct,
      salePrice: parseFloat(salePrice.toFixed(2)), // optional: round to 2 decimals
      salePercentage: percentage,
    });

    alert(`Product added to sale at ${percentage}% off!`);
    setSaleProduct(null);
    setNewSalePrice('');
  } catch (error) {
    console.error('❌ Error adding product to sale:', error);
    alert('Error adding product to sale. Please try again.');
  }
};

  // Handle gifts for her submission
  const handleForHerSubmit = async (e) => {
    e.preventDefault();
    if (!forHerProduct) return;
    try {
      await setDoc(doc(db, 'forHer', forHerProduct.id), forHerProduct);
      alert('Product added to Gifts for Her successfully!');
      setForHerProduct(null);
    } catch (error) {
      console.error('Error adding product to Gifts for Her:', error);
      alert('Error adding product to Gifts for Her. Please try again.');
    }
  };

  // Handle hero slider submission
  const handleHeroSliderSubmit = async (e) => {
    e.preventDefault();
    const slideData = {
      title: document.getElementById('slideTitle').value,
      description: document.getElementById('slideDescription').value,
      image: document.getElementById('slideImage').value,
    };
    try {
      if (editingSlide) {
        await updateDoc(doc(db, 'heroSlider', editingSlide.id), slideData);
        alert('Slide updated successfully!');
        setEditingSlide(null);
      } else {
        await addDoc(collection(db, 'heroSlider'), slideData);
        alert('Slide added successfully!');
      }
      document.getElementById('heroSliderForm').reset();
      const querySnapshot = await getDocs(collection(db, 'heroSlider'));
      setHeroSlides(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      showTab('heroSliderTab');
    } catch (error) {
      console.error('Error saving slide:', error);
      alert('Error saving slide. Please try again.');
    }
  };

  // Handle hero slide deletion
  const handleDeleteSlide = async (slideId) => {
    try {
      await deleteDoc(doc(db, 'heroSlider', slideId));
      setHeroSlides(heroSlides.filter(slide => slide.id !== slideId));
      alert('Slide deleted successfully!');
    } catch (error) {
      console.error('Error deleting slide:', error);
      alert('Error deleting slide. Please try again.');
    }
  };

  // Handle edit slide
  const handleEditSlide = (slide) => {
    setEditingSlide(slide);
    document.getElementById('slideTitle').value = slide.title || '';
    document.getElementById('slideDescription').value = slide.description || '';
    document.getElementById('slideImage').value = slide.image || '';
    showTab('heroSliderTab');
  };

  // Handle sale section submission
  const handleSaleSectionSubmit = async (e) => {
    e.preventDefault();
    const saleSectionData = {
      heading: document.getElementById('saleHeading').value,
      subheading: document.getElementById('saleSubheading').value,
      image: document.getElementById('saleImage').value,
    };
    try {
      if (editingSaleSection) {
        await updateDoc(doc(db, 'saleSection', editingSaleSection.id), saleSectionData);
        alert('Sale section updated successfully!');
        setEditingSaleSection(null);
      } else {
        await addDoc(collection(db, 'saleSection'), saleSectionData);
        alert('Sale section added successfully!');
      }
      document.getElementById('saleSectionForm').reset();
      const querySnapshot = await getDocs(collection(db, 'saleSection'));
      setSaleSections(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      showTab('saleSectionTab');
    } catch (error) {
      console.error('Error saving sale section:', error);
      alert('Error saving sale section. Please try again.');
    }
  };

  // Handle sale section deletion
  const handleDeleteSaleSection = async (saleId) => {
    try {
      await deleteDoc(doc(db, 'saleSection', saleId));
      setSaleSections(saleSections.filter(sale => sale.id !== saleId));
      alert('Sale section deleted successfully!');
    } catch (error) {
      console.error('Error deleting sale section:', error);
      alert('Error deleting sale section. Please try again.');
    }
  };

  // Handle edit sale section
  const handleEditSaleSection = (sale) => {
    setEditingSaleSection(sale);
    document.getElementById('saleHeading').value = sale.heading || '';
    document.getElementById('saleSubheading').value = sale.subheading || '';
    document.getElementById('saleImage').value = sale.image || '';
    showTab('saleSectionTab');
  };

  // Handle banner section submission
  const handleBannerSectionSubmit = async (e) => {
    e.preventDefault();
    const bannerSectionData = {
      image: document.getElementById('bannerImage').value,
    };
    try {
      if (editingBannerSection) {
        await updateDoc(doc(db, 'bannerSection', editingBannerSection.id), bannerSectionData);
        alert('Banner section updated successfully!');
        setEditingBannerSection(null);
      } else {
        await addDoc(collection(db, 'bannerSection'), bannerSectionData);
        alert('Banner section added successfully!');
      }
      document.getElementById('bannerSectionForm').reset();
      const querySnapshot = await getDocs(collection(db, 'bannerSection'));
      setBannerSections(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      showTab('bannerSectionTab');
    } catch (error) {
      console.error('Error saving banner section:', error);
      alert('Error saving banner section. Please try again.');
    }
  };

  // Handle banner section deletion
  const handleDeleteBannerSection = async (bannerId) => {
    try {
      await deleteDoc(doc(db, 'bannerSection', bannerId));
      setBannerSections(bannerSections.filter(banner => banner.id !== bannerId));
      alert('Banner section deleted successfully!');
    } catch (error) {
      console.error('Error deleting banner section:', error);
      alert('Error deleting banner section. Please try again.');
    }
  };

  // Handle edit banner section
  const handleEditBannerSection = (banner) => {
    setEditingBannerSection(banner);
    document.getElementById('bannerImage').value = banner.image || '';
    showTab('bannerSectionTab');
  };

  // Toggle sidebar
  const toggle = () => {
    const togglebar = document.getElementById('togglebar');
    togglebar.style.display = togglebar.style.display === 'flex' ? 'none' : 'flex';
  };

  // Tab visibility functions
  const showTab = (tabId) => {
    const tabs = [
      'hometab', 
      'storeSaleTab',
      'orders', 
      'uploadtab', 
      'editstore', 
      'upoadBlog', 
      'subscribers', 
      'categories', 
      'saleTab', 
      'forHerTab', 
      'heroSliderTab', 
      'saleSectionTab', 
      'bannerSectionTab',
      'notification',
      'floatingMessage'
    ];
    tabs.forEach(id => {
      document.getElementById(id).style.display = id === tabId ? 'block' : 'none';
    });
    const togglebar = document.getElementById('togglebar');
    togglebar.style.display = window.innerWidth <= 880 ? 'none' : 'flex';
  };

  // Copy subscribers' emails
  const handleCopy = () => {
    const textToCopy = subscribers.length === 0
      ? 'No subscribers yet'
      : subscribers.map(subscriber => subscriber.email).join('\n');
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = textToCopy;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
    alert('Emails copied to clipboard!');
  };
const handleRemoveFromSale = async (id) => {
  try {
    await deleteDoc(doc(db, 'onSale', id));
    setOnSale(prev => prev.filter(item => item.id !== id));
  } catch (error) {
    console.error("Error removing item from sale:", error);
  }
};

     {/* Store Sale */}



const handleStoreSale = async (e) => {
  e.preventDefault();

  const parsedPercentage = parseFloat(salePercentage);

  if (isNaN(parsedPercentage) || parsedPercentage <= 0 || parsedPercentage >= 100) {
    alert('Please enter a valid percentage.');
    return;
  }

  if (!selectedCategory) {
    alert('Please select a category.');
    return;
  }

  try {
    await addDoc(collection(db, 'storeSale'), {
      salePercentage: parsedPercentage,
      categoryId: selectedCategory,
      createdAt: serverTimestamp()
    });

    alert(`Sale of ${parsedPercentage}% recorded for selected category!`);
    setSalePercentage('');
    setSelectedCategory('');
    fetchSales(); // If you're displaying the table
  } catch (error) {
    console.error('❌ Error storing sale percentage:', error);
    alert('Failed to store sale value.');
  }
};


const handleNotification = async (e) => {
  //it will just a message in firestore database from a form
  e.preventDefault();
  const notificationMessage = document.getElementById('notificationMessage').value;

  try {
    await addDoc(collection(db, 'notifications'), {
      message: notificationMessage,
      createdAt: serverTimestamp()
    });
    alert('Notification sent successfully!');
  }
  catch (error) {
    console.error('❌ Error sending notification:', error);
    alert('Failed to send notification.');
    return;
  }
}
const handleFloatingMessage = async (e) => {
  e.preventDefault();
  const message = floatingMessage.trim();

  if (!message) {
    alert('Please enter a message.');
    return;
  }

  try {
    await addDoc(collection(db, 'floatingMessages'), {
      message,
      createdAt: serverTimestamp()
    });
    setFloatingMessage('');
    alert('Floating message sent successfully!');
  } catch (error) {
    console.error('❌ Error sending floating message:', error);
    alert('Failed to send floating message.');
  }
}


  return (
    
    <div className="admin-page">
      <div className="admin-section">
        <div className="cover">
          <div className="admin-actions">
            <button className="toggle-button" onClick={toggle}>
              <i className="fa-sharp fa-solid fa-bars"></i>
            </button>
            <h3>Admin Page</h3>
          </div>
        </div>
      </div>
      <div className="actions-holder">
        <div className="cover">
          <div className="Toggleactions">
            <div className="toggle-bar" id="togglebar">
              <button className="primary-button" onClick={() => showTab('hometab')}>Home</button>
              <button className="primary-button" onClick={() => showTab('storeSaleTab')}>Store Sale</button>
              <button className="primary-button" onClick={() => showTab('orders')}>Orders</button>
              <button className="primary-button" onClick={() => showTab('notification')}>Notification</button>
              <button className="primary-button" onClick={() => showTab('floatingMessage')}>floating Message</button>
              <button className="primary-button" onClick={() => showTab('uploadtab')}>Upload a Product</button>
              <button className="primary-button" onClick={() => showTab('editstore')}>Edit Store</button>
              <button className="primary-button" onClick={() => showTab('upoadBlog')}>Upload a Blog</button>
              <button className="primary-button" onClick={() => showTab('categories')}>Categories</button>
              <button className="primary-button" onClick={() => showTab('subscribers')}>Subscribers</button>
              <button className="primary-button" onClick={() => showTab('saleTab')}>Products on Sale</button>
              <button className="primary-button" onClick={() => showTab('forHerTab')}>Gifts for Her</button>
              <button className="primary-button" onClick={() => showTab('heroSliderTab')}>Hero Slider</button>
              <button className="primary-button" onClick={() => showTab('saleSectionTab')}>Sale Slider</button>
              <button className="primary-button" onClick={() => showTab('bannerSectionTab')}>Banner Slider</button>
              <Link to="/" className="no-decoration navLink">
                <button className="primary-button">Go to Store</button>
              </Link>
            </div>
            <div className="tabs">


    {/* Notification message tab */}
    {/* it will just a message in firestore database from a form */}
              <div className="homeTab" id="notification" style={{ display: 'none' }}>
                <h3>Notification</h3>
                <form onSubmit={handleNotification}>
                  <div className="input-holder">
                    <label htmlFor="notificationMessage">Notification Message</label>
                    <input type="text" id="notificationMessage" placeholder="Enter notification message..." required />
                  </div>
                  <button type="submit" className="primary-button">Send Notification</button>
                </form>
              </div>
          
              {/* Floating Message */}
              <div className="homeTab" id="floatingMessage" style={{ display: 'none' }}>
                <h3>Floating Message</h3>
                <form onSubmit={handleFloatingMessage}>
                  <div className="input-holder">
                    <label htmlFor="floatingMessage">Message</label>
                    <input
                      type="text"
                      id="floatingMessage"
                      placeholder="Enter floating message..."
                      value={floatingMessage}
                      onChange={(e) => setFloatingMessage(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="primary-button">Add Floating Message</button>
                </form>
              </div>
              {/* Home Tab - Product List */}
              <div className="homeTab" id="hometab" style={{ display: 'block' }}>
                <h3>Products</h3>
                {products.length === 0 ? (
                  <p>No products are added yet</p>
                ) : (
                  <div className="product-list grid-4x">
                    {products.map((product) => (
                      <div key={product.id} className="product-card">
                        <img src={product.productImage} alt={product.productName} className="Product-image" />
                        <div className="text-holder">
                          <p><strong>{product.productName}</strong></p>
                          <p>Type: {product.productType}</p>
                          <p>Code: {product.productCode}</p>
                          <p>Description: {product.productDescription || 'No description'}</p>
                          <p className="price-tag">From RS.{product.productPrice}</p>
                          <div className="buttons">
                            <button className="classic-button" onClick={() => handleEditProduct(product)}>Edit</button>
                            <button className="classic-button" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Orders Tab */}
              <div className="ordersTab" id="orders" style={{ display: 'none' }}>
                <h3>Orders</h3>
                {orders.length === 0 ? (
                  <p>No orders</p>
                ) : (
                  orders.map((order, index) => (
                    <div className="new-order" key={index}>
                      <img src={order.productImg} alt={order.productName} style={{ maxWidth: '200px' }} />
                      <p><strong>Name:</strong> {order.buyerName}</p>
                      <p><strong>Email:</strong> {order.buyerEmail}</p>
                      <p><strong>Address:</strong> {order.buyerAddress}</p>
                      <p><strong>Product Name:</strong> {order.productName}</p>
                      <p><strong>Product Code:</strong> {order.productCode}</p>
                      <p><strong>Product Type:</strong> {order.productType}</p>
                      <p><strong>Quantity:</strong> {order.productQuantity}</p>
                      <p><strong>Size:</strong> {order.size}</p>
                      <p><strong>Color:</strong> {order.color}</p>
                      <p><strong>Total Bill:</strong> {order.totalAmount}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Upload Product Tab */}
              <div className="uploadTab" id="uploadtab" style={{ display: 'none' }}>
                <h3>{editingProduct ? 'Edit Product' : 'Upload a Product'}</h3>
                <p>
                  Note: Upload all images on <a href="https://imgbb.com/" target="_blank">imgbb</a>, select the image, copy the image address, and paste the link here.
                </p>
                <form id="productForm" onSubmit={handleProductSubmit}>
                  <div className="input-holder">
                    <label htmlFor="productImage">Product Image Source</label>
                    <input type="text" name="productImage" id="productImage" placeholder="src.." required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="productName">Product Name</label>
                    <input type="text" name="productName" id="productName" placeholder="Product Name.." required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="productPrice">Product Price</label>
                    <input type="number" name="productPrice" id="productPrice" placeholder="Price.." required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="productCode">Product Code</label>
                    <input type="text" name="productCode" id="productCode" placeholder="Product Code.." required />
                  </div>
                    <div className="input-holder">
                    <label htmlFor="productSize">Product Size</label>
                    <input type="text" name="productSize" id="productSize" placeholder="Product Size.." required />
                  </div>
                      <div className="input-holder">
                    <label htmlFor="productColor">Product Color</label>
                    <input type="text" name="productColor" id="productColor" placeholder="Product Color.." required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="productType">Product Type</label>
                    <select name="productType" id="productType" required>
                      {categories.length === 0 ? (
                        <option value="">No Category</option>
                      ) : (
                        categories.map((category, index) => (
                          <option key={index} value={category.categoryName}>{category.categoryName}</option>
                        ))
                      )}
                    </select>
                  </div>
                  <div className="input-holder">
                    <label htmlFor="productDescription">Product Description</label>
                    <textarea name="productDescription" id="productDescription" placeholder="Description.." rows="5"></textarea>
                  </div>
                  <button className="primary-button" type="submit">{editingProduct ? 'Update Product' : 'Add Product'}</button>
                  {editingProduct && (
                    <button className="primary-button" type="button" onClick={() => { setEditingProduct(null); document.getElementById('productForm').reset(); showTab('hometab'); }}>
                      Cancel
                    </button>
                  )}
                </form>
              </div>

              {/* Edit Store Tab */}
              <div className="editStore" id="editstore" style={{ display: 'none' }}>
                <h3>Edit Store</h3>
                <p>
                  Note: Upload all images on <a href="https://imgbb.com/" target="_blank">imgbb</a>, select the image, copy the image address, and paste the link here.
                </p>
                <form onSubmit={handleStoreSubmit}>
                  <div className="input-holder">
                    <label htmlFor="storeLogo">Store Logo Source</label>
                    <input type="text" name="storeLogo" id="storeLogo" placeholder="src.." />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="storeBanner">Store Banner Source</label>
                    <input type="text" name="storeBanner" id="storeBanner" placeholder="src.." required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="storeSlogan">Store Slogan</label>
                    <input type="text" name="storeSlogan" id="storeSlogan" placeholder="Slogan.." required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="storeName">Store Name</label>
                    <input type="text" name="storeName" id="storeName" placeholder="Name.." required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="instaID">Instagram Link</label>
                    <input type="text" name="instaID" id="instaID" placeholder="link.." />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="phone">Store Phone NO#</label>
                    <input type="text" name="phone" id="phone" placeholder="PhoneNO#.." required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="email">Store Email</label>
                    <input type="text" name="email" id="email" placeholder="email.." required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="address">Store Address</label>
                    <input type="text" name="address" id="address" placeholder="address.." required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="about">About Store</label>
                    <textarea name="about" id="about" cols="15" rows="15" required></textarea>
                  </div>
                  <p>Shipping Rates</p>
                  <hr />
                  <div className="input-holder">
                    <label htmlFor="currency">Choose a Currency:</label>
                    <select id="currency" name="currency">
                      <option value="PKR">Pakistani Rupee (PKR)</option>
                      <option value="USD">United States Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="GBP">British Pound Sterling (GBP)</option>
                      <option value="JPY">Japanese Yen (JPY)</option>
                    </select>
                  </div>
                  <div className="input-holder">
                    <label htmlFor="ratedollar">Average Shipping Rate</label>
                    <input type="text" name="ratedollar" id="ratedollar" placeholder="0" />
                  </div>
                  <p>Account Details</p>
                  <hr />
                  <div className="input-holder">
                    <label htmlFor="accHolder">Account Holder Name</label>
                    <input type="text" name="accHolder" id="accHolder" placeholder="Name" required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="bank">Bank Name</label>
                    <input type="text" name="bank" id="bank" placeholder="Bank Name" />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="iban">IBAN</label>
                    <input type="text" name="iban" id="iban" placeholder="IBAN" required />
                  </div>
                  <button className="primary-button">Save Details</button>
                </form>
              </div>
              {/* Store Sale */}
<div className="homeTab" id="storeSaleTab" style={{ display: 'none' }}>
  <h3>Store Sale</h3>
  <p>Note: This will apply a percentage discount to all products in the selected category.</p>

  <form onSubmit={handleStoreSale}>
    <div className="input-holder">
      <select
        name="productType"
        id="productType"
        required
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        {categories.length === 0 ? (
          <option value="">No Category</option>
        ) : (
          categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.categoryName}
            </option>
          ))
        )}
      </select>
    </div>

    <div className="input-holder">
      <input
        type="number"
        placeholder="Enter Sale Percentage"
        value={salePercentage}
        onChange={(e) => setSalePercentage(e.target.value)}
      />
    </div>

    <button type="submit" className="primary-button">Apply Sale</button>
  </form>

  <h4>Existing Sales</h4>
<table>
  <thead>
    <tr>
      <th>Category</th>
      <th>Sale %</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
   {sales.map((sale) => {
  const category = categories.find(cat => cat.categoryName === sale.categoryId);
  return (
    <tr key={sale.id}>
      <td>{sale.categoryId}</td>
      <td>{sale.salePercentage}%</td>
      <td>
        <button onClick={() => handleEditSale(sale)}>Edit</button>
        <button onClick={() => handleDeleteSale(sale.id)}>Delete</button>
      </td>
    </tr>
  );
})}

  </tbody>
</table>

</div>
              {/* Upload Blog Tab */}
              <div className="uploadBlog" id="upoadBlog" style={{ display: 'none' }}>
                <h3>Upload a Blog</h3>
                <p>
                  Note: Upload all images on <a href="https://imgbb.com/" target="_blank">imgbb</a>, select the image, copy the image address, and paste the link here.
                </p>
                <form onSubmit={handleBlogSubmit}>
                  <div className="input-holder">
                    <label htmlFor="blogHeading">Blog Heading</label>
                    <input type="text" name="blogHeading" id="blogHeading" placeholder="Blog Heading.." required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="blogImage">Blog Image Source</label>
                    <input type="text" name="blogImage" id="blogImage" placeholder="src.." required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="blogContent">Content</label>
                    <textarea name="blogContent" id="blogContent" cols="15" rows="15" required></textarea>
                  </div>
                  <button className="primary-button">Upload Blog</button>
                </form>
              </div>

              {/* Subscribers Tab */}
              <div className="subscribers" id="subscribers" style={{ display: 'none' }}>
                <h3>Subscribers</h3>
                <div className="new-order">
                  {subscribers.length === 0 ? (
                    <p>No subscribers yet</p>
                  ) : (
                    subscribers.map((subscriber, index) => (
                      <p key={index}>{subscriber.email}</p>
                    ))
                  )}
                </div>
                <button className="primary-button" onClick={handleCopy}>Copy All Emails</button>
              </div>

              {/* Categories Tab */}
              <div className="categories" id="categories" style={{ display: 'none' }}>
                <h3>Categories</h3>
                <p>
                  Note: Upload all images on <a href="https://imgbb.com/" target="_blank">imgbb</a>, select the image, copy the image address, and paste the link here.
                </p>
                <form onSubmit={handleCategorySubmit}>
                  <div className="input-holder">
                    <label htmlFor="categoryImage">Category Image Source</label>
                    <input type="text" name="categoryImage" id="categoryImage" placeholder="src.." required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="categoryName">Category Name</label>
                    <input type="text" name="categoryName" id="categoryName" placeholder="Category Name.." required />
                  </div>
                  <button className="primary-button">Add Category</button>
                </form>
                <div className="main-display-section">
                  <h3>Set Main Display Product Type</h3>
                  <form onSubmit={handleMainDisplaySubmit}>
                    <div className="input-holder">
                      <label htmlFor="mainDisplayType">Select Product Type</label>
                      <select name="mainDisplayType" id="mainDisplayType" required>
                        {productTypes.length === 0 ? (
                          <option value="">No product types available</option>
                        ) : (
                          productTypes.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                          ))
                        )}
                      </select>
                    </div>
                    <button className="primary-button">Save Main Display</button>
                  </form>
                  <p>Current Main Display: {selectedProductType || 'None selected'}</p>
                </div>
              </div>

              {/* Products on Sale Tab */}
              <div className="saleTab" id="saleTab" style={{ display: 'none' }}>
                <h3>Products on Sale</h3>
                <div className="input-holder">
                  <label htmlFor="saleProduct">Select Product for Sale</label>
                  <select
                    id="saleProduct"
                    onChange={(e) => {
                      const selected = products.find(p => p.id === e.target.value);
                      setSaleProduct(selected);
                    }}
                  >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>{product.productName}</option>
                    ))}
                  </select>
                </div>
                
                {saleProduct && (
                  <form onSubmit={handleSaleSubmit}>
                    <div className="product-card">
                      <img src={saleProduct.productImage} alt={saleProduct.productName} className="Product-image" />
                      <div className="text-holder">
                        <p><strong>{saleProduct.productName}</strong></p>
                        <p>Original Price: RS.{saleProduct.productPrice}</p>
                        <div className="input-holder">
                          <label htmlFor="newSalePrice">sale value in %</label>
                          <input
                            type="number"
                            id="newSalePrice"
                            value={newSalePrice}
                            onChange={(e) => setNewSalePrice(e.target.value)}
                            placeholder="Enter sale price"
                            required
                          />
                        </div>
                        <button className="primary-button" type="submit">Add to Sale</button>
                        <button className="primary-button" type="button" onClick={() => { setSaleProduct(null); setNewSalePrice(''); }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                          <h3>Current Sale products</h3>
                          {onSale.length === 0 ? (
                  <p>No sale items added yet</p>
                ) : (
                  <div className="sale-list grid-4x">
                    {onSale.map((item) => (
                      <div key={item.id} className="product-card">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="Product-image"
                          style={{ maxWidth: '200px' }}
                        />
                        <div className="text-holder">
                          <p><strong>{item.productName}</strong></p>
                          <p>Original Price: RS.{item.productPrice}</p>
                          <p>Sale Price: RS.{item.salePrice}</p>
                          <div className="buttons">
                            <button
                              className="classic-button"
                              onClick={() => handleRemoveFromSale(item.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}


              </div>

              {/* Gifts for Her Tab */}
              <div className="forHerTab" id="forHerTab" style={{ display: 'none' }}>
                <h3>Gifts for Her</h3>
                <div className="input-holder">
                  <label htmlFor="forHerProduct">Select Product for Gifts for Her</label>
                  <select
                    id="forHerProduct"
                    onChange={(e) => {
                      const selected = products.find(p => p.id === e.target.value);
                      setForHerProduct(selected);
                    }}
                  >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>{product.productName}</option>
                    ))}
                  </select>
                </div>
                {forHerProduct && (
                  <form onSubmit={handleForHerSubmit}>
                    <div className="product-card">
                      <img src={forHerProduct.productImage} alt={forHerProduct.productName} className="Product-image" />
                      <div className="text-holder">
                        <p><strong>{forHerProduct.productName}</strong></p>
                        <p>Type: {forHerProduct.productType}</p>
                        <p>Price: RS.{forHerProduct.productPrice}</p>
                        <button className="primary-button" type="submit">Add to Gifts for Her</button>
                        <button className="primary-button" type="button" onClick={() => setForHerProduct(null)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>

              {/* Hero Slider Tab */}
              <div className="heroSliderTab" id="heroSliderTab" style={{ display: 'none' }}>
                <h3>{editingSlide ? 'Edit Hero Slide' : 'Add Hero Slide'}</h3>
                <p>
                  Note: Upload all images on <a href="https://imgbb.com/" target="_blank">imgbb</a>, select the image, copy the image address, and paste the link here.
                </p>
                <form id="heroSliderForm" onSubmit={handleHeroSliderSubmit}>
                  <div className="input-holder">
                    <label htmlFor="slideTitle">Slide Title</label>
                    <input type="text" name="slideTitle" id="slideTitle" placeholder="Slide Title.." required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="slideDescription">Slide Description</label>
                    <textarea name="slideDescription" id="slideDescription" placeholder="Description.." rows="5" required></textarea>
                  </div>
                  <div className="input-holder">
                    <label htmlFor="slideImage">Slide Image Source</label>
                    <input type="text" name="slideImage" id="slideImage" placeholder="src.." required />
                  </div>
                  <button className="primary-button" type="submit">{editingSlide ? 'Update Slide' : 'Add Slide'}</button>
                  {editingSlide && (
                    <button className="primary-button" type="button" onClick={() => { setEditingSlide(null); document.getElementById('heroSliderForm').reset(); showTab('heroSliderTab'); }}>
                      Cancel
                    </button>
                  )}
                </form>
                <h3>Current Slides</h3>
                {heroSlides.length === 0 ? (
                  <p>No slides added yet</p>
                ) : (
                  <div className="slide-list grid-4x">
                    {heroSlides.map((slide) => (
                      <div key={slide.id} className="slide-card">
                        <img src={slide.image} alt={slide.title} className="Slide-image" style={{ maxWidth: '200px' }} />
                        <div className="text-holder">
                          <p><strong>{slide.title}</strong></p>
                          <p>Description: {slide.description}</p>
                          <div className="buttons">
                            <button className="classic-button" onClick={() => handleEditSlide(slide)}>Edit</button>
                            <button className="classic-button" onClick={() => handleDeleteSlide(slide.id)}>Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sale Section Tab */}
              <div className="saleSectionTab" id="saleSectionTab" style={{ display: 'none' }}>
                <h3>{editingSaleSection ? 'Edit Sale Section' : 'Add Sale Section'}</h3>
                <p>
                  Note: Upload all images on <a href="https://imgbb.com/" target="_blank">imgbb</a>, select the image, copy the image address, and paste the link here.
                </p>
                <form id="saleSectionForm" onSubmit={handleSaleSectionSubmit}>
                  <div className="input-holder">
                    <label htmlFor="saleHeading">Sale Heading</label>
                    <input type="text" name="saleHeading" id="saleHeading" placeholder="Sale Heading.." required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="saleSubheading">Sale Subheading</label>
                    <textarea name="saleSubheading" id="saleSubheading" placeholder="Subheading.." rows="5" required></textarea>
                  </div>
                  <div className="input-holder">
                    <label htmlFor="saleImage">Sale Image Source</label>
                    <input type="text" name="saleImage" id="saleImage" placeholder="src.." required />
                  </div>
                  <button className="primary-button" type="submit">{editingSaleSection ? 'Update Sale Section' : 'Add Sale Section'}</button>
                  {editingSaleSection && (
                    <button className="primary-button" type="button" onClick={() => { setEditingSaleSection(null); document.getElementById('saleSectionForm').reset(); showTab('saleSectionTab'); }}>
                      Cancel
                    </button>
                  )}
                </form>
                <h3>Current Sale Sections</h3>
                {saleSections.length === 0 ? (
                  <p>No sale sections added yet</p>
                ) : (
                  <div className="sale-list grid-4x">
                    {saleSections.map((sale) => (
                      <div key={sale.id} className="sale-card">
                        <img src={sale.image} alt={sale.heading} className="Sale-image" style={{ maxWidth: '200px' }} />
                        <div className="text-holder">
                          <p><strong>{sale.heading}</strong></p>
                          <p>Subheading: {sale.subheading}</p>
                          <div className="buttons">
                            <button className="classic-button" onClick={() => handleEditSaleSection(sale)}>Edit</button>
                            <button className="classic-button" onClick={() => handleDeleteSaleSection(sale.id)}>Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Banner Section Tab */}
              <div className="bannerSectionTab" id="bannerSectionTab" style={{ display: 'none' }}>
                <h3>{editingBannerSection ? 'Edit Banner Section' : 'Add Banner Section'}</h3>
                <p>
                  Note: Upload all images on <a href="https://imgbb.com/" target="_blank">imgbb</a>, select the image, copy the image address, and paste the link here.
                </p>
                <form id="bannerSectionForm" onSubmit={handleBannerSectionSubmit}>
                  <div className="input-holder">
                    <label htmlFor="bannerImage">Banner Image Source</label>
                    <input type="text" name="bannerImage" id="bannerImage" placeholder="src.." required />
                  </div>
                  <button className="primary-button" type="submit">{editingBannerSection ? 'Update Banner Section' : 'Add Banner Section'}</button>
                  {editingBannerSection && (
                    <button className="primary-button" type="button" onClick={() => { setEditingBannerSection(null); document.getElementById('bannerSectionForm').reset(); showTab('bannerSectionTab'); }}>
                      Cancel
                    </button>
                  )}
                </form>
                <h3>Current Banner Sections</h3>
                {bannerSections.length === 0 ? (
                  <p>No banner sections added yet</p>
                ) : (
                  <div className="banner-list grid-4x">
                    {bannerSections.map((banner) => (
                      <div key={banner.id} className="banner-card">
                        <img src={banner.image} alt="Banner" className="Banner-image" style={{ maxWidth: '200px' }} />
                        <div className="text-holder">
                          <div className="buttons">
                            <button className="classic-button" onClick={() => handleEditBannerSection(banner)}>Edit</button>
                            <button className="classic-button" onClick={() => handleDeleteBannerSection(banner.id)}>Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  
  );
};

export default AdminPage;