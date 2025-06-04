import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../contexts/StoreContext';
import MediumButton from '../../components/buttons/MediumButton';

function ViewPushOrderStatuses() {
  const [data, setData] = useState([]);
  const { selectedStore } = useContext(StoreContext);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/node/orders/viewEditOrderStatusName`)
      .then(res => res.json())
      .then(json => setData(json[0]))
      .catch(err => console.log('Fetch error:', err));
  }, []);

  const pushToStore = async (e) => {
    const orderStatusID = e.currentTarget.id;
    const name = e.currentTarget.name;

    if (!selectedStore) {
      alert('Try selecting a store first.');
      return;
    }

    const confirmPush = confirm(`Are you sure you want to push order status "${name}" to "${selectedStore}"?`);
    if (!confirmPush) return;

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/node/orders/pushOrderStatus`, {
        selectedStore,
        orderStatusID,
      });

      const result = res.data?.[0]?.[0];
      alert(result?.success || 'Something went wrong.');
    } catch (err) {
      alert('Error pushing to store.');
    }
  };

  return (
    <div id="orderStatusContainer" className="text-center mt-5">
      <table className="mx-auto">
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
              <td>
                <MediumButton
                  text="Push to Store"
                  id={d.order_status_id}
                  name={d.name}
                  action={pushToStore}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewPushOrderStatuses;
