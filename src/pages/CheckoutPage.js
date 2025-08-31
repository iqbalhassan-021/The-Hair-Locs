import React, { useState, useEffect } from 'react';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs ,query, where, } from 'firebase/firestore';
import BottomBar from '../components/BottomBar';

const provinces = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Gilgit-Baltistan',
  'Azad Jammu and Kashmir'
];

const citiesByProvince = {
  Punjab: [
'Ahmadpur East',
'Ahmed Nager Chatha',
'Ali Khan Abad',
'Alipur',
'Arifwala',
'Attock',
'Bhera',
'Bhalwal',
'Bahawalnagar',
'Bahawalpur',
'Bhakkar',
'Burewala',
'Chillianwala',
'Chakwal',
'Chichawatni',
'Chiniot',
'Chishtian',
'Daska',
'Darya Khan',
'Dera Ghazi Khan',
'Dhaular',
'Dina',
'Dinga',
'Dipalpur',
'Faisalabad',
'Fateh Jang',
'Ghakhar Mandi',
'Gojra',
'Gujranwala',
'Gujrat',
'Gujar Khan',
'Hafizabad',
'Haroonabad',
'Hasilpur',
'Haveli Lakha',
'Jalalpur Jattan',
'Jampur',
'Jaranwala',
'Jhang',
'Jhelum',
'Kalabagh',
'Karor Lal Esan',
'Kasur',
'Kamalia',
'Kāmoke',
'Khanewal',
'Khanpur',
'Kharian',
'Khushab',
'Kot Adu',
'Jauharabad',
'Lahore',
'Lalamusa',
'Layyah',
'Liaquat Pur',
'Lodhran',
'Malakwal',
'Mamoori',
'Mailsi',
'Mandi Bahauddin',
'Mian Channu',
'Mianwali',
'Multan',
'Murree',
'Muridke',
'Mianwali Bangla',
'Muzaffargarh',
'Narowal',
'Okara',
'Renala Khurd',
'Pakpattan',
'Pattoki',
'Pir Mahal',
'Qaimpur',
'Qila Didar Singh',
'Rabwah',
'Raiwind',
'Rajanpur',
'Rahim Yar Khan',
'Rawalpindi',
'Sadiqabad',
'Safdarabad',
'Sahiwal',
'Sangla Hill',
'Sarai Alamgir',
'Sargodha',
'Shakargarh',
'Sheikhupura',
'Sialkot',
'Sohawa',
'Soianwala',
'Siranwali',
'Talagang',
'Taxila',
'Toba Tek Singh',
'Vehari',
'Wah Cantonment',
'Wazirabad',
'Zafarwal',
'Zahir Pir',
'Zhob',
'Ziauddin',
'Ziarat',
  'Zaman Park',
  'Zafarwal',
  'Zahir Pir',

  ],
  Sindh: [
    'Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Mirpurkhas', 'Nawabshah', 'Thatta',
    'Jacobabad', 'Shikarpur', 'Khairpur', 'Ghotki', 'Dadu', 'Umerkot', 'Tando Allahyar',
    'Tando Muhammad Khan', 'Badin', 'Kashmore', 'Matiari', 'Jamshoro', 'Qambar Shahdadkot',
    'Tharparkar'
  ],
  'Khyber Pakhtunkhwa': [
    'Peshawar', 'Abbottabad', 'Mardan', 'Swat', 'Mingora', 'Mansehra', 'Kohat', 'Bannu',
    'Charsadda', 'Dera Ismail Khan', 'Swabi', 'Nowshera', 'Hangu', 'Tank', 'Dir', 'Chitral',
    'Haripur', 'Lakki Marwat', 'Buner', 'Battagram', 'Shangla'
  ],
  Balochistan: [
    'Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Sibi', 'Zhob', 'Loralai', 'Chaman', 'Dera Bugti',
    'Nushki', 'Pishin', 'Kalat', 'Ziarat', 'Lasbela', 'Jaffarabad', 'Barkhan', 'Mastung',
    'Kharan', 'Washuk', 'Awaran', 'Panjgur'
  ],
  'Islamabad Capital Territory': ['Islamabad'],
  'Gilgit-Baltistan': [
    'Gilgit', 'Skardu', 'Hunza', 'Gahkuch', 'Ghizer', 'Khaplu', 'Ghanche', 'Astore', 'Diamer',
    'Nagar', 'Shigar'
  ],
  'Azad Jammu and Kashmir': [
    'Muzaffarabad', 'Mirpur', 'Rawalakot', 'Kotli', 'Bagh', 'Hattian Bala', 'Pallandri',
    'Bhimber', 'Haveli', 'Neelum'
  ]
};

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingRate, setShippingRate] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    region: '',
    postalCode: '',
    country: 'Pakistan',
    shippingMethod: 'Cash on Delivery',
    paymentMethod: 'Cash on Delivery'
  });

  const navigate = useNavigate();
  const [giftBoxes, setGiftBoxes] = useState([]);
    const db = getFirestore(); // Initialize Firestore
      const [isDropdownOpen, setDropdownOpen] = useState(false);
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  useEffect(() => {
    const fetchShippingRate = async () => {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, 'storeDetails'));
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const data = doc.data();
          const rate = parseFloat(data.shippingrate ?? 250);
          if (!isNaN(rate)) setShippingRate(rate);
        }
      } catch (error) {
        console.error('❌ Error fetching shipping rate:', error);
      }
    };

    fetchShippingRate();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const fetchGiftBoxes = async () => {
      const q = query(collection(db, 'products'), where('productType', '==', 'Giftbox'));
      const snapshot = await getDocs(q);
      const boxes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGiftBoxes(boxes);
    };

    fetchGiftBoxes();
  }, []);

  const handleSelect = (box) => {
    handleInputChange({ target: { name: 'giftBox', value: box.id } });
    setDropdownOpen(false);
  };

  const selectedBox = giftBoxes.find(box => box.id === formData.giftBox);

  const isFormFilled = Object.values(formData).every((value) => value.trim() !== '');
  const itemsTotal = cartItems.reduce((sum, item) => sum + Number(item.productPrice) * item.quantity, 0);
  const selectedGiftBox = giftBoxes.find(box => box.id === formData.giftBox);
  const giftBoxPrice = selectedGiftBox ? Number(selectedGiftBox.productPrice) : 0;

  const calculatedShipping = isFormFilled ? shippingRate : 0;
  const grandTotal = itemsTotal + calculatedShipping + giftBoxPrice;


  return (
    <>
      <div className="sticky">
        <Navbar />
      </div>

      <div className="checkout-container" style={{ padding: '2rem' }}>
        <h1 className="checkout-title" style={{ color: 'var(--primary-color)' }}>
          Checkout
        </h1>

        <div className="checkout-content" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <form
            className="checkout-form"
            action="https://api.web3forms.com/submit"
            method="POST"
            style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {/* 2f21b333-cfce-49ef-bd80-2c39a139de22 */}
            <input type="hidden" name="access_key" value="2f21b333-cfce-49ef-bd80-2c39a139de22" />
            <input type="hidden" name="shippingRate" value={calculatedShipping} />
            <input type="hidden" name="totalAmount" value={grandTotal.toFixed(2)} />

            <label>First Name<input type="text" name="firstName" value={formData.firstName} required onChange={handleInputChange} /></label>
            <label>Last Name<input type="text" name="lastName" value={formData.lastName} required onChange={handleInputChange} /></label>
            <label>Email<input type="email" name="email" value={formData.email} required onChange={handleInputChange} /></label>
            <label>Phone Number<input type="tel" name="phone" value={formData.phone} required onChange={handleInputChange} /></label>
            <label>Country
              <select type="select" name="country" value={formData.country} >
                <option value="Pakistan">Pakistan</option>
              </select>
              </label>

            <label>
              Region / State / Province
              <select name="region" value={formData.region} required onChange={handleInputChange}>
                <option value="">Select Province</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </label>

            <label>
              City
              <select name="city" value={formData.city} required onChange={handleInputChange}>
                <option value="">Select City</option>
                {citiesByProvince[formData.region]?.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </label>

            <label>Postal Code<input type="text" name="postalCode" value={formData.postalCode} required onChange={handleInputChange} /></label>
            <label>Street Address<input type="text" name="street" value={formData.street} required onChange={handleInputChange} /></label>

            <label>
              Shipping Method
                <div className='shipping' >
                  <p>courier</p>
                  <p>
                    <s>
                    RS.250 
                    </s> 
                     -RS.{shippingRate}</p>
                </div>
            </label>

            <label>
              Payment Method
                <div className='shipping' >
                  <p>Cash on delivery</p>
                </div>
              <small style={{ color: 'gray', fontSize: '0.9rem' }}>
                <br />Payment will be collected in cash upon delivery.
              </small>
            </label>

      <label>
      Add a giftbox
      <select name="giftBox" value={formData.giftBox} onChange={handleInputChange}>
        <option value="">select giftbox</option>
        {giftBoxes.map((box) => (
          <option key={box.id} value={box.id}>
            <p>
              {box.productName || 'Giftbox'} - RS.{box.productPrice}
            </p>
          </option>
        ))}
      </select>

      <small style={{ color: 'gray', fontSize: '0.9rem' }}>
        <br />Select any giftbox to add to your order. If not, then leave it blank.
      </small>
    </label>

            {!isFormFilled && (
              <p style={{ color: 'red', fontSize: '0.9rem' }}>
                Shipping cost will be shown once all fields are filled.
              </p>
            )}

            {cartItems.map((item, index) => (
              <div key={item.id}>
                <input type="hidden" name={`cart[${index}][productImage]`} value={item.productImage} />
                <input type="hidden" name={`cart[${index}][productName]`} value={item.productName} />
                <input type="hidden" name={`cart[${index}][quantity]`} value={item.quantity} />
                <input type="hidden" name={`cart[${index}][productPrice]`} value={item.productPrice} />
                <input type="hidden" name={`cart[${index}][productCode]`} value={item.productCode} />
                <input type="hidden" name={`cart[${index}][productType]`} value={item.productType} />
                <input type="hidden" name={`cart[${index}][productColor]`} value={item.productColor} />
                <input type="hidden" name={`cart[${index}][productSize]`} value={item.productSize} />
              </div>
            ))}
            {selectedGiftBox && (
              <>
                <input type="hidden" name="giftBoxName" value={selectedGiftBox.productName} />
                <input type="hidden" name="giftBoxPrice" value={selectedGiftBox.productPrice} />
                <br></br>
                <input type="hidden" name="giftBoxPrice" value={selectedGiftBox.productImage} />
              </>
            )}

            <div className="checkout-summary">
              <div style={{ display: 'flex', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.2rem'}}>Order Summary : RS.{itemsTotal}</h2>
              </div>
             
              {cartItems.map((item) => (
                <div className="summary-item" key={item.id} style={{ marginBottom: '0.5rem' }}>
                  <div>
                    <img src={item.productImage} alt={item.productName} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '1rem' ,borderRadius: '5px'}} />
                    
                  </div>
                  <div>
                  <span>{item.productName} x {item.quantity}</span>
                  <br></br>
                  <span>Rs. {item.productPrice * item.quantity}</span>
                  </div>
                  
                </div>
              ))}
              {selectedGiftBox && (
                  <div className="summary-item" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Giftbox: {selectedGiftBox.productName}</span>
                    <span>Rs. {selectedGiftBox.productPrice}</span>
                  </div>
                )}

              <div className="summary-shipping" style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0 0.5rem 0', color: isFormFilled ? 'gray' : 'red' }}>
                <span>Shipping:</span>
                <span>{isFormFilled ? `Rs. ${shippingRate.toFixed(2)}` : 'Fill address to calculate'}</span>
              </div>

              <hr />

              <div className="summary-total" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontWeight: 'bold' }}>
                <strong>Total:</strong>
                <span>Rs. {grandTotal}</span>
              </div>
            </div>

            <button type="submit" className="primary-button">
              Place Order
            </button>
          </form>
        </div>
      </div>

      <BottomBar />
      <Footer />
    </>
  );
};

export default CheckoutPage;
