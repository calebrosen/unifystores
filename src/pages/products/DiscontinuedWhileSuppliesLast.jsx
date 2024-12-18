import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

function DiscontinuedWhileSuppliesLast() {
  const [data, setData] = useState([]);
  const [mpnSearch, setMPNSearch] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [addNewModal, setAddNewIsOpen] = useState(false);
  const [selectedMPN, setSelectedMPN] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedReplacedBy, setSelectedReplacedBy] = useState("");

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_URL}/node/products/GetDiscontinuedDisabledProducts`
    )
      .then((res) => res.json())
      .then((data) => setData(data[0]))
      .catch((err) => console.log("Fetch error:", err));
  }, []);

  const filteredSearch = data.filter((d) =>
    d.mpn.toLowerCase().includes(mpnSearch.toLowerCase())
  );

  const updateSearchTerm = (e) => {
    setMPNSearch(e.target.value);
  };

  const openModal = (e) => {
    const mpn = e.target.getAttribute("data-custom-mpn") || "";
    const reason = e.target.getAttribute("data-custom-reason") || "";
    const replacedby = e.target.getAttribute("data-custom-replacedby") || "";
    console.log(mpn, reason, replacedby);
    setSelectedMPN(mpn);
    setSelectedReason(reason);
    setSelectedReplacedBy(replacedby);
    setIsOpen(true);
  };

  //closing modal actions
  function closeModal() {
    setIsOpen(false);
    setAddNewIsOpen(false);
    setSelectedMPN("");
    setSelectedReason("");
    setSelectedReplacedBy("");
  }

  const handleUpdate = () => {
    const confirmUpdate = confirm(
      `Are you sure you want to update the reason/replaced by for ${selectedMPN}?`
    );
    if (confirmUpdate) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/node/products/UpdateDiscontinuedOrDisabledProducts`,
          { selectedMPN, selectedReason, selectedReplacedBy }
        )
        .then((res) => {
          console.log(res);
          if (res.data[0][0]["success"]) {
            alert(res.data[0][0]["success"]);
            location.reload();
          } else {
            alert("Something went wrong.");
          }
          console.log(res);
        })
        .catch((err) => console.log("Error:", err));
    }
  };


  const handleAddNew = () => {
    const confirmUpdate = confirm(
      `Are you sure you want to add ${selectedMPN}?`
    );
    if (confirmUpdate) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/node/products/AddDiscontinuedOrDisabledProduct`,
          { selectedMPN, selectedReason, selectedReplacedBy }
        )
        .then((res) => {
          console.log(res);
          if (res.data[0][0]["success"]) {
            alert(res.data[0][0]["success"]);
          } else {
            alert("Something went wrong.");
          }
          console.log(res);
        })
        .catch((err) => console.log("Error:", err));
    }
  };

  const handleMPNChange = (e) => {
    setSelectedMPN(e.target.value);
  };

  const handleReasonChange = (e) => {
    setSelectedReason(e.target.value);
  };

  const handleReplacedByChange = (e) => {
    setSelectedReplacedBy(e.target.value);
  };

  const openAddNewModal = () => {
    setAddNewIsOpen(true);
  }

  return (
    <div>
      <div className="centeredContainer">
        <button className="darkRedButton" onClick={openAddNewModal}>Add New</button>
      </div>
      <div className="centeredContainer">
        <input
          className="inputBox1"
          label="Search by MPN"
          placeholder="Search by MPN"
          value={mpnSearch}
          onChange={updateSearchTerm}
        />
      </div>
      <table className="marginTop3rem">
        <thead>
          <tr>
            <th>MPN</th>
            <th>Reason</th>
            <th>Replaced By</th>
            <th>Status</th>
            <th>Qty</th>
            <th>Date Added</th>
            <th>Date Qty Reached 0</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {filteredSearch.map((d, i) => (
            <tr key={i}>
              <td>{d.mpn}</td>
              <td>{d.REASON}</td>
              <td>{d.ReplacedBy}</td>
              <td>{d.CurrentStatus}</td>
              <td>{d.Available}</td>
              <td>{d.DateAdded}</td>
              <td>{d.DateReachedZero}</td>
              <td
                onClick={openModal}
                className="edit"
                data-custom-mpn={d.mpn}
                data-custom-reason={d.REASON}
                data-custom-replacedby={d.ReplacedBy}
              >
                Edit
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
      >
        <div className="centeredContainer">
          <span className="xxlHeader">{selectedMPN}</span>
        </div>

        <div>
          <p>
            <span className="largeHeader">Reason</span>
            <textarea
              className="textAreaAutoLarger"
              defaultValue={selectedReason}
              onChange={handleReasonChange}
            />
          </p>
          <p>
            <span className="largeHeader">Replaced By</span>
            <textarea
              className="textAreaAutoLarger"
              defaultValue={selectedReplacedBy}
              onChange={handleReplacedByChange}
            />
          </p>
        </div>

        <div className="centeredContainer">
          <button className="saveButtonLG" onClick={handleUpdate}>
            Save
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={addNewModal}
        onRequestClose={closeModal}
        contentLabel="Modal"
      >
        <p>
          <span className="largeHeader">MPN</span>
          <br/>
          <input className="inputBox1" onChange={handleMPNChange} style={{marginTop: '0.2rem'}}></input>
        </p>
        
          <p>
            <span className="largeHeader">Reason</span>
            <textarea
              className="textAreaAutoLarger"
              defaultValue={selectedReason}
              onChange={handleReasonChange}
            />
          </p>
          <p>
            <span className="largeHeader">Replaced By</span>
            <textarea
              className="textAreaAutoLarger"
              defaultValue={selectedReplacedBy}
              onChange={handleReplacedByChange}
            />
          </p>

        <div className="centeredContainer">
          <button className="saveButtonLG" onClick={handleAddNew}>
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default DiscontinuedWhileSuppliesLast;
