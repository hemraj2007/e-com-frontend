import React from 'react'
import Link from 'next/link'

const AllProducts = ({ allproducts: { id, name,slug, description, mrp, net_price, image } }) => {
    // Use a fallback image if the image is empty or null
    const defaultImage = 'path/to/default/image.jpg'; // Add the path to a default image

    return (
        <div>
            <Link href={`/products/${slug}`}>
                <div className='Allproduct-card'>
                    <img src={image || defaultImage} width={250} height={270} alt={name} />
                    <p className='Allproduct-name'>{name}</p>
                    <p className='Allproduct-description'>{description}</p>
                    <p className='Allproduct-price'>₹ {net_price}</p>
                </div>
            </Link>
        </div>
    )
}

export default AllProducts
