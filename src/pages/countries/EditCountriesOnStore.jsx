import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { StoreContext } from '../../contexts/StoreContext';

Modal.setAppElement('#root');

function EditCountriesOnStore() {
    const [countryID, setCountryID] = useState('');
    const [countryName, setCountryName] = useState('');
    const [data, setData] = useState([]);
    const [countryStatus, setCountryStatus] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); 
    const { selectedStore } = useContext(StoreContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        if (selectedStore != '') {
            setIsModalOpen(true);
        } else {
            alert('Select a store first');
        }
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        fetch('http://127.0.0.1:8081/getCountries')
            .then(res => res.json())
            .then(data => setData(data[0]))
            .catch(err => console.log('Fetch error:', err));
    }, []);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredData = data.filter((d) => 
        d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const editStatusOnStore = (e) => {
        /*
        need to declare variables first due to async
        setCountryName(e.target.value);
        setCountryID(e.target.id);
        setCountryStatus(e.target.dataset.status);
        */

        const selectedCountryName = e.target.value;
        const selectedCountryID = e.target.id;
        const selectedCountryStatus = e.target.dataset.status;
        
        setCountryName(selectedCountryName);
        setCountryID(selectedCountryID);
        setCountryStatus(selectedCountryStatus);
        
        if (selectedCountryID && selectedCountryName && selectedStore !== '') {
            setIsModalOpen(true);
        } else {
            alert('You forgot to select something');
        }
    }

    const editStatusOnStoreAction = (e) => {
        e.preventDefault();
        const selectedStatus = e.target.querySelector('select').value;
        const confirmEdit = confirm('Are you sure you would like to set ' + countryName + ' to status ' + selectedStatus + ' on ' + selectedStore + '?');

        if (confirmEdit) {
            axios.post('http://127.0.0.1:8081/editCountryOnStore', { selectedStore, countryID, selectedStatus })
            .then(res => {
                console.log(res);
                if (res.data[0][0]['success']) {
                  alert(res.data[0][0]['success']);
                } else {
                  alert("Something went wrong.");
                }
                console.log(res);
            })
            .catch(err => console.log('Error:', err));
        }
    }

    return (
        <div id="countriesContainer" className='subsectionContainer'>
            {/*searchable input */}
            <input 
                className='marginTop3rem inputBox1' 
                label='Search for Countries' 
                placeholder='Search for Countries'
                value={searchQuery} 
                onChange={handleSearch} 
            />
            <table className='marginTop3rem'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                {filteredData.map((d, i) => (
                    <tr key={i}>
                        <td>{d.country_id}</td>
                        <td>{d.name}</td>
                        <td>&nbsp;<button className='darkRedButtonInline' data-status={d.status} id={d.country_id} value={d.name} onClick={editStatusOnStore}>Edit</button></td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Edit Country"
                className="Modal"
                overlayClassName="Overlay"
            >
            {countryID && (
            <form onSubmit={editStatusOnStoreAction} className="editCouponForm">
                <p className='mediumHeader'>Change Status of {countryName}</p>
                <select type="text" defaultValue={countryStatus} className='selectBox2 marginBottom2rem'>
                    <option value='1'>Enabled</option>
                    <option value='0'>Disabled</option>
                </select>
                <div className="spaceBetween">
                <button type="submit" className='saveButton'>Save</button>
                <button type="button" onClick={closeModal} className='closeButton'>Close</button>
                </div>
            </form>
            )}
        </Modal>


        </div>
    );
}

export default EditCountriesOnStore;