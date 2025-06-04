import axios from 'axios';
import { useContext, useState } from 'react';
import Modal from 'react-modal';
import HighlightedBanner from "../../components/banners/HighlightedBanner";
import LargeButton from '../../components/buttons/LargeButton';
import MediumButton from '../../components/buttons/MediumButton';
import SmallInput from '../../components/inputs/SmallInput';
import { StoreContext } from '../../contexts/StoreContext';

Modal.setAppElement('#root');

function ModifyCoupons() {
  const { selectedStore } = useContext(StoreContext);
  const [coupons, setCoupons] = useState([]);
  const [searched, setSearched] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);

  const selectCoupons = () => {
    if (selectedStore === '') {
      alert('Please select a store first');
      return;
    }
    axios.post(`${process.env.REACT_APP_API_URL}/node/coupons/selectCoupons`, { selectedStore })
      .then(res => {
        setCoupons(res.data[0]);
        setSearched(true);
      })
      .catch(err => console.log('Error:', err));
  };

  const openModal = (coupon) => {
    // filling date fields
    let tmpCoupon = {...coupon};
    tmpCoupon.date_start = SQLToJSDate(coupon.date_start);
    tmpCoupon.date_end = SQLToJSDate(coupon.date_end);
  
    setCurrentCoupon(tmpCoupon);
    setIsModalOpen(true);
  };

  const SQLToJSDate = (sqlDate) => {
    return new Date(sqlDate).toISOString().substring(0, 10);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCoupon(null);
  };

  const handleEdit = (e) => {
    const confirmUpdate = confirm("Are you sure you want to update this coupon?");
    if (confirmUpdate) {
      e.preventDefault();
      const payload = { ...currentCoupon, selectedStore };
      axios.post(`${process.env.REACT_APP_API_URL}/node/coupons/updateCoupon`, payload)
        .then(res => {
          console.log(res);
          closeModal();
          selectCoupons();
          if (res.data.sqlMessage) {
            alert(res.data.sqlMessage);
          } else { alert('Coupon updated.')}
        })
        .catch(err => console.log('Error:', err));
    }
  };

  const deleteCoupon = (e) => {
    const confirmDelete = confirm("Are you sure you want to delete this coupon?");
    if (confirmDelete) {
      e.preventDefault();
      const payload = { ...currentCoupon, selectedStore };
      axios.post(`${process.env.REACT_APP_API_URL}/node/coupons/deleteCoupon`, payload)
        .then(res => {
          console.log(res);
          closeModal();
          selectCoupons();
          if (res.data.sqlMessage) {
            alert(res.data.sqlMessage);
          } else { alert('Coupon deleted.')}
        })
        .catch(err => console.log('Error:', err));
    }
  }

  const handleChange = (e) => {
    setCurrentCoupon({ ...currentCoupon, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center mb-4">
        <LargeButton
          action={selectCoupons}
          text={"Select Coupons"}
        />
        {coupons.length > 0 ? (
          <table className="mt-14">
            <thead>
              <tr>
                <th>Date Added</th>
                <th>Name</th>
                <th>Code</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Starting Date</th>
                <th>Ending Date</th>
                <th>Total Uses</th>
                <th>Status</th>
                <th>Modify</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon, index) => (
                <tr key={coupon.id || index}>
                  <td>{coupon.date_added}</td>
                  <td>{coupon.name}</td>
                  <td>{coupon.code}</td>
                  <td>{coupon.discount}</td>
                  <td>{coupon.type}</td>
                  <td>{coupon.date_start}</td>
                  <td>{coupon.date_end}</td>
                  <td>{coupon.uses_total}</td>
                  <td>{coupon.status}</td>
                  <td>
                    <MediumButton
                      text={"Edit"}
                      action={() => openModal(coupon)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          searched &&
          <div className="text-neutral-200 text-3xl mt-8">No coupons found.</div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Coupon"
        shouldCloseOnOverlayClick={true}
        className="w-max bg-slate-700 text-white rounded-lg p-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        overlayClassName="Overlay"
      >
        {currentCoupon && (
          <form onSubmit={handleEdit} className="block mb-2">
          <HighlightedBanner text={`Edit Coupon: ${currentCoupon.name}`} size={"text-4xl !pt-3.5"}/>
            <label className="text-neutral-200 text-2xl block mt-4" htmlFor="name">
                Name
            </label>
            <div className="mt-1 mb-3">
              <SmallInput
                name={"name"}
                value={currentCoupon.name}
                onChange={handleChange}
                placeholder={"Name"}
              />
            </div>

            <label className="text-neutral-200 text-2xl block" htmlFor="code">
              Code
            </label>
            <div className="mt-1 mb-3">
              <SmallInput
                name={"code"}
                value={currentCoupon.code}
                onChange={handleChange}
                placeholder={"Code"}
              />
            </div>

            <label className="text-neutral-200 text-2xl block" htmlFor="discount">
              Discount
            </label>
            <div className="mt-1 mb-3">
              <SmallInput
                name={"discount"}
                value={currentCoupon.discount}
                onChange={handleChange}
                placeholder={"Discount"}
              />
            </div>

            <label className="text-neutral-200 text-2xl block" htmlFor="type">
              Type (F/P)
            </label>
            <div className="mt-1 mb-3">
              <SmallInput
                name={"type"}
                value={currentCoupon.type}
                onChange={handleChange}
                placeholder={"Type"}
              />
            </div>

            <label className="text-neutral-200 text-2xl block" htmlFor="date_start">
              Starting Date
            </label>
            <div className="mt-1 mb-3">
              <SmallInput
                name={"date_start"}
                value={currentCoupon.date_start}
                onChange={handleChange}
                placeholder={"Starting Date"}
                type="date"
              />
            </div>

            <label className="text-neutral-200 text-2xl block" htmlFor="date_end">
              Ending Date
            </label>
            <div className="mt-1 mb-3">
              <SmallInput
                name={"date_end"}
                value={currentCoupon.date_end}
                onChange={handleChange}
                placeholder={"Ending Date"}
                type="date"
              />
            </div>

            <label className="text-neutral-200 text-2xl block" htmlFor="uses_total">
              Total Uses
            </label>
            <div className="mt-1 mb-3">
              <SmallInput
                name={"uses_total"}
                value={currentCoupon.uses_total}
                onChange={handleChange}
                placeholder={"Total Uses"}
                type="number"
              />
            </div>

            <label className="text-neutral-200 text-2xl block" htmlFor="status">
              Status
            </label>
            <div className="mt-1 mb-3">
              <SmallInput
                name={"status"}
                value={currentCoupon.status}
                onChange={handleChange}
                placeholder={"Status"}

              />
            </div>

            <div className="flex flex-row gap-6">
              <MediumButton
                text={"Save"}
                type="submit"
              />
              <MediumButton
                action={deleteCoupon}
                text={"Delete"}
                color="bg-slate-800"
              />
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default ModifyCoupons;
