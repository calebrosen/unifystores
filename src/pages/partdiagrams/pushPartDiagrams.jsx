import axios from "axios";
import React, { useContext, useEffect } from "react";
import { StoreContext } from "../../contexts/StoreContext";

function PartDiagramsPushToStores() {
  const { selectedStore } = useContext(StoreContext);
  var validStores = ["FPG", "FMP", "FMS"];

  useEffect(() => {
    if (selectedStore) {
      var pushButton = document.getElementById("pushButton");
      var pushText = "Push to " + selectedStore;
      pushButton.innerHTML = pushText;
      if (validStores.includes(selectedStore)) {
        pushButton.style.visibility = "visible";
      } else {
        pushButton.style.visibility = "hidden";
      }
    }
  });

  function pushToStoresAction() {
    let confirmPush = confirm(
      `Are you sure you want to push part diagrams to ${selectedStore}?`
    );
    if (confirmPush) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/node/partdiagrams/pushPartDiagrams`,
          { selectedStore }
        )
        .then((res) => {
          if (res.data[0][0]["success"]) {
            alert(res.data[0][0]["success"]);
          }
        })
        .catch((err) => alert("Error:", err));
    }
  }

  return (
    <div>
      <div id="partDiagramsContainer" className="text-center">
        <div
          id="explain"
          className="mt-5 font-xl text-neutral-200"
        >
          <span className="text-4xl text-neutral-200 font-bold my-3">
            This will push:
          </span>
          <br />
          <div className="text-3xl my-4 text-neutral-200">
            All part diagrams models
            <br />
            All individual parts on each model
            <br />
            All part options (part that has more than one option, normally
            depending on date manufactured)
            <br />
            All product tags (labels on each part on the diagrams)
            <br />
          </div>
        </div>
        <div>
          <button
            className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold px-5 py-3 mt-4 me-2 mb-2 transition hover:scale-105"
            id="pushButton"
            onClick={pushToStoresAction}
          >
            Push
          </button>
        </div>
      </div>
    </div>
  );
}

export default PartDiagramsPushToStores;
