import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../contexts/StoreContext';

function PushInformation() {
  const [information, setInformation] = useState([]);
  const [selectedInformation, setSelectedInformation] = useState('');
  const { selectedStore } = useContext(StoreContext);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/node/information/viewEditInformation`)
      .then(res => res.json())
      .then(data => setInformation(data[0]))
      .catch(err => console.log('Fetch error:', err));
  },[]);

  const pushInformation = () => {
    if (selectedInformation !== '' && selectedStore !== '') {
      const confirmPush = window.confirm('Are you sure you want to push ' + selectedInformation + ' to ' + selectedStore + '?');
      if (confirmPush && selectedInformation != '') {
        axios.post(`${process.env.REACT_APP_API_URL}/node/information/pushInformation`, { selectedStore, selectedInformation })
        .then(res => { if (res.data[0][0]['success']) {
          alert('success');
          console.log(res);
        } else {
          alert('It didnt work');
        }})
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
        <p className="mt-20 text-5xl text-neutral-200 bold underline">
          SELECT WHICH INFORMATION TO PUSH
        </p>
        <select className="bg-slate-800 mt-8 px-2 py-3 text-neutral-200 h-100 rounded-lg text-neutral-200 text-3xl border-1 border-slate-700" id="selectInformation" defaultValue="" onChange={updateSetInformation}>
          <option value="" disabled></option>
          {information.map((d, i) => (
            <option key={i} value={d.title}>
              {d.title}
            </option>
          ))}
        </select>
      </div>
      <p className='centered'>
        <button className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl mt-8 font-semibold py-2.5 px-3 mb-2 transition hover:scale-105" value="push" onClick={pushInformation}>Push</button>
      </p>
    </div>
  );
}

export default PushInformation;
