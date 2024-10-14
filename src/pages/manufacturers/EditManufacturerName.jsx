import axios from 'axios';
import React, { useEffect, useState } from 'react';

function EditPushManufacturerName() {
  const [data, setData] = useState([]);
 
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/node/manufacturers/viewEditManufacturers`)
      .then(res => res.json())
      .then(data => setData(data[0]))
      .catch(err => console.log('Fetch error:', err));
  }, []);

  const editManufacturerName = (manufacturerID, originalName) => {
    const inputID = `manufacturerID${manufacturerID}`;
    const editedName = document.getElementById(inputID).value;
    if (editedName != originalName) {
      const confirmPush = confirm(`Are you sure you want to change the name from ${originalName} (ID: ${manufacturerID}) to ${editedName}?`);
      if (confirmPush) {
        axios.post(`${process.env.REACT_APP_API_URL}/node/manufacturers/updateManufacturerName`, { manufacturerID, editedName })
          .then(res => {
            console.log(res);
            if (res.data[0][0]['success']) {
              alert(res.data[0][0]['success']);
            }
          })
          .catch(err => alert('Error:', err));
      }
    } else {
      alert("There's an input field, btw. Try changing that first.");
    }
  }

  return (
    <div id="manufacturersContainer" className='subsectionContainer'>
      <p className='xlHeader'>Edit Manufacturer Name</p>
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
                  id={`manufacturerID${d.manufacturer_id}`}
                  defaultValue={d.name}
                  name={d.name}
                  className='textBox1'
                />
              </td>
              <td>
                <button 
                  className='darkRedButtonInlineMD'
                  onClick={() => editManufacturerName(d.manufacturer_id, d.name)}>
                    Edit Name
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EditPushManufacturerName;
