import axios from "axios";
import React, { useState } from "react";


function EditProducts() {

    const [searchMPN, setSearchMPN] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const [foundProducts, setFoundProducts] = useState([]);

    const handleMPNChange = (e) => {
        setSearchMPN(e.target.value);
    }

    const handleNameChange = (e) => {
        setSearchName(e.target.value);
    }
    
    const handleStatusChange = (e) => {
        setSearchStatus(e.target.value);
    }

    const searchForProduct = (e) => {
        axios.post('http://127.0.0.1:8081/searchProducts', { searchMPN, searchName, searchStatus })
          .then(res => {
            if (res.data[0]) {
                setFoundProducts(res.data[0]);
            }
          })
          .catch(err => console.error('Error:', err));
    }
 
    const EditTable = () => {

        return (
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
                    id={d.product_id}
                    className='darkRedButtonInlineMD'
                    data-custom-name={d.name}
                   >
                  Release
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        )
    }
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
                <option value=''></option>
                <option value='0'>0</option>
                <option value='1'>1</option>
            </select>
          </label>
        </div>
        <button className="editPreviewButton marginTop3rem" onClick={searchForProduct}>Search for Products</button>
      </div>
        <EditTable />
    </div>
  );
}

export default EditProducts;
