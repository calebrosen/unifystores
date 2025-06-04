import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import XLButton from '../../components/buttons/XLButton';
import XLInput from '../../components/inputs/XLInput';
import { StoreContext } from '../../contexts/StoreContext';

function CreateCoupon() {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('ADMIN');
  const [couponCode, setCouponCode] = useState('');
  const [amount, setAmount] = useState('');
  const [generatedCouponCode, setGeneratedCouponCode] = useState('');
  const { selectedStore } = useContext(StoreContext);
  const [showCouponCode, setShowCouponCode] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/node/coupons/fetchAgents`)
      .then(res => res.json())
      .then(data => setAgents(data))
      .catch(err => console.log('Fetch error:', err));
  }, []);

  const handleInputChange = (e) => {
    setSelectedAgent(e.target.value);
    if (e.target.value === 'ADMIN') {
      setShowCouponCode(true);
    } else {
      setShowCouponCode(false);
      setCouponCode('');
    }
  };

  const createCouponAction = () => {
    if (selectedAgent === 'ADMIN' && couponCode === '') {
      alert('You selected admin, you must enter a coupon code.');
      return;
    }
  
    // assigning to temp variable for reassignment if necessary
    let tempCode = couponCode;


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
      alert(`You either forgot to select a store or input an amount. ${selectedStore}, ${amount}`);
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

  const updateAmount = (e) => {
    setAmount(e.target.value);
  }

  const updateCouponCode = (e) => {
    setCouponCode(e.target.value);
  }

  return (
    <div>
      <div className="flex flex-row items-center justify-center w-full h-full gap-10 mt-16">

          <select
            className="bg-slate-800 p-3 rounded-lg text-neutral-200 border-1 border-slate-700 text-4xl placeholder:text-neutral-400 my-12"
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
     
          {showCouponCode &&
            <XLInput
              placeholder={"Coupon Code"}
              value={couponCode}
              maxLength={11}
              onChange={updateCouponCode}
            />
          }

          <XLInput
            placeholder={"Coupon Amount"}
            type={"number"}
            onChange={updateAmount}
          />

          <XLButton
            text={"Create Coupon"}
            action={createCouponAction}
          />

         </div>
      
      {generatedCouponCode && (
        <div className="text-neutral-200 mt-5 text-4xl flex justify-center">Coupon Code: {generatedCouponCode}</div>
      )}
    </div>
  );
}

export default CreateCoupon;
