import axios from "axios";
import { useEffect, useState } from "react";
import exampleImage from "../../assets/img/attributeExample.jpg";

const AddNewAttribute = () => {
  const [attributeName, setAttributeName] = useState("");
  const [attributeGroupID, setAttributeGroupID] = useState("");
  const [data, setData] = useState([]);

  const updateAttributeName = (e) => {
    setAttributeName(e.target.value.trim());
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8081/GetAttributeGroups")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log("Fetch error:", err));
  }, []);

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

  return (
    <div>
      <div className="centered">
        <p className="largeHeader marginTop2rem">SELECT AN ATTRIBUTE GROUP</p>
        <select
          id="selectAttributeGroup"
          className="selectBox1"
          onChange={(e) => setAttributeGroupID(e.target.value)}
        >
          {data.map((d, i) => (
            <option key={i} value={d.attribute_group_id}>
              {d.name}
            </option>
          ))}
        </select>
        <p className="largeHeader marginTop4rem">
          INPUT AN ATTRIBUTE NAME (e.g.: "Remote Features")
        </p>
        This will be the individual attributes of the attribute groups. (e.g.:
        Remote Features is an attribute of the "Controls" attribute group)
        <div id="attributeGroupContainer" className="subsectionContainer">
          <input className="inputBox1" onChange={updateAttributeName}></input>
        </div>
        <div>
          <button
            className="darkRedButton marginTop4rem"
            onClick={AddAttributeAction}
          >
            Add Attribute
          </button>
        </div>
        <div className="marginTop4rem smHeader">
          Below are examples of attributes
        </div>
        <img src={exampleImage} className="exampleImage" alt="Example" />
      </div>
    </div>
  );
};

export default AddNewAttribute;
