import axios from 'axios';
import React, { useEffect, useState } from 'react';

function EditPushStockStatusName() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/node/stockstatus/viewEditStockStatusName`)
      .then(res => res.json())
      .then(data => setData(data[0]))
      .catch(err => console.log('Fetch error:', err));
  }, []);

  const editStockStatusName = (stock_status_id, originalName) => {
    const inputID = `stockStatusID${stock_status_id}`;
    const editedName = document.getElementById(inputID).value;
    if (editedName != originalName) {
      const confirmPush = confirm(`Are you sure you want to change the name from ${originalName} (ID: ${stock_status_id}) to ${editedName}?`);
      if (confirmPush) {
        axios.post(`${process.env.REACT_APP_API_URL}/node/stockstatus/updateStockStatusName`, { stock_status_id, editedName })
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
    <div id="stockStatusContainer" className='text-center'>
      <p className="text-6xl font-bold underline text-white">Edit Stock Status Name</p>
      <table className="mt-5">
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
              <td>{d.stock_status_id}</td>
              <td>
                <input
                  type="text"
                  id={`stockStatusID${d.stack_status_id}`}
                  defaultValue={d.name}
                  name={d.name}
                  className="bg-slate-700 p-2 text-neutral-900 rounded-lg h-100 text-white placeholder:text-neutral-300 text-4xl border-1 border-slate-700"
                />
              </td>
              <td>
                <button 
                  className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-3xl font-semibold p-2 transition hover:scale-105"
                  onClick={() => editStockStatusName(d.stock_status_id, d.name)}>
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

export default EditPushStockStatusName;
