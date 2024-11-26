import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../contexts/StoreContext";

function SyncProducts() {
  const [productsResponse, setProductsResponse] = useState([]);
  const [productIdsToSync, setProductIdsToSync] = useState([]);
  const [mpnSearchQuery, setMpnSearchQuery] = useState("");
  const [nameSearchQuery, setNameSearchQuery] = useState("");
  const [step1, setStep1] = useState(true);
  const [step2, setStep2] = useState(false);
  const [step3, setStep3] = useState(false);
  const { selectedStore } = useContext(StoreContext);
  const [viewProductsToSync, setViewProductsToSync] = useState([]);
  const [forceSyncState, setForceSyncState] = useState({});
  const [lastMessage, setLastMessage] = useState("");

  // update checkbox state for each product
  const handleCheckboxChange = (productId) => {
    setForceSyncState((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/node/products/RefetchOCMasterTables`)
      .then(
        fetch(`${process.env.REACT_APP_API_URL}/node/products/getProductsToCopy`)
          .then((res) => res.json())
          .then((data) => setProductsResponse(data[0]))
          .catch((err) => console.log("Fetch error:", err))
      )
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

  const UpdateProductsToSyncList = (e) => {
    const productIDForList = e.currentTarget.getAttribute(
      "data-custom-product-id"
    );
    const checkedState = e.target.checked;

    if (checkedState) {
      setProductIdsToSync((prev) => [...prev, productIDForList]);
    } else {
      setProductIdsToSync((prev) =>
        prev.filter((id) => id !== productIDForList)
      );
    }
  };

  const HideStoreSelection = () => {
    const stores = document.getElementById("storesRadioInner");
    stores.style.display = "none";
  };

  const ShowStoreSelection = () => {
    const stores = document.getElementById("storesRadioInner");
    stores.style.display = "block";
  };

  const ClearSelection = () => {
    setProductIdsToSync([]);
    const allCheckboxes = document.querySelectorAll(
      "input[class='checkboxForCopyProduct']"
    );
    allCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
  };

  const ProceedToStep2 = () => {
    if (selectedStore) {
      setStep1(false);
      setStep2(true);
      HideStoreSelection();

      const tempProductIdsString = productIdsToSync.toString();
      axios
        .post(`${process.env.REACT_APP_API_URL}/node/products/getProductsForViewingCopy`, {
          tempProductIdsString,
        })
        .then((res) => {
          if (res.data) {
            console.log(res.data);
            setViewProductsToSync(res.data[0]);
          } else {
            alert("Something went wrong.");
          }
          console.log(res);
        })
        .catch((err) => alert("Error:", err));
    } else {
      alert("Select a store to sync the products to.");
    }
  };

  const ProceedToStep3 = () => {
    let confirmSync = confirm(
      "Are you POSITIVE? There is no going back. Well, there is, but it will just be a lot of work."
    );

    if (confirmSync) {
      const productList = viewProductsToSync.map((product) => ({
        product_id: product.product_id,
        model: product.model,
        mpn: product.mpn
      }));

      setLastMessage("Processing...");

      HideStoreSelection();

      // truncating table
      axios
        .post(`${process.env.REACT_APP_API_URL}/node/products/truncateSelectedProductsToCopyTable`)
        .then((res) => {
          if (
            res.data &&
            res.data[0] &&
            res.data[0][0] &&
            res.data[0][0]["success"]
          ) {
            console.log(res.data[0][0]["success"]);

            // Inserting products after truncation
            const axiosRequests = productList.map((product) => {
              const { product_id: pID, model, mpn } = product;

              if (pID && model && mpn !== undefined) {
                return axios.post(
                  `${process.env.REACT_APP_API_URL}/node/products/insertIntoSelectedProductsToCopy`,
                  { pID, model, mpn }
                );
              } else {
                alert("Something wasn't set. Check console!");
                console.log("PID: ", pID);
                console.log("model: ", model);
                console.log("mpn: ", mpn);
                return Promise.reject("Invalid product data");
              }
            });

            // Waiting for all product insertions to complete
            return Promise.all(axiosRequests);
          } else {
            console.log(
              "Unexpected response format or missing 'success' key:",
              res
            );
            alert("Something went wrong.");
            return Promise.reject("Failed to truncate table");
          }
        })
        .then(() => {
          console.log("All products inserted successfully");

          // CopyProducts_GetTargetData procedure
          return axios.post(
            `${process.env.REACT_APP_API_URL}/node/products/CopyProducts_GetTargetData`,
            {
              selectedStore,
            }
          );
        })
        .then((res) => {
          if (
            res.data &&
            res.data[0] &&
            res.data[0][0] &&
            res.data[0][0]["success"]
          ) {
            console.log(res.data[0][0]["success"]);
            console.log("successfully processed CopyProducts_GetTargetData");
            setLastMessage("successfully processed CopyProducts_GetTargetData - proceeding...");
            // CopyProducts_GetProductsToCopy procedure
            return axios.post(
              `${process.env.REACT_APP_API_URL}/node/products/CopyProducts_GetProductsToCopy`
            );
          } else {
            console.log(
              "Unexpected response format or missing 'success' key:",
              res
            );
            alert("Something went wrong.");
            return Promise.reject(
              "Failed to process CopyProducts_GetTargetData"
            );
          }
        })
        .then((res) => {
          if (
            res.data &&
            res.data[0] &&
            res.data[0][0] &&
            res.data[0][0]["success"]
          ) {
            console.log(res.data[0][0]["success"]);
            console.log(
              "successfully processed CopyProducts_GetProductsToCopy"
            );
            setLastMessage("successfully processed CopyProducts_GetProductsToCopy - proceeding...");

            // CopyProducts_CopyProductsToStore procedure
            return axios.post(
              `${process.env.REACT_APP_API_URL}/node/products/CopyProducts_CopyProductsToStore`,
              { selectedStore }
            );
          } else {
            console.log(
              "Unexpected response format or missing 'success' key:",
              res
            );
            alert("Something went wrong.");
            return Promise.reject(
              "Failed to process CopyProducts_GetProductsToCopy"
            );
          }
        })
        .then((res) => {
          if (
            res.data &&
            res.data[0] &&
            res.data[0][0] &&
            res.data[0][0]["success"]
          ) {
            console.log(res.data[0][0]["success"]);
            console.log(
              "successfully processed CopyProducts_CopyProductsToStore"
            );
            setLastMessage("successfully processed CopyProducts_CopyProductsToStore - proceeding...");
            CopyImagesToStore();
            setLastMessage("Completed. Copying images now...");
            setStep2(false);
            setStep3(true);
          } else {
            console.log(
              "Unexpected response format or missing 'success' key:",
              res
            );
            alert("Something went wrong.");
            return Promise.reject(
              "Failed to process CopyProducts_CopyProductsToStore"
            );
          }
        })
        .catch((err) => {
          console.log("Error:", err);
          alert("An error occurred during the process.");
        });
    }
  };


  const CopyImagesToStore = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/node/products/CopyProducts_CopyImagesToStore`)
      .then((res) => {
        if (res.data && res.data[0]) {
          let images = res.data[0];
          let successCount = 0;
          let failureCount = 0;
  
          images.forEach((i) => {
            let imagePath = i.image;
            axios
              .post(
                `${process.env.REACT_APP_API_URL}/node/products/CopyProducts_CopyImagesToStore_Action`,
                { selectedStore, imagePath }
              )
              .then((res) => {
                if (res.status === 200) {
                  successCount++;
                  console.log(`Image ${imagePath} moved successfully.`);
                } else {
                  failureCount++;
                  console.log(`Failed to move image ${imagePath}.`);
                }
  
                // if all images are processed
                if (successCount + failureCount === images.length) {
                  if (successCount === images.length) {
                    alert("All images copied successfully!");
                    setLastMessage('All images copied successfully!');
                  } else {
                    alert(
                      `Completed with some errors. ${successCount} images copied successfully, ${failureCount} failed.`
                    );
                  }
                }
              })
              .catch((err) => {
                failureCount++;
                console.log(`Error when moving image ${imagePath}:`, err);
  
                // if all images are processed, regardless of success/failure
                if (successCount + failureCount === images.length) {
                  alert(
                    `Completed with errors. ${successCount} images copied successfully, ${failureCount} failed.`
                  );
                }
              });
          });
        } else {
          alert("Something went wrong, no images found.");
          console.log("Error in copying images response: ", res);
        }
      })
      .catch((err) => alert("Error when copying images:", err));
  };
  
  const RefetchAllProducts = () => {
    const confirmRefetch = confirm('Are you sure you want to refetch all of the products?');
    if (confirmRefetch) {
      fetch(`${process.env.REACT_APP_API_URL}/node/products/RefetchOCMasterTables`)
      .then((res) => res.json())
      .then((data) => alert('Refetched products.'))
      .then((data) => refresh())
      .catch((err) => console.log("Fetch error:", err));
    }
  }

  function refresh() {
    location.reload();
  }

  const GoBackOneStep = () => {
    setLastMessage('');
    if (step2) {
      setStep2(false);
      setStep3(false);
      setStep1(true);
      ShowStoreSelection();
    } else if (step3) {
      setStep3(false);
      setStep1(false);
      setStep2(true);
    }
  };

  useEffect(() => {
    if (step1) {
      GoBackToStepOne();
    }
  }, [step1]);

  // re-checking the checkboxes when going back to step one
  const GoBackToStepOne = () => {
    const allCheckboxes = document.querySelectorAll(
      "input[class='checkboxForCopyProduct']"
    );
    if (allCheckboxes) {
      allCheckboxes.forEach((checkbox) => {
        let id = checkbox.getAttribute("data-custom-product-id");
        if (productIdsToSync.includes(id)) {
          checkbox.checked = true;
        }
      });
    }
  };

  if (step1) {
    return (
      <div>
        <div className="centered">
          <p className="xlHeader marginTop3rem">
            SELECT WHICH PRODUCTS TO SYNC
          </p>
          <div>
            <button className='darkRedButtonInlineMD' onClick={RefetchAllProducts} style={{margin: "1rem 0 2rem 0"}}>Refetch products
            </button>
          </div>
          {productIdsToSync && productIdsToSync.length > 0 && (
            <div>
              <span style={{ fontSize: "24px" }}>Product ID's selected: </span>
              {productIdsToSync.map((d, i) => (
                <span key={i} style={{ fontSize: "20px" }}>
                  {d}&nbsp;
                </span>
              ))}
              <div>
                <button
                  className="saveButtonLG marginTop2rem"
                  onClick={ProceedToStep2}
                >
                  Proceed
                </button>
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
                <th>Sync</th>
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
                      onClick={UpdateProductsToSyncList}
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
  } else if (step2) {
    return (
      <div>
        <div className="goBack">
          <button className="GoBackButton" onClick={GoBackOneStep}>
            Go Back
          </button>
        </div>
        <div className="xlHeader">
          Are you SURE these are the correct product(s) to sync to{" "}
          {selectedStore}?
        </div>
        <table className="marginTop3rem">
          <thead>
            <tr>
              <th>ID</th>
              <th>Model</th>
              <th>MPN</th>
              <th>Name</th>
              <th>Status</th>
              <th>Date Added</th>
            </tr>
          </thead>
          <tbody>
            {viewProductsToSync.map((d, i) => (
              <tr key={i}>
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
        <button
          className="correctProductsConfirmButton"
          onClick={ProceedToStep3}
        >
          YES! These are the correct products.
        </button>
        <div className="lastMessageCopy">{lastMessage}</div>
      </div>
    );
  } else if (step3) {
    return (
      <div>
        <div className="goBack">
          <button className="GoBackButton" onClick={GoBackOneStep}>
            Go Back
          </button>
        </div>
        <div className="lastMessageCopy">{lastMessage}</div>
      </div>
    );
  }
}

export default SyncProducts;
