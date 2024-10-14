import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../contexts/StoreContext';

function ViewPushManufacturers() {
  const [data, setData] = useState([]);
  const { selectedStore } = useContext(StoreContext);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/node/manufacturers/viewEditManufacturers`)
      .then(res => res.json())
      .then(data => setData(data[0]))
      .catch(err => console.log('Fetch error:', err));
  }, []);

  const pushToStore = (e) => {
    if (selectedStore) {
      let manufacturerID = e.target.id;
      let name = e.target.value;
      const confirmPush = confirm('Are you sure you want to push ' + name + ' to ' + selectedStore + '?');
      if (confirmPush) {
        axios.post(`${process.env.REACT_APP_API_URL}/node/manufacturers/pushManufacturer`, { selectedStore, manufacturerID })
        .then(res => {
            if (res.data[0][0]['success']) {
              alert(res.data[0][0]['success']);
            }
            console.log(res);
        })
        .catch(err => alert('Error:', err));
      }
    } else {
      alert('Try selecting a store first.');
    }
  }

  return (
    
    <div id="manufacturersContainer" className='subsectionContainer'>
      <table className='marginTop3rem'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Push to Store</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.manufacturer_id}</td>
              <td>{d.name}</td>
              <td>&nbsp;<button className='darkRedButtonInline' id={d.manufacturer_id} value={d.name} onClick={pushToStore}>Push to Store</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewPushManufacturers;