import React, { useEffect, useState } from 'react';

function Stores({ children }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8081/fetchStores')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log('Fetch error:', err));
  }, []);

  return (
    <div id="storeContainer">
      <p className='selectStoresHeader'>SELECT STORES TO AFFECT</p>
      {
        data
          .sort((a, b) => a.ms_short_name.localeCompare(b.ms_short_name)) // alphabetically sorting
          .map((d, i) => (
            <span key={i} className='storeSelection'>
              <input
                type="checkbox"
                id={`select${d.ms_short_name}`}
              />
              <label htmlFor={`select${d.ms_short_name}`} className='storeLabel'> {d.ms_short_name} </label>
            </span>
          ))
      }
      {children} {/* this 'children' component will render everything else on the page */}
    </div>
  );
}

export default Stores;
