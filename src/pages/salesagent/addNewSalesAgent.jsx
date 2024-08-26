import axios from 'axios';
import React, { useState } from 'react';

function AddNewSalesAgent() {
  const [salesAgentName, setSalesAgentName] = useState('');

  const updateSalesAgentName = (e) => {
    setSalesAgentName(e.target.value.trim());
  }
  
  const addSalesAgentAction = () => {
    if (salesAgentName != '') {
      const confirmPush = confirm(`Are you sure you want to add "${salesAgentName}"? They will be added to the local table and ALL stores.`);
      if (confirmPush) {
        axios.post('http://127.0.0.1:8081/addNewSalesAgent', { salesAgentName })
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
      alert("Input a name");
    }
  }

  return (
    <div>
      <div className='centered'>
        <p className='largeHeader marginTop2rem'>
          INPUT A SALES AGENT NAME (Formatted like "Caleb R")
        </p>
        <div id="salesAgentContainer" className='subsectionContainer'>
          <input className='inputBox1' onChange={updateSalesAgentName}></input>
        </div>
        <div>
          <button className='darkRedButton marginTop4rem' onClick={addSalesAgentAction}>Add Sales Agent</button>
        </div>
      </div>
    </div>
  );
}

export default AddNewSalesAgent;