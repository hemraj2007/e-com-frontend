// React import kar rahe hain — kyunki hum functional component bana rahe hain
import React from 'react';
// Apna custom component import kar rahe hain jo har ek product ko display karega
import AllProducts from "@/components/AllProducts";

// Yeh ek async React component hai jo "female" category ke products fetch karega
export default async function Female() {
    // Backend API se female products fetch kar rahe hain
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/all_products?product_cat=female`);
    
    // Response ko JSON format me convert kar rahe hain
    const data = await response.json(); // ✅ Extract JSON

    // Debugging ke liye agar zarurat ho toh yeh line use kar sakte ho
    // console.log("API Response:", data);

    // Agar API se data array nahi mila toh message dikhana
    if (!Array.isArray(data)) {
        return <p>No products available.</p>;
    }

    // Agar data mil gaya toh sabhi products ko map karke AllProducts component ke through dikhana
    return (
        <div className='Allproducts-container'>
            {data.map(prod => (
                // Har product ko ek unique key ke saath render kar rahe hain
                <AllProducts key={prod.id} allproducts={prod} />
            ))}
        </div>
    );
}
