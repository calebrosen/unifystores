import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import LargeButton from '../../components/buttons/LargeButton';
import BoldH1 from '../../components/headings/BoldH1';
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
    <div className="text-center mt-20">
        <BoldH1 text={"SELECT WHICH INFORMATION TO PUSH"} />

        <select className="bg-slate-800 p-3 rounded-lg text-neutral-200 border-1 border-slate-700 placeholder:text-neutral-400 mt-10 max-w-md" onChange={updateSetInformation}>
          <option value=""></option>
          {information.map((d, i) => (
            <option key={i} value={d.title}>
              {d.title}
            </option>
          ))}
        </select>

        <div className="mt-10">
          <LargeButton
            text="Push"
            action={pushInformation}
          />
        </div>
    </div>
  );
}

export default PushInformation;
