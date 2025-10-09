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

function ProductPromotions() {
  const [data, setData] = useState([]);
  const [mpnSearch, setMPNSearch] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [addNewModal, setAddNewIsOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [formData, setFormData] = useState({
    promo_id: "",
    mpn: "",
    promo_price: "",
    start_date: "",
    end_date: "",
    promo_status: 1,
    promo_notes: ""
  });

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = () => {
    fetch(`${process.env.REACT_APP_API_URL}/node/products/GetProductPromotions`)
      .then((res) => res.json())
      .then((data) => setData(data[0]))
      .catch((err) => console.log("Fetch error:", err));
  };

  const filteredSearch = data.filter((d) =>
    d.mpn.toLowerCase().includes(mpnSearch.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusText = (status) => {
    return status === 1 ? "Active" : "Inactive";
  };

  const openEditModal = (promo) => {
    setSelectedPromo(promo);
    setFormData({
      promo_id  : promo.promo_id,
      mpn: promo.mpn,
      promo_price: promo.promo_price || "",
      start_date: formatDate(promo.start_date),
      end_date: formatDate(promo.end_date),
      promo_status: promo.promo_status || 1,
      promo_notes: promo.promo_notes || ""
    });
    setIsOpen(true);
  };

  const openAddNewModal = () => {
    setSelectedPromo(null);
    setFormData({
      promo_id  : "",
      mpn: "",
      promo_price: "",
      start_date: "",
      end_date: "",
      promo_status: 1,
      promo_notes: ""
    });
    setAddNewIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setAddNewIsOpen(false);
    setSelectedPromo(null);
    setFormData({
      promo_id  : "",
      mpn: "",
      promo_price: "",
      start_date: "",
      end_date: "",
      promo_status: 1,
      promo_notes: ""
    });
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleUpdate = () => {
    const confirmUpdate = window.confirm(
      `Are you sure you want to update the promotion for ${formData.mpn}?`
    );
    
    if (confirmUpdate) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/node/products/UpdateProductPromotion`,
          formData
        )
        .then((res) => {
          if (res.data[0][0]["success"]) {
            alert(res.data[0][0]["success"]);
            closeModal();
            fetchPromos();
          } else {
            alert("Something went wrong.");
          }
        })
        .catch((err) => {
          console.log("Error:", err);
          alert("An error occurred while updating.");
        });
    }
  };

  const handleAddNew = () => {
    const confirmUpdate = window.confirm(
      `Are you sure you want to add promotion for ${formData.mpn}?`
    );
    
    if (confirmUpdate) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/node/products/AddProductPromotion`,
          formData
        )
        .then((res) => {
          if (res.data[0][0]["success"]) {
            alert(res.data[0][0]["success"]);
            closeModal();
            fetchPromos();
          } else if (res.data[0][0]["duplicate"]) {
            alert("Promotion for this product already exists");
          } else {
            alert("Something went wrong.");
          }
        })
        .catch((err) => {
          console.log("Error:", err);
          alert("An error occurred while adding the promotion.");
        });
    }
  };

  return (
    <div>
      <InfoBanner
        text="Product promotions allow you to set special pricing for specific products during a defined time period."
      />
      <div className="centeredContainer">
        <XLButton action={openAddNewModal} text="Add New Promotion" />
      </div>
      <div className="centeredContainer">
        <LargeInput
          label="Search by MPN"
          placeholder="Search by MPN"
          value={mpnSearch}
          onChange={(e) => setMPNSearch(e.target.value)}
        />
      </div>
      <table className="mt-5">
        <thead>
          <tr>
            <th>MPN</th>
            <th>Promo Price</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {filteredSearch.map((product, i) => (
            <tr key={i}>
              <td>{product.mpn}</td>
              <td>${parseFloat(product.promo_price).toFixed(2)}</td>
              <td>{formatDisplayDate(product.start_date)}</td>
              <td>{formatDisplayDate(product.end_date)}</td>
              <td>{getStatusText(product.promo_status)}</td>
              <td>{product.promo_notes}</td>
              <td onClick={() => openEditModal(product)} className="edit">
                Edit
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Promotion"
        overlayClassName="Overlay"
        className="w-3/5 bg-slate-700 text-white rounded-lg p-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div>
          <HighlightedBanner text={`Edit Promotion: ${formData.mpn}`} centered={false} />
          
          <label className="text-white text-2xl font-bold mt-5 block" htmlFor="editPromoPrice">
            Promo Price
          </label>
          <MediumInput
            name="editPromoPrice"
            type="number"
            step="0.01"
            value={formData.promo_price}
            onChange={handleInputChange("promo_price")}
            placeholder="Promo Price"
          />
          
          <label className="text-white text-2xl font-bold mt-5 block" htmlFor="editStartDate">
            Start Date
          </label>
          <MediumInput
            name="editStartDate"
            type="date"
            value={formData.start_date}
            onChange={handleInputChange("start_date")}
          />

          <label className="text-white text-2xl font-bold mt-5 block" htmlFor="editEndDate">
            End Date
          </label>
          <MediumInput
            name="editEndDate"
            type="date"
            value={formData.end_date}
            onChange={handleInputChange("end_date")}
          />

          <label className="text-white text-2xl font-bold mt-5 block" htmlFor="editStatus">
            Status
          </label>
          <select
            name="editStatus"
            value={formData.promo_status}
            onChange={handleInputChange("promo_status")}
            className="w-full p-2 rounded bg-slate-600 text-white"
          >
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>

          <label className="text-white text-2xl font-bold mt-5 block" htmlFor="editNotes">
            Notes
          </label>
          <MediumTextarea
            name="editNotes"
            value={formData.promo_notes}
            onChange={handleInputChange("promo_notes")}
            placeholder="Promotion Notes"
          />

          <div className="mt-5 mb-1 flex gap-8">
            <LargeButton action={handleUpdate} text="Save" />
            <LargeButton action={closeModal} text="Close" color="bg-slate-600" />
          </div>
        </div>
      </Modal>

      {/* Add New Modal */}
      <Modal
        isOpen={addNewModal}
        onRequestClose={closeModal}
        contentLabel="Add New Promotion"
        className="w-3/5 bg-slate-700 text-white rounded-lg p-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        overlayClassName="Overlay"
      >
        <HighlightedBanner text="Add New Product Promotion" centered={false} />

        <label className="text-white text-2xl font-bold mt-5 block" htmlFor="mpn">
          MPN
        </label>
        <MediumInput
          name="mpn"
          placeholder="MPN"
          value={formData.mpn}
          onChange={handleInputChange("mpn")}
        />

        <label className="text-white text-2xl font-bold mt-5 block" htmlFor="promoPrice">
          Promo Price
        </label>
        <MediumInput
          name="promoPrice"
          type="number"
          step="0.01"
          placeholder="Promo Price"
          value={formData.promo_price}
          onChange={handleInputChange("promo_price")}
        />

        <label className="text-white text-2xl font-bold mt-5 block" htmlFor="startDate">
          Start Date
        </label>
        <MediumInput
          name="startDate"
          type="date"
          value={formData.start_date}
          onChange={handleInputChange("start_date")}
        />

        <label className="text-white text-2xl font-bold mt-5 block" htmlFor="endDate">
          End Date
        </label>
        <MediumInput
          name="endDate"
          type="date"
          value={formData.end_date}
          onChange={handleInputChange("end_date")}
        />

        <label className="text-white text-2xl font-bold mt-5 block" htmlFor="status">
          Status
        </label>
        <select
          name="status"
          value={formData.promo_status}
          onChange={handleInputChange("promo_status")}
          className="w-full p-2 rounded bg-slate-600 text-white"
        >
          <option value={1}>Active</option>
          <option value={0}>Inactive</option>
        </select>

        <label className="text-white text-2xl font-bold mt-5 block" htmlFor="notes">
          Notes
        </label>
        <MediumTextarea
          name="notes"
          value={formData.promo_notes}
          onChange={handleInputChange("promo_notes")}
          placeholder="Promotion Notes"
        />

        <div className="mt-5 mb-1 flex gap-8">
          <LargeButton action={handleAddNew} text="Add Promotion" />
          <LargeButton action={closeModal} text="Close" color="bg-slate-600" />
        </div>
      </Modal>
    </div>
  );
}

export default ProductPromotions;