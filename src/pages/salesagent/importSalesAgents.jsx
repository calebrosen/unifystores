import axios from 'axios';
import React, { useContext } from "react";
import Modal from "react-modal";
import { StoreContext } from '../../contexts/StoreContext';

function ImportSalesAgents() {
  const { selectedStore } = useContext(StoreContext);

  Modal.setAppElement("#root");

  const ImportToStore = () => {
    if (selectedStore) {
      const confirmImport = confirm(`Are you sure you want to import ALL Sales Agents to ${selectedStore}? This will not import anyone who is already there.`)
      if (confirmImport) {
        axios.post(`${process.env.REACT_APP_API_URL}/node/salesagents/ImportSalesAgents`, { selectedStore })
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
      alert("Please select a store first.");
    }
  }

  return (
    <div>
      <div className="centered">
        <p className="text-white text-5xl mt-28 mb-4 bold underline">Import Sales Agents to Store</p>
        <button className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 rounded-xl text-4xl font-medium py-2 px-3 transition hover:scale-105 mt-4" onClick={ImportToStore}>Import</button>
      </div>
    </div>
  );
}

export default ImportSalesAgents;