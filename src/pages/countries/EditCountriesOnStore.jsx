import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import SmallSimpleBanner from "../../components/banners/SmallSimpleBanner";
import LargeButton from "../../components/buttons/LargeButton";
import MediumButton from "../../components/buttons/MediumButton";
import LargeInput from "../../components/inputs/LargeInput";
import { StoreContext } from "../../contexts/StoreContext";

Modal.setAppElement("#root");

function EditCountriesOnStore() {
  const [countryID, setCountryID] = useState("");
  const [data, setData] = useState([]);
  const [countryStatus, setCountryStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedStore } = useContext(StoreContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/node/countries/getCountries`)
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

  const editStatusOnStore = (e) => {
    /*
        need to declare variables first due to async
        setCountryID(e.target.id);
        setCountryStatus(e.target.dataset.status);
        */

    const selectedCountryID = e.target.id;
    const selectedCountryStatus = e.target.dataset.status;

    setCountryID(selectedCountryID);
    setCountryStatus(selectedCountryStatus);

    if (selectedCountryID && selectedStore !== "") {
      setIsModalOpen(true);
    } else {
      alert("You forgot to select something");
    }
  };

  const editStatusOnStoreAction = (e) => {
    e.preventDefault();
    const selectedStatus = e.target.querySelector("select").value;
    const confirmEdit = confirm(
      "Are you sure you would like to set status to " +
        selectedStatus +
        " on " +
        selectedStore +
        "?"
    );

    if (confirmEdit) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/node/countries/editCountryOnStore`,
          { selectedStore, countryID, selectedStatus }
        )
        .then((res) => {
          console.log(res);
          if (res.data[0][0]["success"]) {
            alert(res.data[0][0]["success"]);
            OpenAdminURL();
          } else {
            alert("Something went wrong.");
          }
          console.log(res);
        })
        .catch((err) => console.log("Error:", err));
    }
  };

  const OpenAdminURL = () => {
    var stores = document.querySelectorAll("input[name='storeSelection']");
    stores.forEach((store) => {
      if (store.checked) {
        const adminURLForStore = store.getAttribute("data-custom-admin-url");
        window.open(adminURLForStore, "_blank");
      }
    });
  };

  return (
    <div className="text-center">
      {/*searchable input */}
      <LargeInput
        label="Search for Countries"
        placeholder="Search for Countries"
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
              <td>{d.country_id}</td>
              <td>{d.name}</td>
              <td>
                {" "}
                <MediumButton
                  text={"Edit"}
                  name={d.status}
                  id={d.country_id}
                  value={d.name}
                  action={editStatusOnStore}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Country"
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-max bg-slate-700 text-neutral-200 p-5 rounded-lg shadow-lg z-50"
        overlayClassName="Overlay"
      >
        {countryID && (
          <form onSubmit={editStatusOnStoreAction} className="editCouponForm">
            <SmallSimpleBanner
              text={"Change status on " + selectedStore}
              centered={false}
            />
            <select
              type="text"
              defaultValue={countryStatus}
              className="bg-slate-800 p-2 rounded-lg text-neutral-200 border-1 border-slate-700 text-3xl placeholder:text-neutral-400 my-12"
            >
              <option value="1">Enabled</option>
              <option value="0">Disabled</option>
            </select>
            <div className="flex justify-between">
              <LargeButton type={"submit"} text="Save" />
              <LargeButton
                type={"submit"}
                text="Cancel"
                action={"closeModal"}
                color="bg-slate-800"
              />
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default EditCountriesOnStore;
