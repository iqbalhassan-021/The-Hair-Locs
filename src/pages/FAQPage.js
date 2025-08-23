import React from 'react';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import BottomBar from '../components/BottomBar';
const faqs = [
  {
    question: 'What products do you offer?',
    answer: 'We offer a wide variety of hair accessories including scrunchies, elastic hairbands, claw clips, headbands, and more — perfect for every hair type and style.'
  },
  {
    question: 'How can I place an order?',
    answer: 'You can easily place an order through our website. Just browse your favorite items, add them to your cart, and check out. Simple as that!'
  },
  {
    question: 'Are your products suitable for all hair types?',
    answer: 'Absolutely! Our hair accessories are designed to be gentle on all hair types — whether it’s curly, straight, fine, or thick.'
  },
  {
    question: 'Do you accept custom or bulk orders?',
    answer: 'Yes, we do! Whether you need custom colors, branding, or bulk quantities for events or gifting, reach out to us — we’d love to help you out.'
  },
];


const FAQPage = () => {
  return (
    <>
           <div className='sticky'>
            <Navbar/>
        </div>
    <div className="faq-container">
      <h1 className="faq-title">Frequently Asked Questions</h1>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <details key={index} className="faq-item">
            <summary className="faq-question">
              {faq.question}
            </summary>
            <p className="faq-answer">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
    <BottomBar/>
             <Footer/>
             </>
  );
};

export default FAQPage;
