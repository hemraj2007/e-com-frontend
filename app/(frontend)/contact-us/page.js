'use client';

import React, { useState } from 'react';

const ContactUs = () => {
  // Form data ke liye state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Form submit hone par
  const handleSubmit = async (e) => {
    e.preventDefault();  // Default form submission ko rokhna

    // Data jo POST request mein bhejna hai
    const requestData = {
      name: name,
      email: email,
      message: message,
    };

    try {
      // FastAPI ko POST request bhejna
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contact/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        // Agar message successfully bheja gaya ho to success alert
        alert('Message sent successfully!');
      } else {
        // Agar koi error ho to error alert
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      // Agar koi aur error aaye to
      alert('Error: ' + error.message);
    }

    // Form fields ko reset karna
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="heading">Contact Us - eshop Website</h1>
        <p className="text">
          For any queries, suggestions, or feedback, please contact us. Your thoughts matter to us.
        </p>

        <div className="contact-info">
          <p><span>Email:</span> info@gmail.com</p>
          <p><span>Phone:</span> +91 9876543210</p>
          <p><span>Address:</span> 123,Street, Jaipur, Rajasthan</p>
        </div>

        <h2 className="subheading">📧 Send Us a Message</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name:</label>
            <input
              type="text"
              className="form-input"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-input"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Message:</label>
            <textarea
              className="form-textarea"
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
