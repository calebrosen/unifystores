import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { StoreContext } from '../../contexts/StoreContext';


function PartDiagramsPushToStores() {
  const { selectedStore } = useContext(StoreContext);
  var validStores = ['FPG','FMP','FMS'];

  useEffect(() => {
    if (selectedStore) {
      var pushButton = document.getElementById('pushButton');
      var pushText = 'Push to ' + selectedStore;
      pushButton.innerHTML = pushText;
      if (validStores.includes(selectedStore)) {
        pushButton.style.visibility = 'visible';
      } else {
        pushButton.style.visibility = 'hidden';
      }
    }
  })

  function pushToStoresAction() {
      axios.post(`${process.env.REACT_APP_API_URL}/node/partdiagrams/pushPartDiagrams`, { selectedStore })
      .then(res => {
          alert(res.data);
      })
      .catch(err => alert('Error:', err));
  }

  return (
  <div>
    <div id="partDiagramsContainer" className='subsectionContainer'>
      <div id="explain" className='marginTop3rem regText'>
        <span className="smHeader">This will push:</span><br />
        All part diagrams models<br />
        All individual parts on each model<br />
        All part options (part that has more than one option, normally depending on date manufactured)<br />
        All product tags (this is used for the badge and comes from product description. (Ex: "Burner", or "Knob"))
      </div>
      <div>
        <button className='hiddenButton darkRedButton marginTop3rem' id='pushButton' onClick={pushToStoresAction}></button>
      </div>
    </div>
  </div>
  );
}

export default PartDiagramsPushToStores;