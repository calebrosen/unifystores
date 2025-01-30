import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../contexts/StoreContext";

const CopyAttributes = () => {
  const [data, setData] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState("");
  const { selectedStore } = useContext(StoreContext);
  const [productsToAffect, setProductsToAffect] = useState([]);
  const [showLastPreview, setShowLastPreview] = useState(false);
  const [storeProductsToAffectPreview, setStoreProductsToAffectPreview] =
    useState([]);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [productIDsToAffect, setProductIDsToAffect] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/node/attributes/getAttributes`)
    .then((res) => res.json())
    .then((data) => {
      setData(data[0]);
      HideStoreSelection();
    })
    .catch((err) => console.log("Fetch error:", err));
  }, []);

  const PreviewCopyAction = () => {
    if (selectedAttribute) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/node/attributes/getProductsForAttributeCopy`,
          {
            selectedAttribute,
          }
        )
        .then((res) => {
          if (res.data) {
            const tmp = res.data[0];
            if (tmp.length > 0) {
              setProductsToAffect(tmp);
              ShowStoreSelection();
            } else {
              alert("No products were found with that attribute.");
            }
          } else {
            alert("Something went wrong.");
          }
        })
        .catch((err) => alert("Error:", err));
    } else {
      alert("Select a store and attribute.");
    }
  };

  const PreviewProductsToAffect = () => {
    if (selectedAttribute && selectedStore) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/node/attributes/previewProductsForAttributeCopy`,
          {
            selectedStore,
            selectedAttribute,
          }
        )
        .then((res) => {
          if (res.data) {
            setStoreProductsToAffectPreview(res.data[0]);
            //setting each checkbox as checked by default
            const newCheckedItems = new Set(
              res.data[0].map((item) => item.StoreID)
            );
            setCheckedItems(newCheckedItems);
          } else {
            alert(
              "Something went wrong when attempting to find products to preview. Maybe there were no applicable products."
            );
          }
        })
        .catch((err) => alert("Error:", err));
      HideStoreSelection();
      setShowLastPreview(true);
    } else {
      alert("Select a store to copy to.");
    }
  };

  const CopyAttributesFromOCMToStoreAction = () => {
    if (Array.from(checkedItems).length > 0) {
      let confirmTmp = confirm(`Are you sure you want to copy the attributes from the selected products on OCMaster to ${selectedStore}?`);
      if (confirmTmp) {
        const productIdsString = Array.from(checkedItems).toString();
        console.log(productIdsString);
        axios
        .post(
          `${process.env.REACT_APP_API_URL}/node/attributes/copyAttributesFromOCMasterToStore`,
          {
            selectedStore,
            selectedAttribute,
            productIdsString
          }
        )
        .then((res) => {
          if (res.data) {
            alert('good');
          } else {
            alert(
              "Something went wrong when attempting to find products to preview. Maybe there were no applicable products."
            );
          }
          console.log(res);
        })
        .catch((err) => alert("Error:", err));
      }
    }
  }

  const HideStoreSelection = () => {
    const stores = document.getElementById("storesRadioInner");
    stores.style.display = "none";
  };

  const ShowStoreSelection = () => {
    const stores = document.getElementById("storesRadioInner");
    stores.style.display = "block";
  };

  const HandleChangeAttribute = (e) => {
    setSelectedAttribute(e.currentTarget.value);
  };

  const handleCheckboxChange = (item) => {
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = new Set(prevCheckedItems);

      if (newCheckedItems.has(item)) {
        newCheckedItems.delete(item); // Uncheck
      } else {
        newCheckedItems.add(item); // Check
      }
      return newCheckedItems;
    });
  };

  const GoBack = () => {
    // This function resets everything to initial states
    HideStoreSelection();
    setProductsToAffect([]);
    setStoreProductsToAffectPreview([]);
    setShowLastPreview(false);
    setCheckedItems(new Set());
  };

  function UnSelectAll() {
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = new Set(prevCheckedItems);
      newCheckedItems.clear();
      return newCheckedItems;
    })
  }

  function SelectAll() {
    const tempSet = new Set(storeProductsToAffectPreview.map((item) => item.StoreID));
    setCheckedItems(tempSet);
  }

  if (!productsToAffect.length > 0) {
    return (
      <div>
        <div className="centered">
          <div className="mt-4 mb-28">
            <span className="fonbg-gradient-to-r from-cyan-800 to-slate-800 text-neutral-200 font-medium py-6 px-8 rounded-xl text-6xl shadow-lg transform hover:scale-105 transition-transform duration-300">SELECT AN ATTRIBUTE TO COPY
            </span>
          </div>
          <select
            id="selectAttributeGroup"
            className="p-2 bg-slate-700 text-neutral-200 text-3xl rounded-lg mb-12"
            onChange={HandleChangeAttribute}
          >
            <option></option>
            {data
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((d, i) => (
              <option key={i} value={d.attribute_id}>
                {d.name}
              </option>
            ))}
          </select>
          <div>
            <button
              className="text-neutral-200 bg-gradient-to-r mt-10 from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold px-5 py-3 me-2 mb-2 transition hover:scale-105"
              onClick={PreviewCopyAction}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    );
  } else if (showLastPreview) {
    return (
      <div>
        <div className="centered">
          <h1 className="text-5xl my-4 text-neutral-200 font-bold">Selected: {selectedStore}</h1>
          <p className="text-neutral-200 text-4xl mt-12 font-semibold">
            Products with the boxes checked will be copied to
          </p>
          <div className="flex flex-row gap-8 my-8 justify-content-center">
            <button className="text-neutral-200 bg-gradient-to-r mt-4 from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold px-5 py-3 me-2 mb-2 transition hover:scale-105" onClick={GoBack}>
              Go back
            </button>
            <button className="text-neutral-200 bg-gradient-to-r mt-4 from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold px-5 py-3 me-2 mb-2 transition hover:scale-105" onClick={CopyAttributesFromOCMToStoreAction}>Proceed</button>
          </div>
          <p className="text-4xl mt-8 mb-4 text-neutral-200 font-bold">
            T stands for Target | OCM stands for OCMaster
          </p>
          <div className="text-3xl mt-14 text-neutral-200 font-bold">Product IDs selected:</div>
          <div className='lineBreakSpanContainer'>
          {Array.from(checkedItems) &&
            Array.from(checkedItems).length > 0 &&
            Array.from(checkedItems).map((d, i) => (
              <span key={i} className='lineBreakSpan'>
                {d},&nbsp;
              </span>
          ))}</div>
          <div>
            <button onClick={UnSelectAll} className="text-neutral-200 bg-gradient-to-r mt-10 from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-3xl font-semibold px-3 py-3 mx-4 mb-2 transition hover:scale-105">Uncheck all</button>
            <button onClick={SelectAll} className="text-neutral-200 bg-gradient-to-r mt-10 from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-3xl font-semibold px-3 py-3 mx-4 mb-2 transition hover:scale-105">Check all</button>
          </div>
          <table className="marginTop4rem">
            <thead>
              <tr>
                <th>Copy</th>
                <th>T ID</th>
                <th>T MPN</th>
                <th>T Model</th>
                <th>T Name</th>
                <th>T Hidden</th>
                <th>T Status</th>
                <th>OCM MPN</th>
                <th>OCM Model</th>
                <th>OCM Name</th>
                <th>Attr. Name</th>
                <th>Attr. Text</th>
              </tr>
            </thead>
            <tbody>
              {storeProductsToAffectPreview &&
              storeProductsToAffectPreview.length > 0 ? (
                storeProductsToAffectPreview.map((d, i) => (
                  <tr key={i}>
                    <td>
                      <input
                        type="checkbox"
                        checked={checkedItems.has(d.StoreID)} // StoreID is the product ID on the store selected (so it's unique)
                        onChange={() => handleCheckboxChange(d.StoreID)} // handling checkbox change
                        style={{ marginLeft: "16px" }}
                        className="checkboxForCopyProduct"
                      />
                    </td>
                    <td>{d.StoreID}</td>
                    <td>{d.StoreMPN}</td>
                    <td>{d.StoreModel}</td>
                    <td>{d.StoreName}</td>
                    <td>{d.Hidden}</td>
                    <td>{d.Status}</td>
                    <td>{d.OCM_MPN}</td>
                    <td>{d.OCM_Model}</td>
                    <td>{d.OCM_Name}</td>
                    <td>{d.OCM_Attribute_Name}</td>
                    <td>{d.OCM_Attribute_Text}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={12}
                    style={{ textAlign: "center", fontSize: "26px" }}
                  >
                    Loading...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="centered">
          <div className="spaceApart">
            <button className="text-neutral-200 bg-gradient-to-r mt-10 from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold px-5 py-3 me-2 mb-2 transition hover:scale-105" onClick={GoBack}>
              Go back
            </button>
            <button className="text-neutral-200 bg-gradient-to-r mt-10 from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold px-5 py-3 me-2 mb-2 transition hover:scale-105" onClick={PreviewProductsToAffect}>
              Proceed
            </button>
          </div>
          <p className="text-neutral-200 text-5xl mt-12 font-semibold">
            Products on OCMaster with Attribute ID {selectedAttribute}
          </p>
          <table className="marginTop4rem">
            <thead>
              <tr>
                <th>ID</th>
                <th>MPN</th>
                <th>Model</th>
                <th>Name</th>
                <th>Attr. Name</th>
                <th>Attr. Text</th>
              </tr>
            </thead>
            <tbody>
              {productsToAffect.map((d, i) => (
                <tr key={i}>
                  <td>{d.ID}</td>
                  <td>{d.MPN}</td>
                  <td>{d.Model}</td>
                  <td>{d.Name}</td>
                  <td>{d.AttributeName}</td>
                  <td>{d.AttributeText}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
};

export default CopyAttributes;