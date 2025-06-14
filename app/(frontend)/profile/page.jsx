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
        const errorMessage = typeof data.detail === "string" ? data.detail : JSON.stringify(data);
        throw new Error(errorMessage);
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
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!profile?.id) {
      setError("User ID not found.");
      return;
    }

    try {
      const updateData = {
        name: profile.name || undefined,  // Send undefined instead of null/empty
        mob_number: profile.mob_number || undefined,
        // email: profile.email || undefined // Include if you want email updates
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/update_profile/${profile.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = errorData.detail || "Update failed";
        throw new Error(errorMessage);
      }

      const data = await res.json();
      setSuccess("✅ Profile updated successfully!");
      setError("");
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading profile...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-red-600 font-semibold">{error}</p>
      </div>
    );

  return (
    <div className="profile-container">
      {/* Profile Display Card */}
      <div className="profile-card">
        <h2 className="profile-title">👤 My Profile</h2>
        <p className="profile-info"><strong>Name:</strong> {profile.name}</p>
        <p className="profile-info"><strong>Mobile:</strong> {profile.mob_number}</p>
        <p className="profile-info"><strong>Email:</strong> {profile.email}</p>

        <button
          onClick={() => setEditMode(!editMode)}
          className="profile-edit-btn"
        >
          {editMode ? "Cancel Edit" : "✏️ Edit Profile"}
        </button>
      </div>

      {/* Edit Form */}
      {editMode && (
        <div className="profile-card">
          <h2 className="profile-title">✏️ Edit Profile</h2>
          <form onSubmit={handleUpdate} className="profile-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile</label>
              <input
                type="tel"
                name="mob_number"
                value={profile.mob_number}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your 10-digit mobile number"
                pattern="[0-9]{10}"
                maxLength={10}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                disabled
                className="form-input-disabled"
              />
            </div>

            <button type="submit" className="form-submit-btn">
              Update Profile
            </button>
          </form>

          {success && <p className="form-success">{success}</p>}
          {error && <p className="form-error">{error}</p>}
        </div>
      )}
    </div>
  );
}