"use client";

import { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";

export default function Profile() {
  const { userInfo: profile, setUserInfo, loading, error } = useUserContext();
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [localError, setLocalError] = useState("");

  // Additional fetch if needed (fallback)
  useEffect(() => {
    if (!profile && !loading && !error) {
      const token = localStorage.getItem("token");
      if (token) {
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
          .then(res => res.json())
          .then(data => setUserInfo(data))
          .catch(err => setLocalError(err.message));
      }
    }
  }, [profile, loading, error, setUserInfo]);

  const handleChange = (e) => {
    setUserInfo({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccess("");
    
    const token = localStorage.getItem("token");
    if (!profile?.id || !token) {
      setLocalError("User not authenticated");
      return;
    }

    try {
      const updateData = {
        name: profile.name || undefined,
        mob_number: profile.mob_number || undefined,
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
        throw new Error(errorData.detail || "Update failed");
      }

      const data = await res.json();
      setUserInfo(data);
      setSuccess("✅ Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      setLocalError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading profile...</p>
      </div>
    );
  }

  if (error || localError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-red-600 font-semibold">{error || localError}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">No profile data found</p>
      </div>
    );
  }

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
                value={profile.name || ''}
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
                value={profile.mob_number || ''}
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
                value={profile.email || ''}
                disabled
                className="form-input-disabled"
              />
            </div>

            <button type="submit" className="form-submit-btn">
              Update Profile
            </button>
          </form>

          {success && <p className="form-success">{success}</p>}
          {localError && <p className="form-error">{localError}</p>}
        </div>
      )}
    </div>
  );
}