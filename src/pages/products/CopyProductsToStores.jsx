import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from '../../contexts/StoreContext';

function CopyProductsToStores() {
  const [productsResponse, setProductsResponse] = useState([]);
  const [productIdsToCopy, setProductIdsToCopy] = useState([]);
  const [mpnSearchQuery, setMpnSearchQuery] = useState("");
  const [nameSearchQuery, setNameSearchQuery] = useState("");
  const [step1, setStep1] = useState(true);
  const [step2, setStep2] = useState(false);
  const [step3, setStep3] = useState(false);
  const { selectedStore } = useContext(StoreContext);
  const [viewProductsToCopy, setViewProductsToCopy] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8081/getProductsToCopy")
      .then((res) => res.json())
      .then((data) => setProductsResponse(data[0]))
      .catch((err) => console.log("Fetch error:", err));
  }, []);

  const handleMPNSearch = (e) => {
    setMpnSearchQuery(e.target.value);
  };

  const handleNameSearch = (e) => {
    setNameSearchQuery(e.target.value);
  };

  const filteredProducts = productsResponse.filter(
    (d) =>
      d.MPN &&
      d.MPN.toLowerCase().includes(mpnSearchQuery.toLowerCase()) &&
      d.Name &&
      d.Name.toLowerCase().includes(nameSearchQuery.toLowerCase())
  );

  const UpdateProductsToCopyList = (e) => {
    const productIDForList = e.currentTarget.getAttribute(
      "data-custom-product-id"
    );
    const checkedState = e.target.checked;

    if (checkedState) {
      setProductIdsToCopy((prev) => [...prev, productIDForList]);
    } else {
      setProductIdsToCopy((prev) =>
        prev.filter((id) => id !== productIDForList)
      );
    }
  };

  const ClearSelection = () => {
    setProductIdsToCopy([]);
    const allCheckboxes = document.querySelectorAll("input[class='checkboxForCopyProduct']");
    allCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    })
  };

  const ProceedToStep2 = () => {
    setStep1(false);
    setStep2(true);
    console.log(productIdsToCopy);
    const tempProductIdsString = productIdsToCopy.toString();
    axios.post('http://127.0.0.1:8081/getProductsForViewingCopy', { tempProductIdsString })
        .then(res => {
            if (res.data) {
              console.log(res.data);
              setProductIdsToCopy(res.data[0]);
            } else {
              alert("Something went wrong.");
            }
            console.log(res);
        })
        .catch(err => alert('Error:', err));
  }


  const GoBackOneStep = () => {
    if (step2) {
      setStep2(false);
      setStep1(true);
    } else if (step3) {
      setStep3(false);
      setStep2(true);
    }

    //doing delay here because page doesnt load for a while
    setTimeout(() => {
      const allCheckboxes = document.querySelectorAll("input[class='checkboxForCopyProduct']");
      allCheckboxes.forEach((checkbox) => {
        let id = checkbox.getAttribute('data-custom-product-id');
        if (productIdsToCopy.includes(id)) {
          checkbox.checked = true;
        }
      });
    }, 10000);
    
  }

  if (step1) {
  return (
      <div>
        <div className="centered">
          <p className="xlHeader marginTop3rem">SELECT WHICH PRODUCTS TO COPY</p>
          {productIdsToCopy && productIdsToCopy.length > 0 && (
            <div>
              <span style={{ fontSize: "24px" }}>Product ID's selected: </span>
              {productIdsToCopy.map((d, i) => (
                <span key={i} style={{ fontSize: "20px" }}>
                  {d}&nbsp;
                </span>
              ))}
              <div>
                <button className="saveButtonLG marginTop2rem" onClick={ProceedToStep2}>Proceed</button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button
                  className="deleteButtonLG marginTop2rem"
                  onClick={ClearSelection}
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="centeredContainer">
          <input
            className="marginTop3rem inputBox1"
            label="Search by Name"
            placeholder="Search by Name"
            value={nameSearchQuery}
            onChange={handleNameSearch}
          />
          <input
            className="marginTop3rem inputBox1"
            label="Search by MPN"
            placeholder="Search by MPN"
            value={mpnSearchQuery}
            onChange={handleMPNSearch}
          />
        </div>
        <div id="productsContainer" className="subsectionContainer">
          <table className="marginTop3rem">
            <thead>
              <tr>
                <th>Copy</th>
                <th>ID</th>
                <th>Model</th>
                <th>MPN</th>
                <th>Manufacturer</th>
                <th>Name</th>
                <th>Status</th>
                <th>Date Added</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((d, i) => (
                <tr key={i}>
                  <td>
                    &nbsp;&nbsp;&nbsp;{" "}
                    <input
                      type="checkbox"
                      className="checkboxForCopyProduct"
                      data-custom-product-id={d.ProductID}
                      onClick={UpdateProductsToCopyList}
                    ></input>
                  </td>
                  <td>{d.ProductID}</td>
                  <td>{d.Model}</td>
                  <td>{d.MPN}</td>
                  <td>{d.Manufacturer}</td>
                  <td>{d.Name}</td>
                  <td>{d.Status}</td>
                  <td>{d.DateAdded}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  else if (step2) {
    return (
      <div>
        <div className='goBack'>
          <button className='GoBackButton' onClick={GoBackOneStep}>Go Back</button>
        </div>
        <div className='xlHeader'>Are you SURE these are the correct products?</div>
        <table className="marginTop3rem">
            <thead>
              <tr>
                <th>Force Copy</th>
                <th>ID</th>
                <th>Model</th>
                <th>MPN</th>
                <th>Name</th>
                <th>Status</th>
                <th>Date Added</th>
              </tr>
            </thead>
            <tbody>
              {productIdsToCopy.map((d, i) => (
                <tr key={i}>
                  <td>
                    &nbsp;&nbsp;&nbsp;{" "}
                    <input
                      type="checkbox"
                      className="checkboxForCopyProduct"
                      data-custom-product-id={d.product_id}
                    ></input>
                  </td>
                  <td>{d.product_id}</td>
                  <td>{d.model}</td>
                  <td>{d.mpn}</td>
                  <td>{d.name}</td>
                  <td>{d.status}</td>
                  <td>{d.date_added}</td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    )
  }
  else if (step3) {
    return;
  }
}

export default CopyProductsToStores;
