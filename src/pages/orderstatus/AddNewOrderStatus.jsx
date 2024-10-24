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
        <p className='largeHeader marginTop2rem'>
          INPUT AN ORDER STATUS NAME
        </p>
        <div id="manufacturersContainer" className='subsectionContainer'>
          <input className='inputBox1' onChange={updateOrderStatusName}></input>
        </div>
        <div>
          <button className='darkRedButton marginTop4rem' onClick={addOrderStatusAction}>Add Order Status</button>
        </div>
      </div>
    </div>
  );
}

export default AddNewOrderStatus;