"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

const EditProductPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    description: "",
    mrp: "",
    net_price: "",
    quantity_in_stock: "",
    image: "",
    product_cat: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}products/all_products`);
        const product = response.data.find(p => p.id === parseInt(id));
        if (product) {
          setFormData(product);
        } else {
          alert("Product not found!");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
      setLoading(false);
    };

    if (id) fetchProduct();
  }, [id]);

const handleChange = (e) => {
  const { name, value, type } = e.target;

  // Convert number inputs to proper number
  const parsedValue = type === "number" ? (value === "" ? "" : Number(value)) : value;

  setFormData({ ...formData, [name]: parsedValue });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}products/products/update/${id}`, {
        ...formData,
        updated_at: new Date().toISOString()
      });

      alert("✅ Product updated successfully!");
      router.push("/admin/product");
    } catch (err) {
      console.error("Update failed:", err);
      alert("❌ Update failed!");
    }

    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>⏳ Loading...</div>
      ) : (
        <form className="edit-product-form" onSubmit={handleSubmit}>
          <h2>Edit Product</h2>

          <div className="form-group">
            <label htmlFor="category_id">Category ID</label>
            <input
              type="number"
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mrp">MRP</label>
            <input
              type="number"
              id="mrp"
              name="mrp"
              value={formData.mrp}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="net_price">Net Price</label>
            <input
              type="number"
              id="net_price"
              name="net_price"
              value={formData.net_price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity_in_stock">Stock Quantity</label>
            <input
              type="number"
              id="quantity_in_stock"
              name="quantity_in_stock"
              value={formData.quantity_in_stock}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="product_cat">Product Category</label>
            <input
              type="text"
              id="product_cat"
              name="product_cat"
              value={formData.product_cat}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Update Product</button>
        </form>
      )}
    </>
  );
};

export default EditProductPage;



