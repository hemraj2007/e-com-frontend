"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AddUserPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", // ✅ password field added
    mob_number: "",
    role: "user",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      alert("User added!");
      router.push("/admin/users");
    } catch (error) {
      console.error("Add user error:", error);
      alert("Failed to add user");
    }
  };

  return (
    <form className="edit-user-form" onSubmit={handleSubmit}>
      <h2>Add New User</h2>
      <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required /> {/* ✅ */}
      <input type="text" name="mob_number" placeholder="Mobile Number" onChange={handleChange} required />
      <select name="role" onChange={handleChange}>
        <option value="user">User</option>
      </select>
      <button type="submit">Add User</button>
    </form>
  );
};

export default AddUserPage;


