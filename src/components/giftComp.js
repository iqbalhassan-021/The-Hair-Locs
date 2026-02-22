import React from 'react'
import { Link } from 'react-router-dom'

function giftComp() {
  return (
    <div className='gift-comp'>
        <div className='info-box'>
            <h1 className='gift-title'>Face Mask</h1>
            <p className='gift-description'>Discover our premium face mask collection, designed for comfort, protection, and everyday style. Find the perfect mask that keeps you covered while looking your best.</p>
            <Link to='/Category/Face mask' className='primary-button'>Shop Now</Link>
        </div>
    </div>
  )
}

export default giftComp