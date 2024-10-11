import axios from 'axios';
import React, { useEffect, useState } from 'react';

function EditCustomerGroupName() {
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
 
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/node/customers/viewEditCustomerGroupName`)
      .then(res => res.json())
      .then(data => setData(data[0]))
      .catch(err => console.log('Fetch error:', err));
  }, []);

  const updateName = (e) => {
    setName(e.target.value);
  }

  const editCustomerGroupName = (customerGroupID, originalName) => {
    if (name != originalName) {
      const confirmPush = confirm(`Are you sure you want to change the name from ${originalName} (ID: ${customerGroupID}) to ${name}?`);
      if (confirmPush) {
        axios.post(`${process.env.REACT_APP_API_URL}/node/customers/editCustomerGroupName`, { customerGroupID, name })
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
    <div id="customerGroupsContainer" className='subsectionContainer'>
      <p className='xlHeader'>Edit Customer Group Name</p>
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
              <td>{d.customer_group_id}</td>
              <td>
                <input
                  type="text"
                  id={`customerGroupID${d.customer_group_id}`}
                  defaultValue={d.name}
                  name={d.name}
                  className='textBox1'
                  onChange={updateName}
                />
              </td>
              <td>
                <button 
                  className='darkRedButtonInlineMD' 
                  onClick={() => editCustomerGroupName(d.customer_group_id, d.name)}>
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

export default EditCustomerGroupName;
