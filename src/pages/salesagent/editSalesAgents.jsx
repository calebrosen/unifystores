import axios from 'axios';
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import BoldH1 from '../../components/headings/BoldH1';
import LargeButton from '../../components/buttons/LargeButton';
import MediumButton from '../../components/buttons/MediumButton';
import HighlightedBanner from '../../components/banners/HighlightedBanner';
import LargeInput from "../../components/inputs/LargeInput";

function EditSalesAgents() {
  const [data, setData] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState({
    id: '',
    firstname: '',
    lastname: '',
    status: '0',
  });

  Modal.setAppElement("#root");

  function fetchAgents() {
    fetch(`${process.env.REACT_APP_API_URL}/node/salesagents/getSalesAgents`)
      .then((res) => res.json())
      .then((data) => setData(data[0]))
      .catch((err) => console.log("Fetch error:", err));
  }

  useEffect(() => {
    fetchAgents();
  }, []);

  const openModal = (agent) => () => {
    setSelectedAgent({
      id: agent.id,
      firstname: agent.firstname,
      lastname: agent.lastname,
      status: agent.status.toString(),
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleChange = (field) => (e) => {
    setSelectedAgent((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const SaveChanges = (e) => {
    e.preventDefault();
    const confirmChanges = confirm(`Are you sure you want to save? (ID: ${selectedAgent.id})`);
    if (confirmChanges) {
      axios.post(`${process.env.REACT_APP_API_URL}/node/salesagents/EditSalesAgent`, {
        selectedID: selectedAgent.id,
        selectedFName: selectedAgent.firstname,
        selectedLName: selectedAgent.lastname,
        selectedStatus: selectedAgent.status
      })
        .then(res => {
          if (res.data[0][0]['success']) {
            alert(res.data[0][0]['success']);
          } else {
            alert('Something went wrong');
          }
          fetchAgents();
        })
        .catch(err => alert('Error:', err));
    }
  };

  const ModalPopup = () => (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      className="w-max bg-slate-700 text-white rounded-lg p-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      overlayClassName={"Overlay"}
    >
      <form onSubmit={SaveChanges}>
        <HighlightedBanner centered={false} text={`Edit ${selectedAgent.firstname} ${selectedAgent.lastname}`}/>
        <div className="mt-5 text-3xl">
            First Name
            <div>
            <LargeInput
              value={selectedAgent.firstname}
              onChange={handleChange("firstname")}
            />
          </div>
        </div>

        <div className="my-3 text-3xl">
            Last Name
            <div>
            <LargeInput
              value={selectedAgent.lastname}
              onChange={handleChange("lastname")}
            />
          </div>
        </div>

        <div className="mt-2 mb-5 text-3xl">
          <div>
            Status
            <select
              className="block w-60 bg-slate-800 px-2 py-2.5 text-neutral-200 rounded-lg text-3xl"
              value={selectedAgent.status}
              onChange={handleChange("status")}
            >
              <option value="0">0</option>
              <option value="1">1</option>
            </select>
          </div>
        </div>
        <LargeButton type="submit" text={"Save"}/>
      </form>
    </Modal>
  );

  return (
    <div>
      <div className="text-center">
        <BoldH1 text={"Edit Sales Agents"} />
          <table className="mt-5">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Status</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i}>
                  <td>{d.id}</td>
                  <td>{d.firstname}</td>
                  <td>{d.lastname}</td>
                  <td>{d.status}</td>
                  <td>
                    <MediumButton
                      action={openModal(d)}
                      text={"Edit"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
      <ModalPopup />
    </div>
  );
}

export default EditSalesAgents;
