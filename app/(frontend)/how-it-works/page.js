import React from 'react';

const HowItWorks = () => {
  return (
    <div className="container">
      <div className="card">
        <h1 className="heading">How It Works - eShop Website</h1>

        <p className="text">
          Welcome to <span className="highlight">eShop Website</span>! Here’s how you can shop with us and enjoy a seamless experience:
        </p>

        <h2 className="subheading">🛍️ 1. Browse Our Products</h2>
        <p className="text">
          Explore a wide range of products across different categories. We have something for everyone! Browse through our collection to find what you need.
        </p>

        <h2 className="subheading">🛒 2. Add to Cart</h2>
        <p className="text">
          Once you’ve found your favorite items, simply click the “Add to Cart” button to add them to your shopping cart. You can continue browsing and add more items to your cart.
        </p>

        <h2 className="subheading">💳 3. Checkout</h2>
        <p className="text">
          After selecting all the products you want, go to your cart and click the “Checkout” button. Review your order, enter shipping information, and choose your preferred payment method.
        </p>

        <h2 className="subheading">📦 4. Order Confirmation</h2>
        <p className="text">
          Once your payment is processed, you’ll receive an order confirmation email with all your order details. You’ll also receive a tracking number once your order is dispatched.
        </p>

        <h2 className="subheading">🚚 5. Delivery</h2>
        <p className="text">
          Our team will prepare your order and ship it to your address. You can track the status of your order and enjoy your shopping experience with us!
        </p>

        <h2 className="subheading">🔄 6. Returns & Refunds</h2>
        <p className="text">
          We offer easy returns and refunds in case you’re not satisfied with the product. Please refer to our <a href="/returns-policy">Returns Policy</a> for more information on how to return your items.
        </p>

        <h2 className="subheading">🎁 7. Enjoy Your Shopping!</h2>
        <p className="text">
          That’s it! Now sit back, relax, and enjoy the products you’ve bought from eShop. We hope you love them as much as we do.
        </p>
      </div>
    </div>
  );
};

export default HowItWorks;
