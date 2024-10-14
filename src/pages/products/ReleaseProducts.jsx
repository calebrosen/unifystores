import axios from 'axios';
import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import { StoreContext } from '../../contexts/StoreContext';

Modal.setAppElement('#root');

function ReleaseProducts() {
    const [data, setData] = useState([]);
    const [mpnSearchQuery, setMpnSearchQuery] = useState('');
    const [nameSearchQuery, setNameSearchQuery] = useState('');
    const { selectedStore } = useContext(StoreContext);
    const [filteredStatus, setFilteredStatus] = useState('2');
    const [productID, setProductID] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [releaseQuantity, setReleaseQuantity] = useState('0');
    const [selectedProductName, setSelectedProductName] = useState('');
    const [selectedMPN, setSelectedMPN] = useState('');
     
    
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleMPNSearch = (e) => {
      setMpnSearchQuery(e.target.value);
    };

    const handleNameSearch = (e) => {
      setNameSearchQuery(e.target.value);
    };
    
    const handleStatusChange = (e) => {
      setFilteredStatus(e.target.value);
    };
  
    const filteredProducts = data.filter((d) =>
      d.mpn && d.mpn.toLowerCase().includes(mpnSearchQuery.toLowerCase()) &&
      d.name && d.name.toLowerCase().includes(nameSearchQuery.toLowerCase()) &&
      (filteredStatus === '2' || d.status.toString() === filteredStatus)
    );

    const fetchContent = () => {
      if (selectedStore) {
        axios.post(`${process.env.REACT_APP_API_URL}/node/products/getProductsForRelease`, { selectedStore })
          .then(res => {
            if (res.data[0]) {
              setData(res.data[0]);
            }
          })
          .catch(err => console.error('Error:', err));
      } else {
        alert('select a store');
      }
    }

    const releaseProduct = (e) => {
      setProductID(e.target.id);
      setSelectedProductName(e.target.getAttribute('data-custom-name'));
      setSelectedMPN(e.target.getAttribute('data-custom-mpn'));
      setIsModalOpen(true);
    }

    const releaseProductAction = (e) => {
      e.preventDefault();
      const confirmRelease = confirm(`Are you sure you want to release ${releaseQuantity} of ${selectedProductName} (${selectedMPN}) on ${selectedStore}?`);
      if (confirmRelease) {
          axios.post(`${process.env.REACT_APP_API_URL}/node/products/releaseProductOnStore`, { selectedStore, releaseQuantity, productID, selectedMPN })
          .then(res => {
            if (res.data[0][0]['success']) {
              alert(res.data[0][0]['success']);
            } else {
              alert("Something went wrong.");
            }
            console.log(res);
          })
          .catch(err => console.error('Error saving description:', err));
      }
    }
  
    return (
      <div>
        <div className='centered marginTop3rem'>
          <button className='darkRedButton' onClick={fetchContent}>Fetch Products</button>
        </div>
        <div className='centeredContainer marginBottom4rem'>
          <input
            className='marginTop3rem inputBox1'
            label='Search by MPN'
            placeholder='Search by MPN'
            value={mpnSearchQuery}
            onChange={handleMPNSearch}
          />
          <select className='selectBox1' onChange={handleStatusChange}>
            <option value='2'>Status</option>
            <option value='0'>0</option>
            <option value='1'>1</option>
          </select>

          <input
            className='marginTop3rem inputBox1'
            label='Search by Name'
            placeholder='Search by Name'
            value={nameSearchQuery}
            onChange={handleNameSearch}
          />
        </div>
        <table className='marginTop3rem'>
          <thead>
            <tr>
              <th>Store</th>
              <th>Model</th>
              <th>MPN</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Name</th>
              <th>Release</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((d, i) => (
              <tr key={i}>
                <td>{d.store_id}</td>
                <td>{d.model}</td>
                <td>{d.mpn}</td>
                <td>{d.quantity}</td>
                <td>{d.status}</td>
                <td>{d.name}</td>
                <td>
                  <button 
                    data-custom-model={d.model}
                    data-custom-mpn={d.mpn}
                    id={d.product_id}
                    className='darkRedButtonInlineMD'
                    data-custom-name={d.name}
                    onClick={releaseProduct}
                   >
                  Release
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Release Product"
          className="Modal"
          overlayClassName="Overlay"
        >
            {productID && (
            <form onSubmit={releaseProductAction}>
                <p className='mediumHeader'>Release Product</p>
                <input
                  className='marginTop3rem inputBox1'
                  label='Amount to release'
                  placeholder='Amount to release'
                  type='Number'
                  onChange={(e) => setReleaseQuantity(e.target.value)}
                />
                <div className="spaceBetween">
                  <button type="submit" className='saveButton'>Save</button>
                  <button type="button" onClick={closeModal} className='closeButton'>Close</button>
                </div>
            </form>
            )}
        </Modal>
      </div>
    );
  }
  
export default ReleaseProducts;
