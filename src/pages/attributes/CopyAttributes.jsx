import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../contexts/StoreContext";

const CopyAttributes = () => {
  const [data, setData] = useState([]);
  const { selectedStore } = useContext(StoreContext);

  useEffect(() => {
    fetch("http://127.0.0.1:8081/GetAttributes")
      .then((res) => res.json())
      .then((data) => setData(data[0]))
      .catch((err) => console.log("Fetch error:", err));
  }, []);

  const PreviewCopyAction = () => {
    if (selectedStore) {

    }
    else {
        alert('Select a store to copy attributes to.');
    }
  }

  /*
  const AddAttributeAction = () => {
    if (attributeGroupName != "") {
      const confirmPush = confirm(
        `Are you sure you want to add "${attributeName}" as an Attribute of Attribute Group "${attributeGroup}? They will be added to the local table and ALL stores.`
      );
      if (confirmPush) {
        axios
          .post("http://127.0.0.1:8081/addNewAttributeGroup", {
            attributeName,
            attributeGroupID,
          })
          .then((res) => {
            if (res.data[0][0]["success"]) {
              alert(res.data[0][0]["success"]);
            } else {
              alert("Something went wrong");
            }
            console.log(res);
          })
          .catch((err) => alert("Error:", err));
      }
    } else {
      alert("Input an attribute group name");
    }
  };
*/

  return (
    <div>
      <div className="centered">
        <p className="largeHeader marginTop3rem">SELECT AN ATTRIBUTE</p>
        <select
          id="selectAttributeGroup"
          className="selectBox1"
        >
          {data.map((d, i) => (
            <option
                key={i}
                value={d.attribute_id}
                id={d.attribute_id}
            >
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
};

export default CopyAttributes;
