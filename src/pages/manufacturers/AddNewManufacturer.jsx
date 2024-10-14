import axios from 'axios';
import React, { useState } from 'react';

function AddNewManufacturer() {
  const [manufacturerName, setManufacturerName] = useState('');

  const updateManufacturerName = (e) => {
    setManufacturerName(e.target.value);
  }
  
  const addManufacturerAction = () => {
    if (manufacturerName != '') {
      const confirmPush = confirm('Are you sure you want to add ' + manufacturerName + '?');
      if (confirmPush) {
        axios.post(`${process.env.REACT_APP_API_URL}/node/manufacturers/addNewManufacturer`, { manufacturerName })
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
          INPUT A MANUFACTURER NAME
        </p>
        <div id="manufacturersContainer" className='subsectionContainer'>
          <input className='inputBox1' onChange={updateManufacturerName}></input>
        </div>
        <div>
          <button className='darkRedButton marginTop4rem' onClick={addManufacturerAction}>Add Manufacturer</button>
        </div>
      </div>
    </div>
  );
}

export default AddNewManufacturer;