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
        <p className="text-5xl font-bold underline text-neutral-200">
          INPUT A MANUFACTURER NAME
        </p>
        <div id="manufacturersContainer" className='text-center'>
          <input className="bg-slate-800 p-2 text-neutral-900 mt-5 rounded-lg h-100 text-white placeholder:text-neutral-300 text-4xl border-1 border-slate-700" onChange={updateManufacturerName}></input>
        </div>
        <div>
          <button className="text-neutral-200 mt-5 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold py-2.5 px-3 mb-2 transition hover:scale-105" onClick={addManufacturerAction}>Add Manufacturer</button>
        </div>
      </div>
    </div>
  );
}

export default AddNewManufacturer;