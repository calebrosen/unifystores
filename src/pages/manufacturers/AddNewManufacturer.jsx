import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../contexts/StoreContext';

function AddNewManufacturer() {
  const { selectedStore } = useContext(StoreContext);

  const pushToStore = (e) => {
    if (selectedStore) {
      let manufacturerID = e.target.id;
      let name = e.target.value;
      const confirmPush = confirm('Are you sure you want to push ' + name + ' to ' + selectedStore + '?');
      if (confirmPush) {
        axios.post('http://127.0.0.1:8081/pushManufacturer', { selectedStore, manufacturerID })
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
      
    </div>
  );
}

export default AddNewManufacturer;