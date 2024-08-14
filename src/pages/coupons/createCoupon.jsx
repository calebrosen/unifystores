import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { StoreContext } from '../../contexts/StoreContext';

function CreateCoupon() {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('ADMIN');
  const [couponCode, setCouponCode] = useState('');
  const [amount, setAmount] = useState('');
  const { selectedStore } = useContext(StoreContext);
  const adminInput = useRef(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8081/fetchAgents')
      .then(res => res.json())
      .then(data => setAgents(data))
      .catch(err => console.log('Fetch error:', err));
  }, []);

  const handleInputChange = (e) => {
    setSelectedAgent(e.target.value);
    if (e.target.value === 'ADMIN') {
      adminInput.current.style.display = 'block'; // Show the input
    } else {
      adminInput.current.style.display = 'none'; // Hide the input
    }
  };

  const createCouponAction = () => {
    if (selectedAgent == 'ADMIN' && couponCode == '') {
      alert('You selected admin you so must enter a coupon code.');
      return;
    }
    if (selectedStore && amount) {
      const userConfirmed = confirm("Are you sure you want to create a coupon for $" + amount + " on " + selectedStore + "?");
      
      if (userConfirmed) {
        console.log('Selected Agent before sending:', selectedAgent);
        console.log('Payload:', { selectedAgent, selectedStore, amount, couponCode });

        axios.post('http://127.0.0.1:8081/createCoupon', { selectedAgent, selectedStore, amount, couponCode })
          .then(res => {
            console.log('Response: ', res.data);
            if (res.status === 200) {
              var couponCodeCreated = res.data[0][0].CouponCode;
              alert('Coupon with code ' + couponCodeCreated + ' created.');
              console.log(couponCodeCreated);
            } else {
              console.log("Unexpected response status:", res.status);
            }
          })
          .catch(err => console.log('Error:', err));
      } else {
        console.log("User canceled the coupon creation.");
      }
    } else {
      alert('You either forgot to select a store or input an amount.');
    }
  };
  
  return (
    <div id="createCouponContainer">
      <div id="agentSelection">
        <select
          className="agentSelection"
          id="selectAgent"
          value={selectedAgent}
          onChange={handleInputChange}
        >
          <option value="ADMIN">ADMIN</option>
          {agents.map((agent, i) => (
            <option key={i} value={agent.AgentID}>
              {agent.Agent}
            </option>
          ))}
        </select>
      </div>

      <div id="inputCouponCode" ref={adminInput}>
        <input
          type="text"
          placeholder="Coupon Code"
          id="couponCodeField"
          value={couponCode}
          className="textBoxCoupon"
          onChange={(e) => setCouponCode(e.target.value)}
        />
      </div>

      <div id="inputAmount">
        <input
          type="number"
          placeholder="Amount of Coupon"
          className='textBoxCoupon'
          id="amountField"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <button className='createButton' id="createCouponButton" onClick={createCouponAction}>Create Coupon</button>
    </div>
  );
}

export default CreateCoupon;
