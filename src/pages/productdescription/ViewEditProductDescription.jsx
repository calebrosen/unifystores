import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import isAuthenticated from '../../components/auth';

Modal.setAppElement('#root');

function ViewEditProductDescription() {
  const [productDescription, setProductDescription] = useState([]);
  const [activeTab, setActiveTab] = useState('preview');
  const [searchQuery, setSearchQuery] = useState('');
  const [descriptions, setDescriptions] = useState([]);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [selectedMPN, setSelectedMPN] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [descriptionValues, setDescriptionValues] = useState({});
  const [buttonStatus, setButtonStatus] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/node/products/viewEditProductDescription`)
      .then(res => res.json())
      .then(data => setProductDescription(data[0]))
      .catch(err => console.log('Fetch error:', err));
  }, []);
  
  function fetchProductDescription(difID) {
    axios.post(`${process.env.REACT_APP_API_URL}/node/products/getProductDescDifferences`, { difID })
      .then(res => {
        if (res.data[0]) {
          const fetchedDescriptions = res.data[0];
          setDescriptions(fetchedDescriptions);

          const initialValues = {};
          fetchedDescriptions.forEach(d => {
            initialValues[d.store_id] = d.product_description;
          });
          setDescriptionValues(initialValues);
        }
      })
      .catch(err => console.error('Error:', err));
  }

  const openModal = (e) => {
    const difIDTemp = e.target.id;
    const tempSelectedMPN = e.target.getAttribute('data-custom-mpn');
    const tempSelectedModel = e.target.getAttribute('data-custom-model');
    setSelectedMPN(tempSelectedMPN);
    setSelectedModel(tempSelectedModel);
    fetchProductDescription(difIDTemp);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setSelectedMPN('');
    setSelectedModel('');
    setDescriptions([]);
  }

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = productDescription.filter((d) =>
    d.mpn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const saveProductDescription = (storeId) => {
    const CheckAuth = isAuthenticated();
    if (CheckAuth == true) {
      const descriptionToSave = descriptionValues[storeId];
      const confirmSave = confirm('Are you sure you want to save this description?');
      if (confirmSave) {
        //disabling all buttons
        DisableButtons();

        //posting
        axios.post(`${process.env.REACT_APP_API_URL}/node/products/saveProductDescription`, { storeId, selectedMPN, selectedModel, descriptionToSave})
        .then(res => {
          if (res.data[0][0]['success']) {
            alert(`successfully updated ${selectedMPN}`);
          } else {
            alert("Something went wrong.");
          }
          //enabling all buttons
          EnableButtons();
          console.log(res);
        })
        .catch(err => console.error('Error saving description:', err));
      }
    } else {
      alert('User is logged out. Please refresh to log back in.');
    }
  };

  const DisableButtons = () => {
    setButtonStatus('disabled');
  }

  const EnableButtons = () => {
    setButtonStatus('');
  }

  const handleDescriptionChange = (storeId, value) => {
    setDescriptionValues(prev => ({
      ...prev,
      [storeId]: value
    }));
  };

  const refetchContent = () => {
    const confirmRefetch1 = confirm('Are you sure you want to refetch the data?');
    if (confirmRefetch1) {
      const confirmRefetch2 = confirm('Are you really sure you want to refetch the data?');
      if (confirmRefetch2) {
        const confirmRefetch3 = confirm('Are you really really sure you want to refetch the data?');
        if (confirmRefetch3) {
          alert('This will take a while... Hang in there.');
          axios.post(`${process.env.REACT_APP_API_URL}/node/products/refetchProductDescriptions`)
          .then(res => {
            if (res.data[0][0]['success']) {
              alert(res.data[0][0]['success']);
            } else {
              alert("Something went wrong.");
            }
            console.log(res);
          })
          .catch(err => console.error('Error saving description:', err));
        }
      }
    }
  }

  return (
    <div>
      <div className='centered'>
        <button className='darkRedButton' onClick={refetchContent}>Refetch content</button>
      </div>
      <div className='centeredContainer marginBottom4rem'>
        <input
          className='marginTop3rem inputBox1'
          label='Search by MPN'
          placeholder='Search by MPN'
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <table className='marginTop3rem'>
        <thead>
          <tr>
            <th>Model</th>
            <th>MPN</th>
            <th>Different Versions</th>
            <th>Category</th>
            <th>View/Edit</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((d, i) => (
            <tr key={i}>
              <td>{d.model}</td>
              <td>{d.mpn}</td>
              <td>{d.versions}</td>
              <td>{d.category}</td>
              <td>
                <button
                  data-custom-model={d.model}
                  data-custom-mpn={d.mpn}
                  id={d.dif_id}
                  disabled={buttonStatus}
                  className='darkRedButtonInlineMD'
                  onClick={openModal}>
                    View/Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Description Modal"
      >
        <div>
          <div className='tab-buttons marginTopAndBottom'>
            <button className='editPreviewButton' onClick={() => setActiveTab('edit')}>Edit</button>
            &nbsp;&nbsp;
            <button className='editPreviewButton' onClick={() => setActiveTab('preview')}>Preview</button>
            &nbsp;&nbsp;
            {descriptions.length > 0 && (
              <span className='mdSpan'>{descriptions[0].category} | {descriptions[0].mpn} |  {descriptions[0].product_name}</span>
              // <span className='mdSpan'>Product Name: {descriptions[0].product_name}</span>
            )}
          </div>
          <div>
            <table>
              <thead>
                <tr>
                  <th className='tinyTh'>Store</th>
                  <th className='tinyTh'>Update</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {descriptions.map((d, i) => (
                  <tr key={i}>
                    <td className='bold'>&nbsp;{d.store_id}</td>
                    <td>
                      <button
                        className='darkRedButtonInline'
                        onClick={() => saveProductDescription(d.store_id)}>
                        Use
                      </button>
                    </td>
                    <td>
                      {activeTab === 'edit' ? (
                        <textarea
                          value={descriptionValues[d.store_id]}
                          className='textAreaAuto'
                          onChange={(e) => handleDescriptionChange(d.store_id, e.target.value)}
                        />
                      ) : (
                        <span className='preview' dangerouslySetInnerHTML={{ __html: descriptionValues[d.store_id] }} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ViewEditProductDescription;
