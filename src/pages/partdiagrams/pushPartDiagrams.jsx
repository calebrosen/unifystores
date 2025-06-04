import axios from "axios";
import { useContext, useEffect } from "react";
import InfoBanner from "../../components/banners/InfoBanner";
import LargeButton from "../../components/buttons/LargeButton";
import { StoreContext } from "../../contexts/StoreContext";

function PartDiagramsPushToStores() {
  const { selectedStore } = useContext(StoreContext);
  var validStores = ["FPG", "FMP", "FMS"];

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
      <div className="text-center">
        <InfoBanner
          text={`
            <div class="h4 space-y-2">
              <p class="text-4xl font-bold text-neutral-200 mb-4">This will push the following:</p>
              <ul class="list-disc list-inside pl-6 space-y-2 text-neutral-200">
                <li>All part diagram models</li>
                <li>All individual parts on each model</li>
                <li>
                  All part options 
                  <span class="italic text-xl">(e.g., parts with multiple options depending on date of manufacture)</span>
                </li>
                <li>All product tags <span class="italic text-xl">(labels shown on each diagram part)</span></li>
              </ul>
            </div>
          `}
          maxW="w-1/3"
        />

        <div className="mt-10">
          {validStores.includes(selectedStore) &&
            <LargeButton
              text={"Push"}
              action={pushToStoresAction}
            />
          }
        </div>
      </div>
    </div>
  );
}

export default PartDiagramsPushToStores;
