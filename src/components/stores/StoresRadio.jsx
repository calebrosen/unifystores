import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../contexts/StoreContext';

function StoresRadio({ children }) {
  const [data, setData] = useState([]);
  const { selectedStore, setSelectedStore } = useContext(StoreContext); // Use context

  useEffect(() => {
    fetch('http://127.0.0.1:8081/fetchStores')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log('Fetch error:', err));
  }, []);

  const handleStoreChange = (event) => {
    setSelectedStore(event.target.value); // Update selected store in context
  };

  return (
    <div id="storeContainer">
      <p className='selectStoresHeader'>SELECT STORE TO AFFECT</p>
      {
        data
          .sort((a, b) => a.ms_short_name.localeCompare(b.ms_short_name)) // alphabetically sorting
          .map((d, i) => (
            <span key={i} className='storeSelection'>
              <input
                type="radio"
                name="storeSelection"
                value={d.ms_short_name}
                id={`select${d.ms_short_name}`}
                checked={selectedStore === d.ms_short_name}
                onChange={handleStoreChange}
              />
              <label htmlFor={`select${d.ms_short_name}`} className='storeLabel'> {d.ms_short_name} </label>
            </span>
          ))
      }
      {children}
    </div>
  );
}

export default StoresRadio;
