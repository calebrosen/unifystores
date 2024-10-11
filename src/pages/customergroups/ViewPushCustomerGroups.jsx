import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../contexts/StoreContext';

function ViewPushCustomerGroups() {
  const [data, setData] = useState([]);
  const { selectedStore } = useContext(StoreContext);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/node/customers/viewEditCustomerGroupName`)
      .then(res => res.json())
      .then(data => setData(data[0]))
      .catch(err => console.log('Fetch error:', err));
  }, []);

  const pushToStore = (e) => {
    if (selectedStore) {
      let customerGroupID = e.target.id;
      let name = e.target.value;
      const confirmPush = confirm('Are you sure you want to push customer group "' + name + '" to ' + selectedStore + '?');
      if (confirmPush) {
        axios.post(`${process.env.REACT_APP_API_URL}/node/customers/pushCustomerGroups`, { selectedStore, customerGroupID })
        .then(res => {
            if (res.data[0][0]['success']) {
              alert(res.data[0][0]['success']);
            } else {
              alert("Something went wrong.");
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
    
    <div id="customerGroupContainer" className='subsectionContainer'>
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
              <td>{d.customer_group_id}</td>
              <td>{d.name}</td>
              <td>&nbsp;<button className='darkRedButtonInline' id={d.customer_group_id} value={d.name} onClick={pushToStore}>Push to Store</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  );
}

export default ViewPushCustomerGroups;