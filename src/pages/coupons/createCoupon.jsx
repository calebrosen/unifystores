import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { StoreContext } from '../../contexts/StoreContext';

function CreateCoupon() {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('ADMIN');
  const [couponCode, setCouponCode] = useState('');
  const [amount, setAmount] = useState('');
  const [generatedCouponCode, setGeneratedCouponCode] = useState('');
  const { selectedStore } = useContext(StoreContext);
  const adminInput = useRef(null);
  const couponCodeRef = useRef(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/node/coupons/fetchAgents`)
      .then(res => res.json())
      .then(data => setAgents(data))
      .catch(err => console.log('Fetch error:', err));
  }, []);

  const handleInputChange = (e) => {
    setSelectedAgent(e.target.value);
    if (e.target.value === 'ADMIN') {
      adminInput.current.style.display = 'block';
    } else {
      adminInput.current.style.display = 'none';
    }
  };

  const createCouponAction = () => {
    if (selectedAgent === 'ADMIN' && couponCode === '') {
      alert('You selected admin you so must enter a coupon code.');
      return;
    }
    if (selectedStore && amount) {
      const userConfirmed = confirm("Are you sure you want to create a coupon for $" + amount + " on " + selectedStore + "?");
      
      if (userConfirmed) {
        console.log('Selected Agent before sending:', selectedAgent);
        console.log('Payload:', { selectedAgent, selectedStore, amount, couponCode });

        axios.post(`${process.env.REACT_APP_API_URL}/node/coupons/createCoupon`, { selectedAgent, selectedStore, amount, couponCode })
          .then(res => {
            console.log('Response: ', res.data);
            if (res.status === 200) {
              const coupon = res.data[0][0]['CouponCode'];
              setGeneratedCouponCode(coupon);
              copyToClipboard(coupon);
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

  const copyToClipboard = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code)
        .then(() => {
          alert("Coupon code copied: " + code);
        })
        .catch(err => {
          console.log('Failed to copy: ', err);
        });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert("Coupon code copied: " + code);
    }
  };

  return (
    <div>
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
            maxLength="11"
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
      
      {generatedCouponCode && (
        <div className='marginTop4rem smHeader'>Coupon code: {generatedCouponCode}</div>
      )}
    </div>
  );
}

export default CreateCoupon;
