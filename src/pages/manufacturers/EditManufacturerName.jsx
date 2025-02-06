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
    <div id="manufacturersContainer" className='text-center'>
      <p className="text-neutral-200 text-5xl mt-5 font-bold underline">Edit Manufacturer Name</p>
      <table className='mt-5'>
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
                  className="bg-slate-700 p-2 text-neutral-900 rounded-lg h-100 text-white placeholder:text-neutral-300 text-4xl border-1 border-slate-700"
                />
              </td>
              <td>
                <button 
                  className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-3xl font-semibold p-2 transition hover:scale-105"
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
