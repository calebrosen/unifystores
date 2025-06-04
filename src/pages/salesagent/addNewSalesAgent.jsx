import axios from 'axios';
import React, { useState } from 'react';
import BoldH1 from '../../components/headings/BoldH1';
import LargeButton from '../../components/buttons/LargeButton';
import LargeInput from '../../components/inputs/LargeInput';

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
      <div className="text-center">
        <BoldH1 text={'INPUT A SALES AGENT NAME (Formatted like "Caleb R")'}/>
        
        <div className="my-12">
          <LargeInput onChange={updateSalesAgentName}/>
        </div>
        <LargeButton text={"Add Sales Agent"} action={addSalesAgentAction} />
        
      </div>
    </div>
  );
}

export default AddNewSalesAgent;