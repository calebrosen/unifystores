import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../contexts/StoreContext";

const CopyAttributes = () => {
  const [data, setData] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState("");
  const { selectedStore } = useContext(StoreContext);
  const [productsToAffect, setProductsToAffect] = useState([]);
  const [showLastPreview, setShowLastPreview] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8081/GetAttributes")
      .then((res) => res.json())
      .then((data) => setData(data[0]))
      .then(HideStoreSelection())
      .catch((err) => console.log("Fetch error:", err));
  }, []);


  const PreviewCopyAction = () => {
    if (selectedAttribute) {
      // previewing what products have this attribute
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
          console.log(res);
        })
        .catch((err) => alert("Error:", err));
    } else {
      alert("Select a store and attribute.");
    }
  };

  const PreviewProductsToAffect = () => {
    if (selectedAttribute && selectedStore) {
      // need to post to PreviewProductsForAttributeCopy with selectedStore and selectedAttribute
      // then, preview products being copied to
      setShowStoreSelection(false);
      setShowLastPreview(true);
    } else {
      alert('Select a store to copy to.');
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
    const attributeIDToSet = e.currentTarget.value;
    setSelectedAttribute(attributeIDToSet);
  };

  const GoBack = () => {
    //HideStoreSelection();
    setProductsToAffect([]);
  };

  if (!productsToAffect.length > 0) {
    return (
      <div>
        <div className="centered">
          <p className="xlHeader marginTop3rem">SELECT AN ATTRIBUTE TO COPY</p>
          <select
            id="selectAttributeGroup"
            className="selectBox1"
            onClick={HandleChangeAttribute}
          >
            <option></option>
            {data.map((d, i) => (
              <option key={i} value={d.attribute_id} id={d.attribute_id}>
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
  } 
  else if (showLastPreview) {
    return (
      <p>
        tester
      </p>
    )
  }
  else {
    // products are set (proceed button has been clicked)
    return (
      <div>
        <div className="centered">
          <div className="spaceApart">
            <button className="darkRedButton" onClick={GoBack}>
              Go back
            </button>
            <button className="darkRedButton" onClick={PreviewProductsToAffect}>Proceed</button>
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
