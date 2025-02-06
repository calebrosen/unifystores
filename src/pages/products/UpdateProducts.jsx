import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../contexts/StoreContext";

function UpdateProducts() {
  const [productsResponse, setProductsResponse] = useState([]);
  const [productIdsToUpdate, setProductIdsToUpdate] = useState([]);
  const [mpnSearchQuery, setMpnSearchQuery] = useState("");
  const [nameSearchQuery, setNameSearchQuery] = useState("");
  const [step1, setStep1] = useState(true);
  const [step2, setStep2] = useState(false);
  const [step3, setStep3] = useState(false);
  const { selectedStore } = useContext(StoreContext);
  const [viewProductsToUpdate, setViewProductsToUpdate] = useState([]);
  const [lastMessage, setLastMessage] = useState("");

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

  const UpdateProductsToUpdateList = (e) => {
    const productIDForList = e.currentTarget.getAttribute(
      "data-custom-product-id"
    );
    const checkedState = e.target.checked;

    if (checkedState) {
      setProductIdsToUpdate((prev) => [...prev, productIDForList]);
    } else {
      setProductIdsToUpdate((prev) =>
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
    setProductIdsToUpdate([]);
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

      const tempProductIdsString = productIdsToUpdate.toString();
      axios
        .post(`${process.env.REACT_APP_API_URL}/node/products/getProductsForViewingCopy`, {
          tempProductIdsString,
        })
        .then((res) => {
          if (res.data) {
            console.log(res.data);
            setViewProductsToUpdate(res.data[0]);
          } else {
            alert("Something went wrong.");
          }
          console.log(res);
        })
        .catch((err) => alert("Error:", err));
    } else {
      alert("Select a store to update the products to.");
    }
  };

  const ProceedToStep3 = () => {
    let confirmUpdate = confirm(
      "Are you POSITIVE? There is no going back. Well, there is, but it will just be a lot of work."
    );

    if (confirmUpdate) {
      const productList = viewProductsToUpdate.map((product) => ({
        product_id: product.product_id,
        model: product.model,
        mpn: product.mpn
      }));

      setLastMessage("Processing...");

      HideStoreSelection();

      // truncating table
      axios
        .post(`${process.env.REACT_APP_API_URL}/node/products/truncateSelectedProductsToUpdateTable`)
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
                  `${process.env.REACT_APP_API_URL}/node/products/insertIntoSelectedProductsToUpdate`,
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
          setLastMessage("All products inserted successfully - proceeding...");
          console.log("All products inserted successfully");

          // CopyProducts_GetTargetData procedure - this is the same one as the copy products one because we need the same target data regardless
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
        if (productIdsToUpdate.includes(id)) {
          checkbox.checked = true;
        }
      });
    }
  };

  if (step1) {
    return (
      <div>
        <div className="centered">
          <p className="text-6xl underline bold text-neutral-200 mt-20">
            SELECT WHICH PRODUCTS TO UPDATE
          </p>
          {productIdsToUpdate && productIdsToUpdate.length > 0 && (
            <div className="mt-4">
              <span className="text-4xl text-neutral-200">Product ID's selected: </span>
              {productIdsToUpdate.map((d, i) => (
                <span key={i} className="text-4xl text-neutral-200">
                  {d}&nbsp;
                </span>
              ))}
              <div className="mt-10">
                <button
                  className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold p-3 mb-2 transition hover:scale-105"
                  onClick={ProceedToStep2}
                >
                  Proceed
                </button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button
                  className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold p-3 mb-2 transition hover:scale-105"
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
            className="bg-slate-800 px-2 py-3 m-0 text-neutral-200 placeholder:text-neutral-300 rounded-lg text-neutral-200 active:text-neutral-200 text-4xl border-1 border-slate-700"
            label="Search by Name"
            placeholder="Search by Name"
            value={nameSearchQuery}
            onChange={handleNameSearch}
          />
          <input
            className="bg-slate-800 px-2 py-3 m-0 text-neutral-200 placeholder:text-neutral-300 rounded-lg text-neutral-200 active:text-neutral-200 text-4xl border-1 border-slate-700"
            label="Search by MPN"
            placeholder="Search by MPN"
            value={mpnSearchQuery}
            onChange={handleMPNSearch}
          />
        </div>
        <div id="productsContainer" className="text-center">
          <table className="mt-5">
            <thead>
              <tr>
                <th>Update</th>
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
                      onClick={UpdateProductsToUpdateList}
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
          <button className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold p-3 mb-2 transition hover:scale-105" onClick={GoBackOneStep}>
            Go Back
          </button>
        </div>
        <div className="text-neutral-200 text-6xl mt-3 font-bold underline">
          Are you SURE these are the correct product(s) to update to{" "}
          {selectedStore}?
        </div>
        <table className="mt-5">
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
            {viewProductsToUpdate.map((d, i) => (
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
          className="text-neutral-200 mt-5 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold p-3 mb-2 transition hover:scale-105"
          onClick={ProceedToStep3}
        >
          YES! These are the correct products.
        </button>
        <div className="my-5 font-3xl text-neutral-200">{lastMessage}</div>
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
        <div className="my-5 font-3xl text-neutral-200">{lastMessage}</div>
      </div>
    );
  }
}

export default UpdateProducts;
