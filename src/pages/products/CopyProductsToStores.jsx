import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { StoreContext } from "../../contexts/StoreContext";

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
  const [forceCopyState, setForceCopyState] = useState({});
  const [lastMessage, setLastMessage] = useState("");

  // update checkbox state for each product
  const handleCheckboxChange = (productId) => {
    setForceCopyState((prevState) => ({
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

  const HideStoreSelection = () => {
    const stores = document.getElementById("storesRadioInner");
    stores.style.display = "none";
  };

  const ShowStoreSelection = () => {
    const stores = document.getElementById("storesRadioInner");
    stores.style.display = "block";
  };

  const ClearSelection = () => {
    setProductIdsToCopy([]);
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

      const tempProductIdsString = productIdsToCopy.toString();
      if (tempProductIdsString) {
        axios
          .post(`${process.env.REACT_APP_API_URL}/node/products/getProductsForViewingCopy`, {
            tempProductIdsString,
          })
          .then((res) => {
            if (res.data) {
              console.log(res.data);
              setViewProductsToCopy(res.data[0]);
            } else {
              alert("Something went wrong.");
            }
            console.log(res);
          })
          .catch((err) => alert("Error caught:", err));
      } else {
        console.log('no tempProductIdsString');
      }
    } else {
      alert("Select a store to copy the products to.");
    }
  };

  const ProceedToStep3 = () => {
    let confirmCopy = confirm(
      "Are you POSITIVE? There is no going back. Well, there is, but it will just be a lot of work."
    );

    if (confirmCopy) {
      const productList = viewProductsToCopy.map((product) => ({
        product_id: product.product_id,
        model: product.model,
        mpn: product.mpn,
        force_copy: forceCopyState[product.product_id] ? 1 : 0,
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
              const { product_id: pID, model, mpn, force_copy } = product;

              if (pID && model && mpn && force_copy !== undefined) {
                return axios.post(
                  `${process.env.REACT_APP_API_URL}/node/products/insertIntoSelectedProductsToCopy`,
                  { pID, model, mpn, force_copy }
                );
              } else {
                alert("Something wasn't set. Check console!");
                console.log("PID: ", pID);
                console.log("model: ", model);
                console.log("mpn: ", mpn);
                console.log("forcecopy:", force_copy);
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
            setLastMessage("Copying images now...");
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
        fetch(`${process.env.REACT_APP_API_URL}/node/products/RefetchOCMasterTables`)
          .then(
            fetch(`${process.env.REACT_APP_API_URL}/node/products/getProductsToCopy`)
              .then((res) => res.json())
              .then((data) => setProductsResponse(data[0]))
              .catch((err) => console.log("Fetch error:", err))
          )
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
        if (productIdsToCopy.includes(id)) {
          checkbox.checked = true;
        }
      });
    }
  };

  const ExplainForceCopy = () => {
    Swal.fire({
      title: "What does Force Copy mean?",
      text: "Force copy means that even if the product already exists, it will copy it over. Otherwise, it will not copy it over. For example, if you are copying a E660i-9EAN, and the store already has an E660i-9EAN (even though the item descriptions may be different), it will not copy it unless this box is checked.",
      icon: "question",
      customClass: "sweetalert-lg-info bg-slate-600 text-neutral-200",
    });
  };

  if (step1) {
    return (
      <div>
        <div className="centered">
          <p className="text-6xl underline bold text-neutral-200 mt-20">
            SELECT WHICH PRODUCTS TO COPY
          </p>
          {productIdsToCopy && productIdsToCopy.length > 0 && (
            <div className="mt-4">
              <span className="text-4xl text-neutral-200">Product ID's selected: </span>
              {productIdsToCopy.map((d, i) => (
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
            className="bg-slate-800 px-2 py-3 m-0 text-neutral-800 placeholder:text-neutral-300 rounded-lg text-neutral-200 text-4xl border-1 border-slate-700"
            label="Search by Name"
            placeholder="Search by Name"
            value={nameSearchQuery}
            onChange={handleNameSearch}
          />
          <input
            className="bg-slate-800 px-2 py-3 m-0 text-neutral-800 placeholder:text-neutral-300 rounded-lg text-neutral-200 text-4xl border-1 border-slate-700"
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
                    <input
                      type="checkbox"
                      className="w-10 h-10 rounded-lg bg-white"
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
  } else if (step2) {
    return (
      <div>
        <div className="goBack">
          <button className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold p-3 mb-2 transition hover:scale-105" onClick={GoBackOneStep}>
            Go Back
          </button>
        </div>
        <div className="text-neutral-200 text-6xl mt-3 bold underline">
          Are you SURE these are the correct product(s) to copy to{" "}
          {selectedStore}?
        </div>
        <table className="marginTop3rem">
          <thead>
            <tr>
              <th onClick={ExplainForceCopy}>
                Force Copy <span className="inline-block vertical-align-middle align-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="15"
                  width="15"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="#fff"
                    d="M504 256c0 137-111 248-248 248S8 393 8 256C8 119.1 119 8 256 8s248 111.1 248 248z"
                  />
                  <path
                    fill="#3fa9f5"
                    d="M262.7 90c-54.5 0-89.3 23-116.5 63.8-3.5 5.3-2.4 12.4 2.7 16.3l34.7 26.3c5.2 3.9 12.6 3 16.7-2.1 17.9-22.7 30.1-35.8 57.3-35.8 20.4 0 45.7 13.1 45.7 33 0 15-12.4 22.7-32.5 34C247.1 238.5 216 254.9 216 296v4c0 6.6 5.4 12 12 12h56c6.6 0 12-5.4 12-12v-1.3c0-28.5 83.2-29.6 83.2-106.7 0-58-60.2-102-116.5-102zM256 338c-25.4 0-46 20.6-46 46 0 25.4 20.6 46 46 46s46-20.6 46-46c0-25.4-20.6-46-46-46z"
                  />
                </svg>
                </span>
              </th>
              <th>ID</th>
              <th>Model</th>
              <th>MPN</th>
              <th>Name</th>
              <th>Status</th>
              <th>Date Added</th>
            </tr>
          </thead>
          <tbody>
            {viewProductsToCopy.map((d, i) => (
              <tr key={i}>
                <td>
                  &nbsp;&nbsp;&nbsp;{" "}
                  <input
                    type="checkbox"
                    className="w-10 h-10 rounded-lg bg-white"
                    checked={!!forceCopyState[d.product_id]}
                    onChange={() => handleCheckboxChange(d.product_id)}
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
          <button className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold p-3 mb-2 transition hover:scale-105" onClick={GoBackOneStep}>
            Go Back
          </button>
        </div>
        <div className="my-5 font-3xl text-neutral-200">{lastMessage}</div>
      </div>
    );
  }
}

export default CopyProductsToStores;
