import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../contexts/StoreContext";

const CopyAttributes = () => {
  const [data, setData] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState("");
  const { selectedStore } = useContext(StoreContext);
  const [productsToAffect, setProductsToAffect] = useState([]);
  const [showLastPreview, setShowLastPreview] = useState(false);
  const [storeProductsToAffectPreview, setStoreProductsToAffectPreview] = useState([]);
  const [checkedItems, setCheckedItems] = useState(new Set());

  useEffect(() => {
    fetch("http://127.0.0.1:8081/GetAttributes")
      .then((res) => res.json())
      .then((data) => setData(data[0]))
      .then(HideStoreSelection())
      .catch((err) => console.log("Fetch error:", err));
  }, []);

  const PreviewCopyAction = () => {
    if (selectedAttribute) {
      axios
        .post("http://127.0.0.1:8081/GetProductsForAttributeCopy", {
          selectedAttribute,
        })
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
        .post("http://127.0.0.1:8081/PreviewProductsForAttributeCopy", {
          selectedStore,
          selectedAttribute,
        })
        .then((res) => {
          if (res.data) {
            setStoreProductsToAffectPreview(res.data[0]);

            //setting each checkbox as checked by default
            const newCheckedItems = new Set(res.data[0].map((item) => item.StoreID));
            setCheckedItems(newCheckedItems);
          } else {
            alert("Something went wrong when attempting to find products to preview. Maybe there were no applicable products.");
          }
        })
        .catch((err) => alert("Error:", err));
      HideStoreSelection();
      setShowLastPreview(true);
    } else {
      alert("Select a store to copy to.");
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
      console.log(newCheckedItems);
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


  if (!productsToAffect.length > 0) {
    return (
      <div>
        <div className="centered">
          <p className="xlHeader marginTop3rem">SELECT AN ATTRIBUTE TO COPY</p>
          <select
            id="selectAttributeGroup"
            className="selectBox1"
            onChange={HandleChangeAttribute}
          >
            <option></option>
            {data.map((d, i) => (
              <option key={i} value={d.attribute_id}>
                {d.name}
              </option>
            ))}
          </select>
          <div>
            <button
              className="darkRedButton marginTop4rem"
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
        <p className="xlHeader marginTop3rem">
          Products on {selectedStore} with the boxes checked will be copied to
          </p>
          <div className="spaceApart">
            <button className="darkRedButton" onClick={GoBack}>Go back</button>
            <button className="darkRedButton">Proceed</button>
          </div>
          <p className="miniInfoText marginTop3rem">
            T stands for Target | OCM stands for OCMaster
          </p>
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
              {storeProductsToAffectPreview && storeProductsToAffectPreview.length > 0 ? (
                storeProductsToAffectPreview.map((d, i) => (
                  <tr key={i}>
                    <td>
                      <input
                        type="checkbox"
                        checked={checkedItems.has(d.StoreID)}
                        onChange={() => handleCheckboxChange(d.StoreID)} // handling checkbox change
                        style={{marginLeft: '16px'}}
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
                  <td colSpan={12} style={{ textAlign: 'center', fontSize: '26px' }}>Loading...</td>
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
            <button className="darkRedButton" onClick={GoBack}>
              Go back
            </button>
            <button className="darkRedButton" onClick={PreviewProductsToAffect}>
              Proceed
            </button>
          </div>
          <p className="xlHeader marginTop3rem">
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
