import axios from "axios";
import React, { useState } from "react";

function AddNewCustomerGroup() {
  const [customerGroupName, setCustomerGroupName] = useState("");

  const updateCustomerGroupName = (e) => {
    setCustomerGroupName(e.target.value);
  };

  const addCustomerGroupAction = () => {
    if (customerGroupName != "") {
      const confirmPush = confirm(
        "Are you sure you want to add " + customerGroupName + "?"
      );
      if (confirmPush) {
        axios
          .post(
            `${process.env.REACT_APP_API_URL}/node/customers/addNewCustomerGroup`,
            { customerGroupName }
          )
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
    }
  };

  return (
    <div>
      <div className="centered">
        <p className="text-6xl text-white font-bold underline my-4">
          INPUT A CUSTOMER GROUP NAME
        </p>
        <div id="customerGroupContainer" className="text-center">
          <input
            className="bg-slate-700 p-2 rounded-lg text-neutral-200 text-4xl mt-4 w-25"
            onChange={updateCustomerGroupName}
          ></input>
        </div>
        <div>
          <button
            className="text-neutral-200 bg-gradient-to-r from-cyan-800 mt-5 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold p-3 me-2 mb-2 transition hover:scale-105"
            onClick={addCustomerGroupAction}
          >
            Add Customer Group
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddNewCustomerGroup;
