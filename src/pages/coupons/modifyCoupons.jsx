import axios from 'axios';
import { useContext, useState } from 'react';
import Modal from 'react-modal';
import { StoreContext } from '../../contexts/StoreContext';
import ModifyCouponsTable from '../../components/coupons/ModifyCouponsTable';

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
    <ModifyCouponsTable
      coupons={coupons}
      searched={searched}
      selectCoupons={selectCoupons}
      openModal={openModal}
      isModalOpen={isModalOpen}
      closeModal={closeModal}
      currentCoupon={currentCoupon}
      handleEdit={handleEdit}
      handleChange={handleChange}
      deleteCoupon={deleteCoupon}
    />
  );
}

export default ModifyCoupons;
