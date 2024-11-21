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
    coupon.date_start = SQLToJSDate(coupon.date_start);
    coupon.date_end = SQLToJSDate(coupon.date_end);
  
    setCurrentCoupon(coupon);
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
        <button className='darkRedButton' onClick={selectCoupons}>Select Coupons</button>
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
          <p>No coupons available</p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Coupon"
        className="Modal"
        overlayClassName="Overlay"
      >
        {currentCoupon && (
          <form onSubmit={handleEdit} className="editCouponForm">
            <label>
              Name:&nbsp;
              <input type="text" name="name" value={currentCoupon.name} onChange={handleChange} />
            </label>
            <label>
              Code:&nbsp;
              <input type="text" name="code" value={currentCoupon.code} onChange={handleChange} />
            </label>
            <label>
              Discount:&nbsp;
              <input type="text" name="discount" value={currentCoupon.discount} onChange={handleChange} />
            </label>
            <label>
              Type (F/P):&nbsp;
              <input type="text" name="type" value={currentCoupon.type} onChange={handleChange} />
            </label>
            <label>
              Starting Date:&nbsp;
              <input type="date" name="date_start" value={currentCoupon.date_start} onChange={handleChange} />
            </label>
            <label>
              Ending Date:&nbsp;
              <input type="date" name="date_end" value={currentCoupon.date_end} onChange={handleChange} />
            </label>
            <label>
              Total Uses:&nbsp;
              <input type="number" name="uses_total" value={currentCoupon.uses_total} onChange={handleChange} />
            </label>
            <label>
              Status:&nbsp;
              <input type="text" name="status" value={currentCoupon.status} onChange={handleChange} />
            </label>
            <div className="spaceBetween">
              <button type="submit" className='saveButton'>Save</button>
              <button type="button" onClick={closeModal} className='closeButton'>Close</button>
              <button type="button" onClick={deleteCoupon} className='deleteButton'>Delete</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default ModifyCoupons;
