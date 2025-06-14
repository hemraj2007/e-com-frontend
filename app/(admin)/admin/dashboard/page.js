'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);

  useEffect(() => {
    // Fetch all users
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/users`)
      .then(res => res.json())
      .then(data => setUserCount(data.length));

    // Fetch all products
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/all_products`)
      .then(res => res.json())
      .then(data => setProductCount(data.length));

    // Fetch all categories
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/all_category`)
      .then(res => res.json())
      .then(data => setCategoryCount(data.length));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        <DashboardCard title="Total Users" count={userCount} color="#4CAF50" />
        <DashboardCard title="Total Products" count={productCount} color="#2196F3" />
        <DashboardCard title="Total Categories" count={categoryCount} color="#FFC107" />
      </div>
    </div>
  );
}

function DashboardCard({ title, count, color }) {
  return (
    <div style={{
      flex: 1,
      padding: '1.5rem',
      backgroundColor: color,
      color: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      textAlign: 'center'
    }}>
      <h3>{title}</h3>
      <h1>{count}</h1>
    </div>
  );
}
