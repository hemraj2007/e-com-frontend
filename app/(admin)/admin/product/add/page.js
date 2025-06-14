"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 

const AddProduct = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    description: "",
    mrp: "",
    net_price: "",
    quantity_in_stock: "",
    image: "",
    product_cat: "",
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/all_category`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      category_id: parseInt(formData.category_id),
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
      description: formData.description,
      mrp: parseFloat(formData.mrp),
      net_price: parseFloat(formData.net_price),
      quantity_in_stock: parseInt(formData.quantity_in_stock),
      image: formData.image,
      product_cat: formData.product_cat,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("✅ Product added successfully!");
        setFormData({
          category_id: "",
          name: "",
          description: "",
          mrp: "",
          net_price: "",
          quantity_in_stock: "",
          image: "",
          product_cat: "",
        });
        router.push("/admin/product");
      } else {
        const errorData = await response.json();
        alert("❌ Failed to add product: " + errorData.detail);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Something went wrong! Please try again.");
    }
  };

  return (
    <div className="product-form-container">
      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category_id">
            Select Category <span className="required">*</span>
          </label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="name">
            Product Name <span className="required">*</span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">
            Description <span className="required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="price-fields">
          <div className="form-group">
            <label htmlFor="mrp">
              MRP (Maximum Retail Price) <span className="required">*</span>
            </label>
            <input
              id="mrp"
              type="number"
              name="mrp"
              placeholder="₹"
              value={formData.mrp}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="net_price">
              Net Price <span className="required">*</span>
            </label>
            <input
              id="net_price"
              type="number"
              name="net_price"
              placeholder="₹"
              value={formData.net_price}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="quantity_in_stock">
            Quantity in Stock <span className="required">*</span>
          </label>
          <input
            id="quantity_in_stock"
            type="number"
            name="quantity_in_stock"
            value={formData.quantity_in_stock}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">
            Product Image URL <span className="required">*</span>
          </label>
          <input
            id="image"
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="product_cat">
            Product Type <span className="required">*</span>
          </label>
          <input
            id="product_cat"
            type="text"
            name="product_cat"
            value={formData.product_cat}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
