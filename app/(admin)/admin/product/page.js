"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ProductManager = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Category name lookup function
  const getCategoryName = (id) => {
    const cat = categories.find((c) => String(c.id) === String(id));
    return cat ? cat.name : "Unknown";
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/all_products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/all_category`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [
        ["ID", "Category", "Name", "MRP", "Net Price", "Stock", "Product Cat", "Created At"],
      ],
      body: products.map((prod) => [
        prod.id,
        getCategoryName(prod.category_id),
        prod.name,
        prod.mrp,
        prod.net_price,
        prod.quantity_in_stock,
        prod.product_cat,
        prod.created_at,
      ]),
    });
    doc.save("products.pdf");
  };

  // Export to Excel
  const exportToExcel = () => {
    // Prepare a copy with category_name
    const dataWithNames = products.map((prod) => ({
      id: prod.id,
      category: getCategoryName(prod.category_id),
      name: prod.name,
      mrp: prod.mrp,
      net_price: prod.net_price,
      stock: prod.quantity_in_stock,
      product_cat: prod.product_cat,
      created_at: prod.created_at,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataWithNames);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "products.xlsx");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/delete/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts();
      } else alert("Failed to delete product!");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Error deleting product!");
    }
  };

  const handleEdit = (id) => {
    router.push(`/admin/product/edit/${id}`);
  };

  return (
    <div className="product-manager-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => router.back()} className="back-button">
          ⬅️ Back
        </button>
        <h2>Product Manager</h2>
      </div>

      <div className="button-row" style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
        <button onClick={() => router.push("/admin/product/add")} className="add-button">
          Add Product
        </button>
        <button onClick={exportToPDF} className="pdf-button">
          Export to PDF
        </button>
        <button onClick={exportToExcel} className="excel-button">
          Export to Excel
        </button>
      </div>

      <table className="product-table" border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Name</th>
            <th>MRP</th>
            <th>Net Price</th>
            <th>Stock</th>
            <th>Product Cat</th>
            <th>Created At</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.id}</td>
              <td>{getCategoryName(prod.category_id)}</td>
              <td>{prod.name}</td>
              <td>{prod.mrp}</td>
              <td>{prod.net_price}</td>
              <td>{prod.quantity_in_stock}</td>
              <td>{prod.product_cat}</td>
              <td>{prod.created_at}</td>
              <td>
                <div className="action-buttons">
                  <button className="action-button edit" onClick={() => handleEdit(prod.id)}>
                    ✏️ Edit
                  </button>
                  <button className="action-button delete" onClick={() => handleDelete(prod.id)}>
                    🗑️ Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManager;
