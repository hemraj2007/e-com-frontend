import React from 'react';  // React ko import kar rahe hain taaki hum JSX aur components ko use kar sakein
import AllProducts from "@/components/AllProducts";  // AllProducts component ko import kar rahe hain jo products ko render karega

// Default exported async function jo 'Male' category ke products fetch karne ke liye use hoti hai
export default async function Male() {
    try {
        // API request kar rahe hain jo 'male' category ke products ko fetch karegi
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/all_products?product_cat=male%20`);

        // API response ka status code check kar rahe hain
        if (!response.ok) {
            // Agar response ok nahi hai, toh error throw karte hain status code ke saath
            throw new Error(`API Error: ${response.status}`);
        }

        // API response se JSON data ko extract kar rahe hain
        const data = await response.json(); 

        // Debugging ke liye API response ko console me log kar rahe hain taaki hum dekh sakein ki data ka structure kaisa hai
        console.log("API Response:", data);

        // Check kar rahe hain ki jo data mila hai wo ek array hai ya nahi (products ki list)
        if (!Array.isArray(data)) {
            // Agar data array nahi hai, toh 'No products available' ka message dikhaenge
            return <p>No products available.</p>;
        }

        // Agar data array hai, toh hum data ko map karke har product ko render karenge
        return (
            <div className='Allproducts-container'>
                {/* Har product ko map kar rahe hain aur AllProducts component ko pass kar rahe hain */}
                {data.map(prod => (
                    <AllProducts key={prod.id} allproducts={prod} />  /* Product ka data AllProducts component ko pass kar rahe hain */
                ))}
            </div>
        );
    } catch (error) {
        // Agar API call ya data fetching me koi error hoti hai, toh usse handle kar rahe hain
        console.error('Error fetching products:', error);

        // Agar error hota hai, toh ek generic error message display karenge
        return <p>Error loading products!</p>;
    }
}
