import axios from 'axios';
import React, { useEffect, useState } from 'react';
import BoldH1 from '../../components/headings/BoldH1';
import MediumButton from '../../components/buttons/MediumButton';
import mediumInput from '../../components/inputs/MediumInput';
import MediumInput from '../../components/inputs/MediumInput';



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
      <BoldH1 text={"Edit Stock Status Name"} />
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
                <MediumInput
                  defaultValue={d.name}
                  id={`stockStatusID${d.stock_status_id}`}
                  name={d.name}
                />
              </td>
              <td>
                <MediumButton
                  text={"Edit Name"}
                  action={() => editStockStatusName(d.stock_status_id, d.name)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EditPushStockStatusName;
