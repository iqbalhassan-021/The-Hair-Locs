import React from 'react';

const EmailTemplate = ({ orderData, storeDetails }) => {
  const { customer, cartItems, pricing, payment } = orderData;
  const currentYear = new Date().getFullYear();

  // Inline styles to match your HTML template
  const styles = {
    body: { backgroundColor: '#f6f6f7', padding: '24px 0', fontFamily: 'sans-serif' },
    container: { backgroundColor: '#ffffff', borderRadius: '8px', width: '600px', margin: '0 auto', overflow: 'hidden', border: '1px solid #e5e7eb' },
    section: { padding: '24px 32px' },
    divider: { borderTop: '1px solid #e5e7eb' },
    textMuted: { color: '#6b7280', fontSize: '14px' },
    itemRow: { padding: '16px 0', borderBottom: '1px solid #f3f4f6' }
  };

  return (
    <div style={styles.body}>
      <table style={styles.container} cellPadding="0" cellSpacing="0">
        <tbody>
          {/* Logo & Header */}
          <tr>
            <td style={{ textAlign: 'center', padding: '32px' }}>
              <h2 style={{ margin: 0 }}>{storeDetails?.storeName || 'Our Store'}</h2>
              <h1 style={{ fontSize: '24px', marginTop: '16px' }}>
                Thanks for your order, {customer.firstName}!
              </h1>
              <p style={styles.textMuted}>Order Date: {new Date().toLocaleDateString()}</p>
            </td>
          </tr>

          <tr><td style={styles.divider}></td></tr>

          {/* Items List */}
          <tr>
            <td style={styles.section}>
              {cartItems.map((item, index) => (
                <div key={index} style={styles.itemRow}>
                  <table width="100%">
                    <tbody>
                      <tr>
                        <td>
                          <p style={{ margin: 0, fontWeight: '500' }}>{item.productName}</p>
                          <p style={styles.textMuted}>Qty {item.quantity}</p>
                        </td>
                        <td align="right" style={{ fontWeight: '500' }}>
                          Rs. {item.productPrice}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </td>
          </tr>

          <tr><td style={styles.divider}></td></tr>

          {/* Totals */}
          <tr>
            <td style={styles.section}>
              <table width="100%" style={{ fontSize: '14px' }}>
                <tbody>
                  <tr>
                    <td>Subtotal</td>
                    <td align="right">Rs. {pricing.subtotal}</td>
                  </tr>
                  <tr>
                    <td>Shipping</td>
                    <td align="right">Rs. {pricing.shipping}</td>
                  </tr>
                  <tr style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    <td style={{ paddingTop: '12px' }}>Total</td>
                    <td align="right" style={{ paddingTop: '12px' }}>Rs. {pricing.total}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr><td style={styles.divider}></td></tr>

          {/* Shipping Details */}
          <tr>
            <td style={styles.section}>
              <h3 style={{ fontSize: '16px', margin: '0 0 8px' }}>Shipping Address</h3>
              <p style={{ ...styles.textMuted, lineHeight: '1.6', color: '#374151' }}>
                {customer.firstName} {customer.lastName}<br />
                {customer.street}, {customer.address2}<br />
                {customer.city}, {customer.region} {customer.postalCode}<br />
                {customer.phone}
              </p>
            </td>
          </tr>

          {/* Footer */}
          <tr>
            <td style={{ ...styles.section, backgroundColor: '#f9fafb', textAlign: 'center' }}>
              <p style={styles.textMuted}>Questions? Contact us at support@yourstore.com</p>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '12px' }}>
                © {currentYear} {storeDetails?.storeName}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EmailTemplate;