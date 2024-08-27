import axios from 'axios';
import { useState } from 'react';
import exampleImage from '../../assets/img/attributeGroupExample.jpg';

const AddNewAttributeGroup = () => {
  const [attributeGroupName, setAttributeGroupName] = useState('');

  const updateAttributeGroupName = (e) => {
    setAttributeGroupName(e.target.value.trim());
  }
  
  const AddAttributeGroupAction = () => {
    if (attributeGroupName != '') {
      const confirmPush = confirm(`Are you sure you want to add "${attributeGroupName}" as an Attribute Group? They will be added to the local table and ALL stores.`);
      if (confirmPush) {
        axios.post('http://127.0.0.1:8081/addNewAttributeGroup', { attributeGroupName })
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
      alert("Input an attribute group name");
    }
  }

  return (
    <div>
      <div className='centered'>
        <p className='largeHeader marginTop2rem'>
          INPUT AN ATTRIBUTE GROUP NAME (e.g.: "Controls")
        </p>
        This will be the parent for the individual attributes. (e.g.: Remote Features is a child of the "Controls" attribute group)
        <div id="attributeGroupContainer" className='subsectionContainer'>
          <input className='inputBox1' onChange={updateAttributeGroupName}></input>
        </div>
        <div>
          <button className='darkRedButton marginTop4rem' onClick={AddAttributeGroupAction}>Add Attribute Group</button>
        </div>
        <div className='marginTop4rem smHeader'>
          Below are examples of attribute groups
        </div>
        <img src={exampleImage} className="exampleImage" alt="Example" />
      </div>
    </div>
  );
}

export default AddNewAttributeGroup;