import axios from 'axios';
import React, { useState } from 'react';

function AddNewCustomerGroup() {
  const [customerGroupName, setCustomerGroupName] = useState('');

  const updateCustomerGroupName = (e) => {
    setCustomerGroupName(e.target.value);
  }
  
  const addCustomerGroupAction = () => {
    if (customerGroupName != '') {
      const confirmPush = confirm('Are you sure you want to add ' + customerGroupName + '?');
      if (confirmPush) {
        axios.post(`${process.env.REACT_APP_API_URL}/node/customers/addNewCustomerGroup`, { customerGroupName })
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
    }
  }

  return (
    <div>
      <div className='centered'>
        <p className='largeHeader marginTop2rem'>
          INPUT A CUSTOMER GROUP NAME
        </p>
        <div id="customerGroupContainer" className='subsectionContainer'>
          <input className='inputBox1' onChange={updateCustomerGroupName}></input>
        </div>
        <div>
          <button className='darkRedButton marginTop4rem' onClick={addCustomerGroupAction}>Add Customer Group</button>
        </div>
      </div>
    </div>
  );
}

export default AddNewCustomerGroup;