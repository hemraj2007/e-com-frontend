// React import kar rahe hain — kyunki React component bana rahe hain
import React from 'react';
// AllProducts component ko import kar rahe hain jo individual product show karega
import AllProducts from "@/components/AllProducts";

// Yeh ek async component hai jo sirf "kids" category ke products fetch karega
export default async function Kids() {
    // FastAPI backend se kids category ke products ko fetch kar rahe hain
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/all_products?product_cat=kids`);

    // Response ko JSON me convert kar rahe hain
    const data = await response.json();

    // Debugging ke liye (agar zarurat ho) — response ka structure dekhne ke liye
    // console.log("API Response:", data);

    // Agar API se proper array nahi mila toh ek message return karenge
    if (!Array.isArray(data)) {
        return <p>No products available.</p>;
    }

    // Agar data sahi mila toh har ek product ko AllProducts component ke through show karenge
    return (
        <div className='Allproducts-container'>
            {data.map(prod => (
                // Har product ka unique key ke sath rendering ho raha hai
                <AllProducts key={prod.id} allproducts={prod} />
            ))}
        </div>
    );
}
