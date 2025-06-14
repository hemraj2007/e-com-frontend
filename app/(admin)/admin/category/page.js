"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const CategoryManager = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Move fetchCategories outside useEffect
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/all_category`);
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "Name", "Created At"]],
      body: categories.map((cat) => [cat.id, cat.name, cat.created_at]),
    });
    doc.save("categories.pdf");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(categories);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "categories.xlsx");
  };

  const handleEdit = (id) => {
    router.push(`/admin/category/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchCategories(); // ✅ Call works now!
      } else alert("Failed to delete category!");
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Error deleting category!");
    }
  };

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="category-manager-container">
      <button className="back-btn" onClick={() => router.back()}>
        ⬅️ Back
      </button>

      <h2>Category Manager</h2>

      <div className="button-row">
        <button className="add-btn" onClick={() => router.push("/admin/category/add")}>
          ➕ Add Category
        </button>
        <button className="export-pdf" onClick={exportToPDF}>
          Export to PDF
        </button>
        <button className="export-excel" onClick={exportToExcel}>
          Export to Excel
        </button>
      </div>

      <table className="category-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Created At</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.name}</td>
              <td>{cat.created_at}</td>
              <td>
                <button className="btn-edit" onClick={() => handleEdit(cat.id)}>
                  ✏️ Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(cat.id)}>
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryManager;
