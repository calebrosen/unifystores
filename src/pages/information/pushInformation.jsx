import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../contexts/StoreContext';

function PushInformation() {
  const [information, setInformation] = useState([]);
  const [selectedInformation, setSelectedInformation] = useState('');
  const { selectedStore } = useContext(StoreContext);

  useEffect(() => {
    fetch('http://127.0.0.1:8081/viewEditInformation')
      .then(res => res.json())
      .then(data => setInformation(data[0]))
      .catch(err => console.log('Fetch error:', err));
  },[]);

  const pushInformation = () => {
    if (selectedInformation !== '' && selectedStore !== '') {
      const confirmPush = window.confirm('Are you sure you want to push ' + selectedInformation + ' to ' + selectedStore + '?');
      if (confirmPush && selectedInformation != '') {
        axios.post('http://127.0.0.1:8081/pushInformation', { selectedStore, selectedInformation })
        .then(res => { console.log(res) })
        .catch(err => console.log('Error:', err));
      }
    } else { alert('Try selecting one first.');}
  }

  const updateSetInformation = (e) => {
    setSelectedInformation(e.target.value);
  }

  return (
    <div>
      <div className='centered'>
        <p className='smHeader marginTop2rem'>
          SELECT WHICH INFORMATION TO PUSH
        </p>
        <select className='selectBox1' id="selectInformation" defaultValue="" onChange={updateSetInformation}>
          <option value="" disabled></option>
          {information.map((d, i) => (
            <option key={i} value={d.title}>
              {d.title}
            </option>
          ))}
        </select>
      </div>
      <p className='centered'>
        <button className='darkRedButton marginTop3rem' value="push" onClick={pushInformation}>Push</button>
      </p>
    </div>
  );
}

export default PushInformation;
