import axios from 'axios';
import React, { useEffect, useState } from 'react';

function ViewEditInformation() {
  const [information, setInformation] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState('edit');
  const [response, setResponse] = useState('');
  

  useEffect(() => {
    fetch('http://127.0.0.1:8081/viewEditInformation')
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
        axios.post('http://127.0.0.1:8081/saveInformation', { selectedInformation, inputValue })
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
        <p className='smHeader marginTop1rem'>
          SELECT WHICH INFORMATION TO LOAD
        </p>
        <select className='selectBox1' id="selectInformation" defaultValue="" onChange={loadInputBox}>
          <option value="" disabled></option>
          {information.map((d, i) => (
            <option key={i} value={d.title}>
              {d.title}
            </option>
          ))}
        </select>
      </div>

      <div className='tab-buttons marginTopAndBottom'>
        <button className='editPreviewButton' onClick={() => setActiveTab('edit')}>Edit</button>
        &nbsp;&nbsp;
        <button className='editPreviewButton' onClick={() => setActiveTab('preview')}>Preview</button>
        <p className='infoTextHelp'>Available placeholders are <span className='blackBold'>&#123;WEBSITE&#125;</span> (Ex: FireplaceandGrill.com) and <span className='blackBold'>&#123;EMAILDOMAIN&#125;</span> (Ex: @fireplaceandgrill.com)</p>
      </div>

      {activeTab === 'edit' ? (
        <div>
          <p>
            <textarea
              className='hugeInput'
              id="informationDescInput"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              rows="10"
              cols="50"
            />
          </p>
        </div>
      ) : (
        <div className='preview' dangerouslySetInnerHTML={{ __html: inputValue }} />
      )}

      <p className='centered'>
        <button className='saveButtonLG marginTop3rem' value="save" onClick={saveInformation}>Save</button>
      </p>
    </div>
  );
}

export default ViewEditInformation;
