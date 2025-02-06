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
          }
          else {
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
          } else if (res.data[0][0]["duplicate"]) {
            alert("Product is already in list");
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
    <div className="centered text-neutral-200 text-4xl mt-8 max-w-7xl mx-auto bg-slate-700 rounded-lg p-4">Simply add a discontinued product to this, and when the quantity of the product reaches 0, the product will be disabled on all stores (including OCMaster), removed from options (if applicable) and marked as discontinued.</div>
      <div className="centeredContainer">
        <button className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold px-5 py-3 me-2 mb-2 transition hover:scale-105" onClick={openAddNewModal}>Add New</button>
      </div>
      <div className="centeredContainer">
        <input
          className="bg-slate-700 p-3 rounded-lg text-neutral-200 text-4xl"
          label="Search by MPN"
          placeholder="Search by MPN"
          value={mpnSearch}
          onChange={updateSearchTerm}
        />
      </div>
      <table className="mt-5">
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
        overlayClassName={"Overlay"}
        className="w-3/5 bg-slate-700 text-white rounded-lg p-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="centeredContainer">
          <span className="text-white text-6xl font-bold underline">{selectedMPN}</span>
        </div>

        <div>
          <p>
            <span className="text-white text-4xl font-bold">Reason</span>
            <textarea
              className="bg-slate-800 text-white rounded-xl w-full p-1 mt-1"
              defaultValue={selectedReason}
              onChange={handleReasonChange}
            />
          </p>
          <p className="mt-4">
          <span className="text-white text-4xl font-bold">Replaced By</span>
            <textarea
              className="bg-slate-800 text-white rounded-xl w-full p-1 mt-1"
              defaultValue={selectedReplacedBy}
              onChange={handleReplacedByChange}
            />
          </p>
        </div>

        <div className="centeredContainer">
          <button className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold py-2 px-3 transition hover:scale-105" onClick={handleUpdate}>
            Save
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={addNewModal}
        onRequestClose={closeModal}
        contentLabel="Modal"
        className="w-3/5 bg-slate-700 text-white rounded-lg p-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        overlayClassName={"Overlay"}
      >
        <p className="my-4">
        <span className="text-white text-4xl font-bold">MPN</span>
          <br/>
          <input onChange={handleMPNChange} className="bg-slate-800 text-white rounded-xl w-full p-1 mt-1"></input>
        </p>
        <p className="my-4">
          <span className="text-white text-4xl font-bold">Reason</span>
            <textarea
              className="bg-slate-800 text-white rounded-xl w-full p-1 mt-1"
              defaultValue={selectedReason}
              onChange={handleReasonChange}
            />
          </p>
          <p className="my-4">
          <span className="text-white text-4xl font-bold">Replaced By</span>
            <textarea
              className="bg-slate-800 text-white rounded-xl w-full p-1 mt-1"
              defaultValue={selectedReplacedBy}
              onChange={handleReplacedByChange}
            />
          </p>

        <div className="centeredContainer">
          <button className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold py-2 px-3 transition hover:scale-105"  onClick={handleAddNew}>
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default DiscontinuedWhileSuppliesLast;
