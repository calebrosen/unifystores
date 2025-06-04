import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import { StoreContext } from "../../contexts/StoreContext";
import BoldH1 from "../../components/headings/BoldH1";
import HighlightedBanner from "../../components/banners/HighlightedBanner";
import MediumButton from "../../components/buttons/MediumButton";
import MediumInput from "../../components/inputs/MediumInput";
import LargeButton from "../../components/buttons/LargeButton";

Modal.setAppElement("#root");

function EditZonesOnStore() {
  const [zoneID, setZoneID] = useState("");
  const [zoneName, setZoneName] = useState("");
  const [data, setData] = useState([]);
  const [zoneStatus, setZoneStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedStore } = useContext(StoreContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/node/zones/getZones`)
      .then((res) => res.json())
      .then((data) => setData(data[0]))
      .catch((err) => console.log("Fetch error:", err));
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = data.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const editStatusOnStore = (name, id, status) => {
    setZoneName(name);
    setZoneID(id);
    setZoneStatus(status);
    if (selectedStore !== "") {
      setIsModalOpen(true);
    } else {
      alert("You forgot to select something");
    }
  };

  const editStatusOnStoreAction = (e) => {
    e.preventDefault();
    const selectedStatus = e.target.querySelector("select").value;
    const confirmEdit = confirm(
      "Are you sure you would like to set " +
        zoneName +
        " to status " +
        selectedStatus +
        " on " +
        selectedStore +
        "?"
    );

    if (confirmEdit) {
      axios
        .post(`${process.env.REACT_APP_API_URL}/node/zones/editZonesOnStore`, {
          selectedStore,
          zoneID,
          selectedStatus,
        })
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

  return (
    <div className="text-center">
      {/*searchable input */}
      <MediumInput
        placeholder="Search for Zones"
        value={searchQuery}
        onChange={handleSearch}
      />
      <table className="mt-5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((d, i) => (
            <tr key={i}>
              <td>{d.zone_id}</td>
              <td>{d.name}</td>
              <td>
                <MediumButton
                  text={"Edit"}
                  action={() => {
                    editStatusOnStore(d.name, d.zone_id, d.status);
                  }}
                  id={d.zone_id}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Zone"
        className="w-2/7 bg-slate-700 max-h-[93vh] overflow-y-auto text-white rounded-lg p-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        overlayClassName="Overlay"
      >
        {zoneID && (
          <form onSubmit={editStatusOnStoreAction}>
            <HighlightedBanner size={"text-4xl"} text={`Change Status of ${zoneName}`} />

            <div>
                <select
                    type="text"
                    defaultValue={zoneStatus}
                    className="bg-slate-800 p-3 rounded-lg text-neutral-200 text-2xl border-1 border-slate-700 placeholder:text-neutral-400 mt-8"
                >
                <option value="1">Enabled</option>
                <option value="0">Disabled</option>
                </select>
            </div>

            <div className="mt-8">
                <LargeButton text={"Save"} type="submit" />
            </div>

          </form>
        )}
      </Modal>
    </div>
  );
}

export default EditZonesOnStore;
