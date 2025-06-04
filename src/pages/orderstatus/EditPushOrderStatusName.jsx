import axios from 'axios';
import React, { useEffect, useState } from 'react';
import MediumInput from '../../components/inputs/MediumInput';
import MediumButton from '../../components/buttons/MediumButton';
import BoldH1 from '../../components/headings/BoldH1';

function EditPushOrderStatusName() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/node/orders/viewEditOrderStatusName`)
      .then(res => res.json())
      .then(data => {
        // Initialize editable names per item
        const withInputs = data[0].map(d => ({
          ...d,
          editedName: d.name
        }));
        setData(withInputs);
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const handleInputChange = (order_status_id, newValue) => {
    setData(prev =>
      prev.map(d =>
        d.order_status_id === order_status_id ? { ...d, editedName: newValue } : d
      )
    );
  };

  const editOrderStatusName = (order_status_id, originalName, editedName) => {
    if (editedName.trim() === "" || editedName === originalName) {
      alert("Please change the input value before submitting.");
      return;
    }

    const confirmPush = confirm(
      `Are you sure you want to change the name from "${originalName}" (ID: ${order_status_id}) to "${editedName}"?`
    );

    if (!confirmPush) return;

    axios
      .post(`${process.env.REACT_APP_API_URL}/node/orders/updateOrderStatusName`, {
        order_status_id,
        editedName
      })
      .then(res => {
        if (res.data[0][0]?.success) {
          alert(res.data[0][0].success);
        }
      })
      .catch(err => {
        console.error('Error:', err);
        alert('There was an error updating the order status name.');
      });
  };

  return (
    <div className="text-center">
      <BoldH1 text="Edit Order Status Name" />
      <table className="mt-4 mx-auto">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.order_status_id}</td>
              <td>
                <MediumInput
                  id={`orderStatusID${d.order_status_id}`}
                  value={d.editedName}
                  onChange={e => handleInputChange(d.order_status_id, e.target.value)}
                />
              </td>
              <td>
                <MediumButton
                  text="Edit Name"
                  action={() => editOrderStatusName(d.order_status_id, d.name, d.editedName)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EditPushOrderStatusName;
