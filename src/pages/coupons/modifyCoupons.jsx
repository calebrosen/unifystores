import axios from 'axios';
import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import { StoreContext } from '../../contexts/StoreContext';

Modal.setAppElement('#root');

function ModifyCoupons() {
  const { selectedStore } = useContext(StoreContext);
  const [coupons, setCoupons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);

  const selectCoupons = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/node/coupons/selectCoupons`, { selectedStore })
      .then(res => {
        setCoupons(res.data[0]);
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
      <div className="centeredContainer">
        <button className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 h-100 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold p-4 transition hover:scale-105" onClick={selectCoupons}>Select Coupons</button>
      </div>
      <div className="centeredContainer">
        {coupons.length > 0 ? (
          <table>
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
                  <td onClick={() => openModal(coupon)} className="edit">
                  Edit <span className="glyphicon glyphicon-edit centered"></span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-neutral-200 text-2xl">No coupons available</p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Coupon"
        shouldCloseOnOverlayClick={true}
        className="w-1/3 bg-slate-700 text-white rounded-lg p-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        overlayClassName="Overlay"
      >
        {currentCoupon && (
          <form onSubmit={handleEdit} className="block mb-2">
          <label className="text-neutral-200 text-2xl block mb-3">
              Name
              <input type="text" name="name" className="block w-100 bg-slate-800 px-2 py-2.5 text-neutral-200 rounded-lg text-neutral-200 text-2xl" value={currentCoupon.name} onChange={handleChange} />
            </label>
            <label className="text-neutral-200 text-2xl block mb-3">
              Code
              <input type="text" name="code" className="block w-100 bg-slate-800 px-2 py-2.5 text-neutral-200 rounded-lg text-neutral-200 text-2xl"  value={currentCoupon.code} onChange={handleChange} />
            </label>
            <label className="text-neutral-200 text-2xl block mb-3">
              Discount
              <input type="text" name="discount" className="block w-100 bg-slate-800 px-2 py-2.5 text-neutral-200 rounded-lg text-neutral-200 text-2xl" value={currentCoupon.discount} onChange={handleChange} />
            </label>
            <label className="text-neutral-200 text-2xl block mb-3">
              Type (F/P)
              <input type="text" name="type" className="block w-100 bg-slate-800 px-2 py-2.5 text-neutral-200 rounded-lg text-neutral-200 text-2xl"  value={currentCoupon.type} onChange={handleChange} />
            </label>
            <label className="text-neutral-200 text-2xl block mb-3">
              Starting Date
              <input type="date" name="date_start" className="block w-100 bg-slate-800 px-2 py-2.5 text-neutral-200 rounded-lg text-neutral-200 text-2xl"  value={currentCoupon.date_start} onChange={handleChange} />
            </label>
            <label className="text-neutral-200 text-2xl block mb-3">
              Ending Date
              <input type="date" name="date_end" className="block w-100 bg-slate-800 px-2 py-2.5 text-neutral-200 rounded-lg text-neutral-200 text-2xl"  value={currentCoupon.date_end} onChange={handleChange} />
            </label>
            <label className="text-neutral-200 text-2xl block mb-3">
              Total Uses
              <input type="number" name="uses_total" className="block w-100 bg-slate-800 px-2 py-2.5 text-neutral-200 rounded-lg text-neutral-200 text-2xl"  value={currentCoupon.uses_total} onChange={handleChange} />
            </label>
            <label className="text-neutral-200 text-2xl block mb-3">
              Status
              <input type="text" name="status" className="block w-100 bg-slate-800 px-2 py-2.5 text-neutral-200 rounded-lg text-neutral-200 text-2xl"  value={currentCoupon.status} onChange={handleChange} />
            </label>
            <div className="spaceBetween">
              <button type="submit" className="bg-green-600 rounded-xl p-2.5 text-neutral-200 text-3xl hover:bg-green-700">Save</button>
              <button type="button" onClick={deleteCoupon} className="bg-red-600 rounded-xl p-2.5 text-neutral-200 text-3xl hover:bg-red-700">Delete</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default ModifyCoupons;
