"use client";
import { useEffect, useState } from "react";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);

  const fetchProfile = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Something went wrong.");
      }

      setProfile(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/update_profile/${profile.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          mob_number: profile.mob_number,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Something went wrong.");

      setSuccess("✅ Profile updated successfully.");
      setError("");
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  if (error && !editMode) {
    return <div className="profile-error">{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-heading">👤 My Profile</h2>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Mobile:</strong> {profile.mob_number}</p>

        <button onClick={() => setEditMode(!editMode)} className="profile-edit-btn">
          {editMode ? "Cancel Edit" : "✏️ Edit Profile"}
        </button>
      </div>

      {editMode && (
        <div className="profile-edit-form">
          <h2 className="profile-heading">✏️ Edit Profile</h2>
          <form onSubmit={handleUpdate}>
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="input-field"
            />

            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              disabled
              className="input-field input-disabled"
            />

            <label>Mobile</label>
            <input
              type="text"
              name="mob_number"
              value={profile.mob_number}
              onChange={handleChange}
              className="input-field"
              pattern="[0-9]{10}"
              maxLength={10}
              required
            />

            <button type="submit" className="submit-btn">✅ Update Profile</button>
          </form>

          {success && <p className="message success">{success}</p>}
          {error && <p className="message error">{error}</p>}
        </div>
      )}
    </div>
  );
}
