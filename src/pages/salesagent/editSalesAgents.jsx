import axios from 'axios';
import React, { useEffect, useState } from "react";
import Modal from "react-modal";

function EditSalesAgents() {
  const [salesAgentName, setSalesAgentName] = useState("");
  const [data, setData] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedFName, setSelectedFName] = useState("");
  const [selectedLName, setSelectedLName] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedID, setSelectedID] = useState("");

  Modal.setAppElement("#root");

  function fetchAgents() {
    fetch("http://127.0.0.1:8081/getSalesAgents")
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
        style={{
          content: {
            width: "auto",
            height: "auto",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
      <form onSubmit={SaveChanges}>
        <div>
          <h1>
            <span style={{ color: "rgb(172, 26, 26)" }}>Edit {selectedFName} {selectedLName}</span>
          </h1>
          <div>
            <label className="labelInputBox2">
              First Name{" "}
              <input
                className="inputBox4"
                defaultValue={selectedFName}
                onChange={(e) => setSelectedFName(e.target.value)}
              ></input>
            </label>
          </div>
          <div>
            <label className="labelInputBox2">
              Last Name{" "}
              <input
                className="inputBox4"
                defaultValue={selectedLName}
                onChange={(e) => setSelectedLName(e.target.value)}
              ></input>
            </label>
          </div>
          <div>
            <label className="labelInputBox2">
              Status{" "}
              <select
                className="selectBox1"
                defaultValue={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="0">0</option>
                <option value="1">1</option>
              </select>
            </label>
          </div>
          <button className="saveButtonLG marginTop4rem">Save</button>
        </div>
        </form>
      </Modal>
    );
  };

  const SaveChanges = (e) => {
    e.preventDefault();
    const confirmChanges = confirm(`Are you sure you want to save? (ID: ${selectedID})`);
    if (confirmChanges) {
      axios.post('http://127.0.0.1:8081/EditSalesAgent', { selectedID, selectedFName, selectedLName, selectedStatus })
      .then(res => {
          if (res.data[0][0]['success']) {
            alert(res.data[0][0]['success']);
          }
          else {
            alert('no success');
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
        <p className="largeHeader marginTop2rem">Edit Sales Agents</p>
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
                      className="darkRedButtonInlineMD"
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