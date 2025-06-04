import axios from "axios";
import React, { useState } from "react";
import BoldH1 from "../../components/headings/BoldH1";
import LargeButton from "../../components/buttons/LargeButton";
import LargeInput from "../../components/inputs/LargeInput";

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
        <BoldH1 text={"Input Customer Group Name"} />
        <div className="text-center mt-10 mb-12">
          <LargeInput
            label="Customer Group Name"
            placeholder="Customer Group Name"
            value={customerGroupName}
            onChange={updateCustomerGroupName}
          />
        </div>

        <LargeButton
          action={addCustomerGroupAction}
          text={"Add Customer Group"}
        />

      </div>
    </div>
  );
}

export default AddNewCustomerGroup;
