import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../contexts/StoreContext';

function ViewPushOrderStatuses() {
  const [data, setData] = useState([]);
  const { selectedStore } = useContext(StoreContext);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/node/orders/viewEditOrderStatusName`)
      .then(res => res.json())
      .then(data => setData(data[0]))
      .catch(err => console.log('Fetch error:', err));
  }, []);

  const pushToStore = (e) => {
    if (selectedStore) {
      let orderStatusID = e.target.id;
      let name = e.target.value;
      const confirmPush = confirm('Are you sure you want to push order status ' + name + ' to ' + selectedStore + '?');
      if (confirmPush) {
        axios.post(`${process.env.REACT_APP_API_URL}/node/orders/pushOrderStatus`, { selectedStore, orderStatusID })
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
    
    <div id="orderStatusContainer" className='text-center'>
      <table className='mt-5'>
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
              <td>{d.order_status_id}</td>
              <td>{d.name}</td>
              <td>&nbsp;<button className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-3xl font-semibold p-2 transition hover:scale-105" id={d.order_status_id} value={d.name} onClick={pushToStore}>Push to Store</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewPushOrderStatuses;