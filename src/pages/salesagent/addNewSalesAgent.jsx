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
        axios.post(`${process.env.REACT_APP_API_URL}/node/salesagents/addNewSalesAgent`, { salesAgentName })
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
        <p className="mt-5 text-white text-5xl font-bold">
          INPUT A SALES AGENT NAME (Formatted like "Caleb R")
        </p>
        <div id="salesAgentContainer" className='text-center'>
          <input className="bg-slate-800 mt-5 px-2 py-2 m-0 placeholder:text-neutral-300 rounded-lg text-neutral-200 text-4xl border-1 border-slate-700" onChange={updateSalesAgentName}></input>
        </div>
        <div>
          <button className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold p-3 mb-2 transition hover:scale-105 mt-5" onClick={addSalesAgentAction}>Add Sales Agent</button>
        </div>
      </div>
    </div>
  );
}

export default AddNewSalesAgent;