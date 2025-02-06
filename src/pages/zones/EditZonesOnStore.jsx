import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { StoreContext } from '../../contexts/StoreContext';

Modal.setAppElement('#root');

function EditZonesOnStore() {
    const [zoneID, setZoneID] = useState('');
    const [zoneName, setZoneName] = useState('');
    const [data, setData] = useState([]);
    const [zoneStatus, setZoneStatus] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); 
    const { selectedStore } = useContext(StoreContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/node/zones/getZones`)
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
        const selectedZoneName = e.target.value;
        const selectedZoneID = e.target.id;
        const selectedZoneStatus = e.target.dataset.status;
        
        setZoneName(selectedZoneName);
        setZoneID(selectedZoneID);
        setZoneStatus(selectedZoneStatus);
        
        if (selectedZoneID && selectedZoneName && selectedStore !== '') {
            setIsModalOpen(true);
        } else {
            alert('You forgot to select something');
        }
    }

    const editStatusOnStoreAction = (e) => {
        e.preventDefault();
        const selectedStatus = e.target.querySelector('select').value;
        const confirmEdit = confirm('Are you sure you would like to set ' + zoneName + ' to status ' + selectedStatus + ' on ' + selectedStore + '?');

        if (confirmEdit) {
            axios.post(`${process.env.REACT_APP_API_URL}/node/zones/editZonesOnStore`, { selectedStore, zoneID, selectedStatus })
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
        <div id="zonesContainer" className='text-center'>
            {/*searchable input */}
            <input 
                className="bg-slate-700 p-2 text-neutral-900 rounded-lg h-100 mt-4 text-white placeholder:text-neutral-300 text-4xl border-1 border-slate-700"
                label='Search for Zones' 
                placeholder='Search for Zones'
                value={searchQuery} 
                onChange={handleSearch} 
            />
            <table className='mt-5'>
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
                        <td>{d.zone_id}</td>
                        <td>{d.name}</td>
                        <td>&nbsp;<button className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 text-white focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-3xl font-semibold p-2 transition hover:scale-105" data-status={d.status} id={d.zone_id} value={d.name} onClick={editStatusOnStore}>Edit</button></td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Edit Zone"
                className="Modal"
                overlayClassName="Overlay"
            >
            {zoneID && (
            <form onSubmit={editStatusOnStoreAction} className="editCouponForm">
                <p className="text-4xl text-white font-bold underline mb-4">Change Status of {zoneName}</p>
                <select type="text" defaultValue={zoneStatus} className="bg-slate-600 my-4 p-2 text-neutral-900 rounded-lg h-100 mt-4 text-white placeholder:text-neutral-300 text-3xl border-1 border-slate-700">
                    <option value='1'>Enabled</option>
                    <option value='0'>Disabled</option>
                </select>
                <div className="flex justify-between mt-4">
                <button type="submit" className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-3xl font-semibold py-2 px-3 transition hover:scale-105">Save</button>
                <button type="button" onClick={closeModal} className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-3xl font-semibold py-2 px-3 transition hover:scale-105">Close</button>
                </div>
            </form>
            )}
        </Modal>


        </div>
    );
}

export default EditZonesOnStore;