import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

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

  useEffect(() => {
    fetch('http://127.0.0.1:8081/viewEditProductDescription')
      .then(res => res.json())
      .then(data => setProductDescription(data[0]))
      .catch(err => console.log('Fetch error:', err));
  }, []);

  function fetchProductDescription(difID) {
    axios.post('http://127.0.0.1:8081/getProductDescDifferences', { difID })
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
    setSelectedMPN(e.target.getAttribute('data-custom-mpn'));
    setSelectedModel(e.target.getAttribute('data-custom-model'));
    fetchProductDescription(difIDTemp);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = productDescription.filter((d) => 
    d.mpn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const saveProductDescription = (storeId) => {
    const descriptionToSave = descriptionValues[storeId];
    // console.group("Logging");
    // console.log(storeId);
    // console.log(selectedMPN);
    // console.log(selectedModel);
    // console.log(descriptionToSave);
    // console.groupEnd();
    const confirmSave = confirm('Are you sure you want to save this description?');
    if (confirmSave) {
      axios.post('http://127.0.0.1:8081/saveProductDescription', { storeId, selectedMPN, selectedModel, descriptionToSave})
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
  };

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
          axios.post('http://127.0.0.1:8081/refetchProductDescriptions')
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
        contentLabel="Example Modal"
      >
        <div>
          <div className='tab-buttons marginTopAndBottom'>
            <button className='editPreviewButton' onClick={() => setActiveTab('edit')}>Edit</button>
            &nbsp;&nbsp;
            <button className='editPreviewButton' onClick={() => setActiveTab('preview')}>Preview</button>
            &nbsp;&nbsp;
            {descriptions.length > 0 && (
              <span className='mdSpan'>{descriptions[0].category}| {descriptions[0].mpn} |  {descriptions[0].product_name}</span>
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
