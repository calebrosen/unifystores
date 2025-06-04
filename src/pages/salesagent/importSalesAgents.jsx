import axios from 'axios';
import { useContext } from "react";
import Modal from "react-modal";
import { StoreContext } from '../../contexts/StoreContext';
import LargeButton from '../../components/buttons/LargeButton';
import BoldH1 from '../../components/headings/BoldH1';

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
      <div className="text-center mt-14">
        <BoldH1 text={"IMPORT SALES AGENTS TO STORE"} />
        <div className="mt-8">
          <LargeButton text={"Import"} action={ImportToStore}/>
        </div>
      </div>
    </div>
  );
}

export default ImportSalesAgents;