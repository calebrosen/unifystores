import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StoreContext } from '../../contexts/StoreContext';

function ReleaseProducts() {
    const [productDescription, setProductDescription] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); 
    const { selectedStore } = useContext(StoreContext); 
    
    const handleSearch = (event) => {
      setSearchQuery(event.target.value);
    };
  
    const filteredProducts = productDescription.filter((d) => 
      d.mpn.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
  
    const refetchContent = () => {
        fetch('http://127.0.0.1:8081/getProductsForRelease')
        .then(res => res.json())
        .then(data => setProductDescription(data[0]))
        .catch(err => console.log('Fetch error:', err));
    };
  
  
    return (
      <div>
        <div className='centered'>
          <button className='darkRedButton' onClick={refetchContent}>Fetch store products</button>
        </div>
        <div className='centeredContainer marginBottom4rem'>
          <input 
            className='marginTop3rem inputBox1'
            label='Search by MPN' 
            placeholder='Search by MPN'
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <table className='marginTop3rem'>
          <thead>
            <tr>
            <th>Store</th>
            <th>Product_id</th>
            <th>Model</th>
            <th>MPN</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Name</th>
            <th>Release</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((d, i) => (
              <tr key={i}>
                <td>{d.store_id}</td>
                <td>{d.product_id}</td>
                <td>{d.model}</td>
                <td>{d.mpn}</td>
                <td>{d.quantity}</td>
                <td>{d.status}</td>
                <td>{d.name}</td>
                <td>
                  <button 
                    data-custom-model={d.model}
                    data-custom-mpn={d.mpn}
                    id={d.product_id}
                    className='darkRedButtonInlineMD'
                   >
                      View/Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        

      </div>
    );
  }
  
export default ReleaseProducts;
