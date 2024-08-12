import axios from 'axios';
import React, { useState } from 'react';

function AddNewStockStatus() {
  const [stockStatusName, setStockStatusName] = useState('');

  const updateStockStatusName = (e) => {
    setStockStatusName(e.target.value);
  }
  
  const addStockStatusAction = () => {
    if (stockStatusName != '') {
      const confirmPush = confirm('Are you sure you want to add ' + stockStatusName + '?');
      if (confirmPush) {
        axios.post('http://127.0.0.1:8081/addNewStockStatus', { stockStatusName })
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
    } else {
      alert('Try again');
    }
  }

  return (
    <div>
      <div className='centered'>
        <p className='largeHeader marginTop2rem'>
          INPUT A STOCK STATUS NAME
        </p>
        <div id="stockStatusContainer" className='subsectionContainer'>
          <input className='inputBox1' onChange={updateStockStatusName}></input>
        </div>
        <div>
          <button className='darkRedButton marginTop4rem' onClick={addStockStatusAction}>Add Stock Status</button>
        </div>
      </div>
    </div>
  );
}

export default AddNewStockStatus;