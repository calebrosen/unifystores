import axios from 'axios';
import React, { useEffect, useState } from "react";
import Modal from "react-modal";

function EditSalesAgents() {
  const [data, setData] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedFName, setSelectedFName] = useState("");
  const [selectedLName, setSelectedLName] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedID, setSelectedID] = useState("");

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

  const openModal = (e) => {
    setSelectedID(e.target.getAttribute("data-custom-id"));
    setSelectedFName(e.target.getAttribute("data-custom-firstname"));
    setSelectedLName(e.target.getAttribute("data-custom-lastname"));
    setSelectedStatus(e.target.getAttribute("data-custom-status"));
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const ModalPopup = () => {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="w-1/3 bg-slate-700 text-white rounded-lg p-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        overlayClassName={"Overlay"}
      >
      <form onSubmit={SaveChanges}>
        <div>
          <h1>
            <span className="text-white text-4xl">Edit {selectedFName} {selectedLName}</span>
          </h1>
          <div className="mt-5">
            <label className="text-2xl text-white">
              First Name
              <input
                className="block w-100 bg-slate-800 px-2 py-2.5 text-neutral-200 rounded-lg text-neutral-200 text-3xl"
                defaultValue={selectedFName}
                onChange={(e) => setSelectedFName(e.target.value)}
              ></input>
            </label>
          </div>
          <div className="my-2">
          <label className="text-2xl text-white">
              Last Name{" "}
              <input
                className="block w-100 bg-slate-800 px-2 py-2.5 text-neutral-200 rounded-lg text-neutral-200 text-3xl"
                defaultValue={selectedLName}
                onChange={(e) => setSelectedLName(e.target.value)}
              ></input>
            </label>
          </div>
          <div className="my-2">
          <label className="text-2xl text-white">
              Status{" "}
              <select
                className="block w-100 bg-slate-800 px-2 py-2.5 text-neutral-200 rounded-lg text-neutral-200 text-3xl"
                defaultValue={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="0">0</option>
                <option value="1">1</option>
              </select>
            </label>
          </div>
          <button className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold py-2 px-3 transition hover:scale-105 mt-4">Save</button>
        </div>
        </form>
      </Modal>
    );
  };

  const SaveChanges = (e) => {
    e.preventDefault();
    const confirmChanges = confirm(`Are you sure you want to save? (ID: ${selectedID})`);
    if (confirmChanges) {
      axios.post(`${process.env.REACT_APP_API_URL}/node/salesagents/EditSalesAgent`, { selectedID, selectedFName, selectedLName, selectedStatus })
      .then(res => {
          if (res.data[0][0]['success']) {
            alert(res.data[0][0]['success']);
          }
          else {
            alert('Something went wrong');
          }
          console.log(res);
          fetchAgents();
      })
      .catch(err => alert('Error:', err));

    }
  };

  return (
    <div>
      <div className="centered">
        <p className="text-white text-6xl bold underline">Edit Sales Agents</p>
        <div id="salesAgentContainer">
          <table className="marginTop3rem">
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
                    <button
                      onClick={openModal}
                      data-custom-id={d.id}
                      data-custom-firstname={d.firstname}
                      data-custom-lastname={d.lastname}
                      data-custom-status={d.status}
                      className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-2xl font-semibold p-2 transition hover:scale-105"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ModalPopup />
    </div>
  );
}

export default EditSalesAgents;