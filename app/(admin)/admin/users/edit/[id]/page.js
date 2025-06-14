"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

const EditUserPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mob_number: "",
    role: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/update_profile/${id}`);
      const user = res.data.find((u) => u.id === parseInt(id));
      if (user) setFormData(user);
    };
    if (id) fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/users/${id}`, {
      ...formData,
      updated_at: new Date().toISOString(),
    });
    alert("User updated!");
    router.push("/admin/users");
  };

  return (
    <form className="edit-user-form" onSubmit={handleSubmit}>
      <h2>Edit User</h2>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        placeholder="Name"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        placeholder="Email"
      />
      <input
        type="text"
        name="mob_number"
        value={formData.mob_number}
        onChange={handleChange}
        required
        placeholder="Mobile Number"
      />
      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="user">User</option>
        <option value="manager">Manager</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Update User</button>
    </form>
  );
};

export default EditUserPage;
