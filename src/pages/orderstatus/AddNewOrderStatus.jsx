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
        axios.post('http://127.0.0.1:8081/addNewOrderStatus', { orderStatusName })
        .then(res => {
            if (res.data[0][0]['success']) {
              alert(res.data[0][0]['success']);
            }
            else {
              alert('no success');
            }
            console.log(res);
        })
        .catch(err => alert('Error:', err));
      }
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