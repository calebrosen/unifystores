import axios from 'axios';
import { useState } from 'react';
import LargeButton from '../../components/buttons/LargeButton';
import BoldH1 from '../../components/headings/BoldH1';
import LargeInput from '../../components/inputs/LargeInput';

function AddNewOrderStatus() {
  const [orderStatusName, setOrderStatusName] = useState('');

  const updateOrderStatusName = (e) => {
    setOrderStatusName(e.target.value);
  }
  
  const addOrderStatusAction = () => {
    if (orderStatusName != '') {
      const confirmPush = confirm('Are you sure you want to add ' + orderStatusName + '?');
      if (confirmPush) {
        axios.post(`${process.env.REACT_APP_API_URL}/node/orders/addNewOrderStatus`, { orderStatusName })
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
    } else {
      alert('Try again');
    }
  }

  return (
    <div className="text-center">
      <BoldH1 text={"INPUT AN ORDER STATUS NAME"} />
      <div className="my-10">
        <LargeInput onChange={updateOrderStatusName}/>
      </div>
      <LargeButton action={addOrderStatusAction} text="Add Order Status"/>
    </div>
  );
}

export default AddNewOrderStatus;