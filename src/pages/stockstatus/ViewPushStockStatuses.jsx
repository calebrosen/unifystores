import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../contexts/StoreContext";
import MediumButton from "../../components/buttons/MediumButton";

function ViewPushStockStatuses() {
  const [data, setData] = useState([]);
  const { selectedStore } = useContext(StoreContext);

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_URL}/node/stockstatus/viewEditStockStatusName`
    )
      .then((res) => res.json())
      .then((data) => setData(data[0]))
      .catch((err) => console.log("Fetch error:", err));
  }, []);

  const pushToStore = (e) => {
    if (selectedStore) {
      let stockStatusID = e.target.id;
      let name = e.target.name;
      const confirmPush = confirm(
        'Are you sure you want to push stock status "' +
          name +
          '" to ' +
          selectedStore +
          "?"
      );
      if (confirmPush) {
        axios
          .post(
            `${process.env.REACT_APP_API_URL}/node/stockstatus/pushStockStatus`,
            { selectedStore, stockStatusID }
          )
          .then((res) => {
            if (res.data[0][0]["success"]) {
              alert(res.data[0][0]["success"]);
            } else {
              alert("Something went wrong.");
            }
            console.log(res);
          })
          .catch((err) => alert("Error:", err));
      }
    } else {
      alert("Try selecting a store first.");
    }
  };

  return (
    <div className="text-center">
      <table className="mt-5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Push to Store</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.stock_status_id}</td>
              <td>{d.name}</td>
              <td>
                <MediumButton
                  text={"Push to Store"}
                  action={pushToStore}
                  id={d.stock_status_id}
                  name={d.name}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewPushStockStatuses;
