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

  function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  }


  const createCouponAction = () => {
    if (selectedAgent === 'ADMIN' && couponCode === '') {
      alert('You selected admin, you must enter a coupon code.');
      return;
    }
  
    // assigning to temp variable
    let tempCode = couponCode;
    console.log(tempCode)

    if (selectedAgent !== 'ADMIN' && tempCode !== '') {
      console.log('Clearing coupon code');
      tempCode = null;
    }
  
    if (selectedStore && amount) {
      const userConfirmed = confirm(`Are you sure you want to create a coupon for $${amount} on ${selectedStore}?`);
  
      if (userConfirmed) {
        console.log('Selected Agent before sending:', selectedAgent);
        console.log('Payload:', { selectedAgent, selectedStore, amount, tempCode });
  
        axios.post(`${process.env.REACT_APP_API_URL}/node/coupons/createCoupon`, { selectedAgent, selectedStore, amount, couponCode: tempCode })
          .then(res => {
            console.log('Response:', res.data);
            if (res.status === 200) {
              const coupon = res.data[0][0]['CouponCode'];
              setGeneratedCouponCode(coupon);
              copyToClipboard(coupon);
            } else {
              console.log('Unexpected response status:', res.status);
            }
          })
          .catch(err => console.log('Error:', err));
      } else {
        console.log('User canceled the coupon creation.');
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
      <div className="flex flex-row items-center justify-center w-full h-full gap-10 mt-40">
        <div id="agentSelection">
          <select
            className="w-100 bg-slate-800 px-2 py-3 text-neutral-200 h-100 rounded-lg text-neutral-200 text-5xl border-1 border-slate-700"
            id="selectAgent"
            value={selectedAgent}
            onChange={handleInputChange}
          >
            <option value="ADMIN">ADMIN</option>
            {agents.map((agent, i) => (
              <option key={i} value={agent.AgentID}>
                {agent.Agent.replace(/_/g, ' ')}
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
            className="w-100 bg-slate-800 px-3 py-3 text-neutral-900 rounded-lg h-100 text-white placeholder:text-neutral-300 text-5xl border-1 border-slate-700"
            onChange={(e) => setCouponCode(e.target.value)}
          />
        </div>

        <div id="inputAmount">
          <input
            type="number"
            placeholder="Amount of Coupon"
            className="w-100 bg-slate-800 px-3 py-3 text-neutral-900 rounded-lg h-100 text-white placeholder:text-neutral-300 text-5xl border-1 border-slate-700"
            id="amountField"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

 
        <button className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 h-100 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-5xl font-semibold py-4 px-3 transition hover:scale-105" id="createCouponButton" onClick={createCouponAction}>Create Coupon</button>
 </div>
      
      {generatedCouponCode && (
        <div className="text-neutral-200 mt-5 text-4xl">Coupon Code: {generatedCouponCode}</div>
      )}
    </div>
  );
}

export default CreateCoupon;
