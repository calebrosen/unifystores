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

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/node/countries/getCountries`)
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
            axios.post(`${process.env.REACT_APP_API_URL}/node/countries/editCountryOnStore`, { selectedStore, countryID, selectedStatus })
            .then(res => {
                console.log(res);
                if (res.data[0][0]['success']) {
                  alert(res.data[0][0]['success']);
                  OpenAdminURL();
                } else {
                  alert("Something went wrong.");
                }
                console.log(res);
            })
            .catch(err => console.log('Error:', err));
        }
    }

    const OpenAdminURL = () => {
        var stores = document.querySelectorAll("input[name='storeSelection']");
        stores.forEach((store) => {
          if (store.checked) {
            const adminURLForStore = store.getAttribute("data-custom-admin-url");
            window.open(adminURLForStore, "_blank");
          }
        })
    }

    return (
        <div id="countriesContainer" className='subsectionContainer'>
            {/*searchable input */}
            <input 
                className="bg-slate-700 p-3 mt-8 rounded-lg text-neutral-200 text-4xl"
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
                        <td>&nbsp;<button className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-2xl font-semibold py-2 px-3 me-2 mb-2 transition hover:scale-105" data-status={d.status} id={d.country_id} value={d.name} onClick={editStatusOnStore}>Edit</button></td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Edit Country"
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-[500px] bg-slate-700 text-neutral-200 p-5 rounded-lg shadow-lg z-50"
                overlayClassName="Overlay"
            >
            {countryID && (
            <form onSubmit={editStatusOnStoreAction} className="editCouponForm">
                <p className="text-4xl font-medium text-neutral-200">Change Status of {countryName}</p>
                <select type="text" defaultValue={countryStatus} className="bg-slate-800 text-neutral-200 rounded-lg my-5 text-3xl p-2">
                    <option value='1'>Enabled</option>
                    <option value='0'>Disabled</option>
                </select>
                <div className="flex justify-between">
                <button type="submit" className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-3xl font-semibold p-3 me-2 mb-2 transition hover:scale-105">Save</button>
                <button type="button" onClick={closeModal} className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-3xl font-semibold p-3 me-2 mb-2 transition hover:scale-105">Close</button>
                </div>
            </form>
            )}
        </Modal>


        </div>
    );
}

export default EditCountriesOnStore;