"use client";

import React, { useEffect, useState } from "react"; // React ko import kiya gaya hai for building components
import axios from "axios"; // axios API requests bhejne ke liye use hota hai
import jsPDF from "jspdf"; // jsPDF library ko import kiya gaya hai to generate PDF
import autoTable from "jspdf-autotable"; // autoTable ko import kiya gaya hai jo tables ko PDF mein export karta hai
import * as XLSX from "xlsx"; // XLSX library ko import kiya gaya hai to convert JSON data to Excel format
import { saveAs } from "file-saver"; // file-saver ko import kiya gaya hai to save generated files like Excel and PDF
import { useRouter } from "next/navigation"; // Next.js ka router use karte hue navigation ke liye

const UsersManager = () => {
  // Users ko state mein store karne ke liye useState hook
  const [users, setUsers] = useState([]);
  const router = useRouter(); // Router ka use for navigating between pages

  // Component mount hone par users ko fetch karne ke liye useEffect hook
  useEffect(() => {
    fetchUsers(); // users ko fetch karne ka function call
  }, []); // Empty dependency array ka matlab effect sirf component mount hone par chalega

  // Users ko API se fetch karne ka function
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/users`); // API request to fetch users
      setUsers(res.data);  // API response se users ko state mein set karna
    } catch (err) {
      console.error("Error fetching users", err);  // Agar error aaye to console mein show karna
    }
  };

  // Delete button ke click par user ko delete karne ka function
  const handleDelete = async (id) => {
    // Confirm box se user se puchhna ki delete karna hai ya nahi
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;  // Agar user confirm nahi karta, to delete process stop ho jaayega

    try {
      // API se delete request bhejna
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/delete/${id}`);
      alert("User deleted successfully!");  // Success message
      fetchUsers();  // User delete hone ke baad, users ko dobara fetch karna
    } catch (err) {
      console.error("Delete error:", err);  // Agar error aaye to error message console mein show karna
      alert("Failed to delete user.");  // Error message alert box mein show karna
    }
  };

  // PDF export karne ka function
  const exportToPDF = () => {
    const doc = new jsPDF(); // Nayi PDF document create karte hain
    autoTable(doc, {
      head: [["ID", "Name", "Email", "Mobile", "Role"]],  // PDF mein columns ka header
      body: users.map((u) => [u.id, u.name, u.email, u.mob_number, u.role]),  // Users ka data format karna PDF ke liye
    });
    doc.save("users.pdf");  // PDF ko save karna with the name "users.pdf"
  };

  // Excel export karne ka function
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);  // Users data ko Excel sheet mein convert karna
    const workbook = XLSX.utils.book_new();  // Nayi Excel workbook create karna
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");  // Worksheet ko workbook mein add karna
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });  // Excel data ko array mein convert karna
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });  // Blob create karna
    saveAs(data, "users.xlsx");  // Excel file download karna with the name "users.xlsx"
  };

  return (
    <div className="users-manager-container" style={{ padding: "20px" }}>
      {/* 🔙 Back Button + Heading */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={() => router.back()} // Back button ke click pe previous page pe navigate karega
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "15px"
          }}
        >
          🔙 Back
        </button>
        <h2>Users Manager</h2>
      </div>

      {/* Buttons for adding a user and exporting data */}
      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={() => router.push("/admin/users/add")} // Add User button, user add page par redirect karega
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          ➕ Add User
        </button>
        <button
          onClick={exportToPDF} // PDF export function ko call karega
          style={{
            marginLeft: "10px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Export to PDF
        </button>
        <button
          onClick={exportToExcel} // Excel export function ko call karega
          style={{
            marginLeft: "10px",
            backgroundColor: "#17a2b8",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Export to Excel
        </button>
      </div>

      {/* Users Table */}
      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.mob_number}</td>
              <td>{u.role}</td>
              <td>
                {/* Edit Button */}
                <button
                  onClick={() => router.push(`/admin/users/edit/${u.id}`)} // Edit button se user ko edit page par bhejna
                  style={{
                    backgroundColor: "#ffc107",
                    color: "#000",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  ✏️ Edit
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(u.id)} // Delete button ko click karte hi handleDelete function ko call karega
                  style={{
                    marginLeft: "8px",
                    background: "red",
                    color: "#fff",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
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

export default UsersManager;
