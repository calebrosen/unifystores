import axios from 'axios';
import React, { useState } from 'react';

function AddNewOrderStatus() {
  const [orderStatusName, setOrderStatusName] = useState('');

  const updateOrderStatusName = (e) => {
    setOrderStatusName(e.target.value);
  }
  
  const addOrderStatusAction = () => {
    if (orderStatusName != '') {
      const confirmPush = confirm('Are you sure you want to add ' + orderStatusName + '?');
      if (confirmPush) {
        axios.post(`${process.env.REACT_APP_API_URL}/node/orders/addNewOrderStatus`, { orderStatusName })
        .then(res => {
            if (res.data[0][0]['success']) {
              alert(res.data[0][0]['success']);
            }
            else {
              alert('Something went wrong');
            }
            console.log(res);
        })
        .catch(err => alert('Error:', err));
      }
    } else {
      alert('Try again');
    }
  }

  return (
    <div>
      <div className='centered'>
        <p className="text-5xl font-bold underline text-neutral-200">
          INPUT AN ORDER STATUS NAME
        </p>
        <div id="manufacturersContainer" className='text-center'>
          <input className="bg-slate-800 p-2 text-neutral-900 mt-5 rounded-lg h-100 text-white placeholder:text-neutral-300 text-4xl border-1 border-slate-700" onChange={updateOrderStatusName}></input>
        </div>
        <div>
          <button className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 mt-5 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold py-2.5 px-3 mb-2 transition hover:scale-105" onClick={addOrderStatusAction}>Add Order Status</button>
        </div>
      </div>
    </div>
  );
}

export default AddNewOrderStatus;