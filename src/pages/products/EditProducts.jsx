import axios from "axios";
import React, { useState } from "react";
import Modal from "react-modal";

function EditProducts() {
  const [searchMPN, setSearchMPN] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [foundProducts, setFoundProducts] = useState([]);
  const [selectedMPN, setSelectedMPN] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedProductID, setSelectedProductID] = useState("");
  const [selectedStoreProduct, setSelectedStoreProduct] = useState("");
  const [selectedProductName, setSelectedProductName] = useState("");

  const handleMPNChange = (e) => {
    setSearchMPN(e.target.value);
  };

  const handleNameChange = (e) => {
    setSearchName(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSearchStatus(e.target.value);
  };

  const openModal = (e) => {
    setSelectedMPN(e.target.getAttribute("data-custom-mpn"));
    setSelectedModel(e.target.getAttribute("data-custom-model"));
    setSelectedQuantity(e.target.getAttribute("data-custom-quantity"));
    setSelectedProductID(e.target.getAttribute("data-custom-product-id"));
    setSelectedProductName(e.target.getAttribute("data-custom-name"));
    setSelectedStoreProduct(e.target.getAttribute("data-custom-store"));
    setSelectedStatus(e.target.getAttribute("data-custom-status"));
    checkForProductOnStores(selectedProductID, selectedMPN, selectedProductName);
    setIsOpen(true);
  };

  const checkForProductOnStores = (productID, mpn, name) => {
    /*axios
    .post("http://127.0.0.1:8081/getSpecificProduct", {
      mpn,
      name,
    })
    .then((res) => {
      if (res.data[0]) {
        setFoundProducts(res.data[0]);
      }
    })
    .catch((err) => console.error("Error:", err));*/
  }

  const closeModal = () => {
    setIsOpen(false);
  };

  const searchForProduct = (e) => {
    axios
      .post("http://127.0.0.1:8081/searchProducts", {
        searchMPN,
        searchName,
        searchStatus,
      })
      .then((res) => {
        if (res.data[0]) {
          setFoundProducts(res.data[0]);
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  const ModalPopup = () => {
    return (
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <div>
          <h1>Product Name</h1>
          <input
            defaultValue={selectedProductName}
            className="inputBox3"
          ></input>

          <h3>Model</h3>
          <input defaultValue={selectedModel} className="inputBox4"></input>
          <h3>MPN</h3>
          <input defaultValue={selectedMPN} className="inputBox4"></input>
          {/* <h3>Quantity</h3>
          <input defaultValue={selectedQuantity} className="inputBox4" type='Number'></input>
          <h3>Status</h3>
          <select defaultValue={selectedStatus} className="selectBox1">
            <option value='0'>0</option>
            <option value='1'>1</option>
          </select> */}
        </div>
      </Modal>
    );
  };

  const EditTable = () => {
    return (
      <table className="marginTop3rem">
        <thead>
          <tr>
            <th>Store</th>
            <th>Model</th>
            <th>MPN</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Name</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {foundProducts.map((d, i) => (
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
                  data-custom-quantity={d.quantity}
                  data-custom-product-id={d.product_id}
                  data-custom-status={d.status}
                  data-custom-name={d.name}
                  data-custom-store={d.store_id}
                  className="darkRedButtonInlineMD"
                  onClick={openModal}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  return (
    <div>
      <div className="searchGroup">
        <div>
          <label className="labelInputBox2">
            <span className="spaceAroundSpan">MPN:</span>
            <input className="inputBox2" onChange={handleMPNChange}></input>
          </label>
          <label className="labelInputBox2">
            <span className="spaceAroundSpan">Name: </span>
            <input className="inputBox2" onChange={handleNameChange}></input>
          </label>
          <label className="labelInputBox2">
            <span className="spaceAroundSpan">Status: </span>
            <select className="inputBox2" onChange={handleStatusChange}>
              <option value=""></option>
              <option value="0">0</option>
              <option value="1">1</option>
            </select>
          </label>
        </div>
        <button
          className="editPreviewButton marginTop3rem"
          onClick={searchForProduct}
        >
          Search for Products
        </button>
      </div>
      <EditTable />
      <ModalPopup />
    </div>
  );
}

export default EditProducts;
