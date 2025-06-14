"use client"; // Next.js ko bol raha hai ki yeh client-side component hai

import React, { useState } from "react"; // React aur useState hook import
// PromocodeForm component start
export default function PromocodeForm() {
  // 👇 Form ke saare fields ko state me store karne ke liye
  const [form, setForm] = useState({
    name: "",               // Promocode ka naam
    description: "",        // Promocode ki description
    discount_type: "percentage", // Discount type: percentage ya fixed
    discount_value: 0,      // Discount ki value
    expiry_date: "",        // Expiry date
    status: "yes",          // Status: yes (active) ya no (inactive)
  });

  // 👇 Validation errors store karne ke liye
  const [errors, setErrors] = useState({});

  // 👇 Input change hone par form state update karne wala function
  const handleChange = (e) => {
    const { name, value } = e.target; // input ka name aur value
    setForm(prevForm => ({
      ...prevForm,        // pehle wali values
      [name]: value,      // sirf changed field update karo
    }));
  };

  // 👇 Form validation logic
  const validateForm = () => {
    let formErrors = {};

    // 🔹 Name validation
    if (!form.name.trim()) {
      formErrors.name = "Name zaroori hai";
    } else if (form.name.length < 3) {
      formErrors.name = "Name kam se kam 3 characters ka hona chahiye";
    }

    // 🔹 Description validation (agar diya ho)
    if (form.description && form.description.length < 5) {
      formErrors.description = "Description kam se kam 5 characters ki honi chahiye";
    }

    // 🔹 Discount value validation
    if (!form.discount_value || form.discount_value <= 0) {
      formErrors.discount_value = "Discount value 0 se badi honi chahiye";
    }

    // 🔹 Expiry date validation
    if (!form.expiry_date) {
      formErrors.expiry_date = "Expiry date zaroori hai";
    } else {
      const today = new Date();
      const selectedDate = new Date(form.expiry_date);
      if (selectedDate <= today) {
        formErrors.expiry_date = "Expiry date future me honi chahiye";
      }
    }

    setErrors(formErrors); // errors state update karo
    // return true agar errors nahi hai
    return Object.keys(formErrors).length === 0;
  };

  // 👇 Form submit hone par ye function chalega
  const handleSubmit = async (e) => {
    e.preventDefault(); // default form submit roko

    // pehle validate karo
    if (!validateForm()) {
      return; // agar validation fail to return
    }

    try {
      // API call: promocode add karne ke liye
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/promocode/promocode/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // form data JSON me bhejo
      });

      if (!res.ok) {
        throw new Error("Promocode submit karne me problem"); // agar response ok nahi
      }

      const data = await res.json();
      console.log("Submitted:", data);
      alert("Promocode successfully add ho gaya!"); // success alert

      // form reset kar do
      setForm({
        name: "",
        description: "",
        discount_type: "percentage",
        discount_value: 0,
        expiry_date: "",
        status: "yes",
      });
      setErrors({}); // errors bhi clear karo
    } catch (error) {
      console.error("Submit error:", error);
      alert("Promocode add karne me fail"); // error alert
    }
  };

  // 👇 JSX UI render
  return (
    <div className="form-page-wrapper">
      <form className="promocode-form" onSubmit={handleSubmit}>
        {/* Name Field */}
        <input
          type="text"
          name="name"
          placeholder="Enter name"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        {/* Description Field */}
        <input
          type="text"
          name="description"
          placeholder="Enter description"
          value={form.description}
          onChange={handleChange}
        />
        {errors.description && <p className="error">{errors.description}</p>}

        {/* Discount Type Dropdown */}
        <select
          name="discount_type"
          value={form.discount_type}
          onChange={handleChange}
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed</option>
        </select>

        {/* Discount Value Field */}
        <input
          type="number"
          name="discount_value"
          placeholder="Enter discount amount"
          value={form.discount_value}
          onChange={handleChange}
        />
        {errors.discount_value && <p className="error">{errors.discount_value}</p>}

        {/* Expiry Date Field */}
        <input
          type="date"
          name="expiry_date"
          value={form.expiry_date}
          onChange={handleChange}
        />
        {errors.expiry_date && <p className="error">{errors.expiry_date}</p>}

        {/* Status Dropdown */}
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        {/* Submit Button */}
        <button type="submit">Add Promocode</button>
      </form>
    </div>
  );
}
