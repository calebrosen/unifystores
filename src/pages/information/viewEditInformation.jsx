import axios from 'axios';
import { useEffect, useState } from 'react';
import LargeButton from '../../components/buttons/LargeButton';
import MediumButton from '../../components/buttons/MediumButton';
import BoldH1 from '../../components/headings/BoldH1';
import MediumTextarea from '../../components/textarea/MediumTextarea';

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

function loadInputBox(e) {
  const selected = e.target.value;
  const matched = information.find((element) => element.title === selected);
  setInputValue(decodeHtml(matched?.replaced));
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
      <div className="text-center">
        <BoldH1 text={"SELECT WHICH INFORMATION TO EDIT"}/>
        <select className="bg-slate-800 p-3 rounded-lg text-neutral-200 border-1 border-slate-700 placeholder:text-neutral-400 mt-10 max-w-md" id="selectInformation" onChange={loadInputBox}>
          <option value=""></option>
          {information.map((d, i) => (
            <option key={i} value={d.title}>
              {d.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-6">
        <MediumButton
          text={"Edit"}
          action={() => setActiveTab('edit')}
        />
        <MediumButton
          text={"Preview"}
          action={() => setActiveTab('preview')}
        />
      </div>
        <p className="text-3xl text-neutral-200 mt-5">Available placeholders are <span className="font-bold">&#123;WEBSITE&#125;</span> (Ex: FireplaceandGrill.com) and <span className="bold">&#123;EMAILDOMAIN&#125;</span> (Ex: @fireplaceandgrill.com)</p>
    

      {activeTab === "edit" ? (
        <div className="mt-3">
            <MediumTextarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
        </div>
      ) : (
        <div className="preview bg-white" dangerouslySetInnerHTML={{ __html: inputValue }} />
      )}

      <div className="text-center mt-6">
        <LargeButton
          text={"Save"}
          action={saveInformation}
        />
      </div>
    </div>
  );
}

export default ViewEditInformation;
