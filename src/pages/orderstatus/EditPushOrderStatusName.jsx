import axios from 'axios';
import React, { useEffect, useState } from 'react';

function EditPushOrderStatusName() {
  const [data, setData] = useState([]);
 
  useEffect(() => {
    fetch('http://127.0.0.1:8081/viewEditOrderStatusName')
      .then(res => res.json())
      .then(data => setData(data[0]))
      .catch(err => console.log('Fetch error:', err));
  }, []);

  const editOrderStatusName = (order_status_id, originalName) => {
    const inputID = `orderStatusID${order_status_id}`;
    const editedName = document.getElementById(inputID).value;
    if (editedName != originalName) {
      const confirmPush = confirm(`Are you sure you want to change the name from ${originalName} (ID: ${order_status_id}) to ${editedName}?`);
      if (confirmPush) {
        axios.post('http://127.0.0.1:8081/updateOrderStatusName', { order_status_id, editedName })
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
    <div id="orderStatusContainer" className='subsectionContainer'>
      <p className='xlHeader'>Edit Order Status Name</p>
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
              <td>{d.order_status_id}</td>
              <td>
                <input
                  type="text"
                  id={`orderStatusID${d.order_status_id}`}
                  defaultValue={d.name}
                  name={d.name}
                  className='textBox1'
                />
              </td>
              <td>
                <button 
                  className='darkRedButtonInlineMD' 
                  onClick={() => editOrderStatusName(d.order_status_id, d.name)}>
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

export default EditPushOrderStatusName;
