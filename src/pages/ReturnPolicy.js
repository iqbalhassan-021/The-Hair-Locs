import React from 'react';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import BottomBar from '../components/BottomBar';


const ReturnPolicy  = () => {
  return (
    <>
           <div className='sticky'>
            <Navbar/>
        </div>
<div className="return-container">
  <h1 className="return-title">Return & Refund Policy</h1>

  <section className="return-section">
    <h2>Overview</h2>
    <p>
      At The Hair Locs, we want you to love your purchase. While we do our best to ensure every hair accessory meets our quality standards, all sales are considered final due to hygiene and safety concerns. However, if your item arrives damaged or incorrect, we're happy to help.
    </p>
  </section>

  <section className="return-section">
    <h2>Damaged or Incorrect Items</h2>
    <p>
      If you receive a defective or incorrect hair accessory, please contact us within 3 days of delivery. Be sure to include your order number, a description of the issue, and clear photos of the item. We'll review the case and work to send a replacement or offer store credit if applicable.
    </p>
  </section>

  <section className="return-section">
    <h2>Non-Returnable Items</h2>
    <ul>
      <li>Hair accessories that have been worn or used</li>
      <li>Items not in their original packaging</li>
      <li>Custom-designed or limited edition accessories</li>
      <li>Gift cards</li>
    </ul>
  </section>

  <section className="return-section">
    <h2>Refunds</h2>
    <p>
      Refunds are issued only in cases where a replacement is not possible. Once your return or issue is approved, we will process a refund to your original method of payment. Please allow 5–10 business days for the transaction to appear on your account.
    </p>
  </section>

 
</div>
<BottomBar/>
             <Footer/>
             </>
  );
};

export default ReturnPolicy ;
