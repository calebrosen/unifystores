import axios from "axios";
import { useEffect, useState } from "react";
import BoldH1 from "../../components/headings/BoldH1";
import MediumInput from "../../components/inputs/MediumInput";
import MediumButton from "../../components/buttons/MediumButton";

function EditCustomerGroupName() {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_URL}/node/customers/viewEditCustomerGroupName`
    )
      .then((res) => res.json())
      .then((data) => setData(data[0]))
      .catch((err) => console.log("Fetch error:", err));
  }, []);

  const updateName = (e) => {
    console.log(e.target.value);
    setName(e.target.value);
  };

  const editCustomerGroupName = (customerGroupID, originalName) => {
    if (name != originalName && name != "") {
      const confirmPush = confirm(
        `Are you sure you want to change the name from ${originalName} (ID: ${customerGroupID}) to ${name}?`
      );
      if (confirmPush) {
        axios
          .post(
            `${process.env.REACT_APP_API_URL}/node/customers/editCustomerGroupName`,
            { customerGroupID, name }
          )
          .then((res) => {
            console.log(res);
            if (res.data[0][0]["success"]) {
              alert(res.data[0][0]["success"]);
            }
          })
          .catch((err) => alert("Error:", err));
      }
    } else {
      alert("There's an input field, btw. Try changing that first.");
    }
  };

  return (
    <div className="text-center">
      <BoldH1 text={"Edit Customer Group Name"} />
      <table className="mt-5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Edit Name</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.customer_group_id}</td>
              <td>
                <MediumInput
                  onChange={updateName}
                  name={d.name}
                  defaultValue={d.name}
                />
              </td>
              <td>
                <MediumButton
                   action={(e) => editCustomerGroupName(d.customer_group_id, d.name)}
                  text={"Edit Name"}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EditCustomerGroupName;
