"use client"; // 👈 this is important
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MaleProductTable = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/all_products?product_cat=male`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error('Error fetching male products:', err);
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Male Products</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-xl">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-4 border-b">Image</th>
              <th className="py-3 px-4 border-b">Name</th>
              <th className="py-3 px-4 border-b">Description</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-contain rounded"
                  />
                </td>
                <td className="py-3 px-4 border-b font-medium">
                  {product.name}
                </td>
                <td className="py-3 px-4 border-b text-gray-700">
                  {product.description}
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan="3"
                  className="text-center text-gray-500 py-6 font-medium"
                >
                  No male products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaleProductTable;


