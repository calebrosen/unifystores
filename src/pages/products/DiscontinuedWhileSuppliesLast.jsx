import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import HighlightedBanner from "../../components/banners/HighlightedBanner";
import LargeButton from "../../components/buttons/LargeButton";
import XLButton from "../../components/buttons/XLButton";
import LargeInput from "../../components/inputs/LargeInput";
import MediumTextarea from "../../components/textarea/MediumTextarea";
import MediumInput from "../../components/inputs/MediumInput";
import InfoBanner from "../../components/banners/InfoBanner";

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
      <InfoBanner
        text={"When the quantity of the product reaches 0, the product will be disabled on all stores, removed from options (if applicable) and marked as discontinued."}
      />
      <div className="centeredContainer">
        <XLButton
          action={openAddNewModal}
          text={"Add New"}
        />
      </div>
      <div className="centeredContainer">
        <LargeInput
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
      <div>
        <HighlightedBanner
          text={selectedMPN}
          centered={false}
        />
          <label className="text-white text-4xl font-bold mt-8" htmlFor="editReason">Reason</label>
          <MediumTextarea
            name={"editReason"}
            defaultValue={selectedReason}
            onChange={handleReasonChange}
            placeholder={"Reason"}
          />
          
          <label className="text-white text-4xl font-bold mt-8" htmlFor="editReplacedBy">Replaced By</label>
          <MediumTextarea
            name={"editReplacedBy"}
            defaultValue={selectedReplacedBy}
            onChange={handleReplacedByChange}
            placeholder={"Replaced By"}
          />

          <div className="mt-5 mb-1 flex gap-8">
            <LargeButton
              action={handleUpdate}
              text={"Save"}
            />
            <LargeButton
              action={closeModal}
              text={"Close"}
              color="bg-slate-600"
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={addNewModal}
        onRequestClose={closeModal}
        contentLabel="Modal"
        className="w-3/5 bg-slate-700 text-white rounded-lg p-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        overlayClassName={"Overlay"}
      >

        <HighlightedBanner
          text={"Add New Discontinued Product"}
          centered={false}
        />

        <label className="text-white text-4xl font-bold mt-5" htmlFor="mpn">MPN</label>
        <div>
          <MediumInput
            name={"mpn"}
            placeholder={"MPN"}
            value={selectedMPN}
            onChange={handleMPNChange}
          />
        </div>

        <label className="text-white text-4xl font-bold mt-8" htmlFor="reason">Reason</label>
        <MediumTextarea
          name={"reason"}
          onChange={handleReasonChange}
          placeholder={"Reason"}
        />


        <label className="text-white text-4xl font-bold mt-8" htmlFor="replacedBy">Replaced By</label>
        <div>
          <MediumInput
            name={"replacedBy"}
            placeholder={"Replaced By"}
            onChange={handleReplacedByChange}
          />
        </div>

        <div className="mt-5 mb-1 flex gap-8">
          <LargeButton
            action={handleAddNew}
            text={"Add New"}
          />
          <LargeButton
              action={closeModal}
              text={"Close"}
              color="bg-slate-600"
            />
        </div>

      </Modal>
    </div>
  );
}

export default DiscontinuedWhileSuppliesLast;
