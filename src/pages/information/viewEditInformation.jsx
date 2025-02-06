import axios from 'axios';
import React, { useEffect, useState } from 'react';

function ViewEditInformation() {
  const [information, setInformation] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState('edit');
  const [response, setResponse] = useState('');
  

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/node/information/viewEditInformation`)
      .then(res => res.json())
      .then(data => setInformation(data[0]))
      .catch(err => console.log('Fetch error:', err));
  },[]);

  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  function loadInputBox() {
    const selected = document.getElementById('selectInformation').value;
    information.forEach(element => {
      if (element.title === selected) {
        setInputValue(decodeHtml(element.replaced));
      }
    });
  }

  const saveInformation = () => {
    const selectedInformation = document.getElementById('selectInformation').value;
    if (selectedInformation !== '') {
      const confirmSave = window.confirm('Are you sure you want to save ' + selectedInformation + '?');
      if (confirmSave && selectedInformation != '') {
        axios.post(`${process.env.REACT_APP_API_URL}/node/information/saveInformation`, { selectedInformation, inputValue })
        .then(res => alert(res.request.response))
        .catch(err => console.log('Error:', err));
      }

      else {
        console.log(response);
      }
    } else { alert('Try selecting one first.');}
  }


  return (
    <div>
      <div className='centered'>
        <p className="mt-10 text-5xl text-neutral-200 font-bold underline">
          SELECT WHICH INFORMATION TO LOAD
        </p>
        <select className="bg-slate-800 mt-8 px-2 py-3 text-neutral-200 h-100 rounded-lg text-neutral-200 text-3xl border-1 border-slate-700" id="selectInformation" defaultValue="" onChange={loadInputBox}>
          <option value="" disabled></option>
          {information.map((d, i) => (
            <option key={i} value={d.title}>
              {d.title}
            </option>
          ))}
        </select>
      </div>

      <div className='tab-buttons my-5'>
        <button className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold py-2.5 px-3 mb-2 transition hover:scale-105" onClick={() => setActiveTab('edit')}>Edit</button>
        &nbsp;&nbsp;
        <button className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold py-2.5 px-3 mb-2 transition hover:scale-105" onClick={() => setActiveTab('preview')}>Preview</button>
        <p className="text-3xl text-neutral-200 mt-5">Available placeholders are <span className="font-bold">&#123;WEBSITE&#125;</span> (Ex: FireplaceandGrill.com) and <span className="bold">&#123;EMAILDOMAIN&#125;</span> (Ex: @fireplaceandgrill.com)</p>
      </div>

      {activeTab === 'edit' ? (
        <div>
          <p>
            <textarea
              className="w-100 h-2/3 bg-slate-700 text-white rounded-lg"
              id="informationDescInput"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              rows="10"
              cols="50"
            />
          </p>
        </div>
      ) : (
        <div className='preview bg-white' dangerouslySetInnerHTML={{ __html: inputValue }} />
      )}

      <p className='centered'>
        <button className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 mt-5 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold py-2.5 px-3 mb-2 transition hover:scale-105" value="save" onClick={saveInformation}>Save</button>
      </p>
    </div>
  );
}

export default ViewEditInformation;
