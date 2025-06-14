"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

const EditCategoryPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/all_category`);
        const category = response.data.find((cat) => cat.id === parseInt(id));
        if (category) {
          setName(category.name);
        } else {
          alert("Category not found!");
        }
      } catch (error) {
        console.error("Error fetching category:", error);
        alert("Something went wrong!");
      }
      setLoading(false);
    };

    if (id) fetchCategory();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/category_update/${id}`, {
        name: name,
        updated_at: new Date().toISOString()
      });

      alert("Category updated successfully!");
      router.push("/admin/category");
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Update failed!");
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>⏳ Loading...</div>
      ) : (
        <form className="edit-category-form" onSubmit={handleSubmit}>
          <h2>Edit Category</h2>

          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category Name"
            required
          />

          <button type="submit">Update Category</button>
        </form>
      )}
    </>
  );
};

export default EditCategoryPage;
