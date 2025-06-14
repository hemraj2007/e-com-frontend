import React from 'react';

const About = () => {
  return (
    <div className="container">
      <div className="card">
        <h1 className="heading">About eShop Website</h1>

        <p className="text">
          Welcome to <span className="highlight">eShop</span>! We are a digital platform that brings together the best ideas, creativity, and community to provide a seamless online shopping experience.
        </p>

        <h2 className="subheading">🎯 Our Vision</h2>
        <p className="text">
          Our vision is to build a digital world where everyone has access to high-quality products, excellent customer service, and a user-friendly shopping experience.
        </p>

        <h2 className="subheading">🌟 What We Do</h2>
        <ul className="list">
          <li>Sell a wide range of products across various categories</li>
          <li>Offer discounts and special offers to our customers</li>
          <li>Provide fast and reliable delivery services</li>
          <li>Offer easy returns and exchanges for a hassle-free shopping experience</li>
          
        </ul>
        

        <h2 className="subheading">💡 Why Choose Us?</h2>
        <ul className="list">
          <li>Reliable and high-quality products</li>
          <li>User-friendly website and mobile app</li>
          <li>Fast and secure payment methods</li>
          <li>Excellent customer support</li>
        </ul>

        <h2 className="subheading">📢 Join Us</h2>
        <p className="text">
          Become a part of our growing eShop community. Whether you're a customer looking for the best deals or a vendor looking to expand your business, we are here to help you grow and succeed.
        </p>
      </div>
    </div>
  );
};

export default About;
