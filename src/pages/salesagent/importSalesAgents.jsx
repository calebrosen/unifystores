import axios from 'axios';
import React, { useContext } from "react";
import Modal from "react-modal";
import { StoreContext } from '../../contexts/StoreContext';

function ImportSalesAgents() {
  const { selectedStore } = useContext(StoreContext);

  Modal.setAppElement("#root");

  const ImportToStore = () => {
    const confirmImport = confirm(`Are you sure you want to import ALL Sales Agents to ${selectedStore}? This will not import anyone who is already there.`)
    if (confirmImport) {
      axios.post('http://127.0.0.1:8081/ImportSalesAgents', { selectedStore })
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
  };

  return (
    <div>
      <div className="centered">
        <p className="xlHeader marginTop4rem marginBottom3rem">Import Sales Agents to Store</p>
        <button className='darkRedButton' onClick={ImportToStore}>Import</button>
      </div>
    </div>
  );
}

export default ImportSalesAgents;