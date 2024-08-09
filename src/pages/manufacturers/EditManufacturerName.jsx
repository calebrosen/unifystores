import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../contexts/StoreContext';

function EditPushManufacturerName() {
  const [data, setData] = useState([]);
  const { selectedStore } = useContext(StoreContext);
  const [editedName, setEditedName] = useState('');
 
  useEffect(() => {
    fetch('http://127.0.0.1:8081/viewEditManufacturers')
      .then(res => res.json())
      .then(data => setData(data[0]))
      .catch(err => console.log('Fetch error:', err));
  }, []);

  const pushToStore = (e) => {
    if (selectedStore) {
      let manufacturerID = e.target.id;
      let name = e.target.value;
      const confirmPush = confirm('Are you sure you want to push ' + name + ' to ' + selectedStore + '?');
      if (confirmPush) {
        axios.post('http://127.0.0.1:8081/pushManufacturer', { selectedStore, manufacturerID })
        .then(res => {
            if (res.data[0][0]['success']) {
              alert(res.data[0][0]['success']);
            }
            console.log(res);
        })
        .catch(err => alert('Error:', err));
      }
    } else {
      alert('Try selecting a store first.');
    }
  }

  return (
    
    <div id="manufacturersContainer" className='subsectionContainer'>
      <table className='marginTop3rem'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Edit Name</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.manufacturer_id}</td>
              <td>
              <input
                    type="text"
                    placeholder="Code if ADMIN selected"
                    id="couponCodeField"
                    value={d.name}
                    className='textBoxCoupon'
                    onChange={(e) => setEditedName(e.target.value)}
                    />
                
                
                
                
                </td>
              <td>&nbsp;<button className='darkRedButtonInline' id={d.manufacturer_id} value={d.name} onClick={pushToStore}>Edit Nmae</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EditPushManufacturerName;