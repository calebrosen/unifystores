import axios from 'axios';
import { useState } from 'react';
import BoldH1 from '../../components/headings/BoldH1';
import LargeButton from '../../components/buttons/LargeButton';
import LargeInput from '../../components/inputs/LargeInput';

function AddNewManufacturer() {
  const [manufacturerName, setManufacturerName] = useState('');

  const updateManufacturerName = (e) => {
    setManufacturerName(e.target.value);
  }
  
  const addManufacturerAction = () => {
    if (manufacturerName != '') {
      const confirmPush = confirm('Are you sure you want to add ' + manufacturerName + '?');
      if (confirmPush) {
        axios.post(`${process.env.REACT_APP_API_URL}/node/manufacturers/addNewManufacturer`, { manufacturerName })
        .then(res => {
            if (res.data[0][0]['success']) {
              alert(res.data[0][0]['success']);
            }
            else {
              alert('Something went wrong');
            }
            console.log(res);
        })
        .catch(err => alert('Error:', err));
      }
    }
  }

  return (
      <div className="text-center">
        <BoldH1 text={"INPUT A MANUFACTURER NAME"}/>
        <div className="my-10">
          <LargeInput
            onChange={updateManufacturerName}
          />
        </div>
        <LargeButton action={addManufacturerAction} text={"Add Manufacturer"}/>
      </div>
  );
}

export default AddNewManufacturer;