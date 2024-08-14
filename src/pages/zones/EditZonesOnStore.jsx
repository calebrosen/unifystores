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
        fetch('http://127.0.0.1:8081/getZones')
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
            axios.post('http://127.0.0.1:8081/editZonesOnStore', { selectedStore, zoneID, selectedStatus })
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
        <div id="zonesContainer" className='subsectionContainer'>
            {/*searchable input */}
            <input 
                className='marginTop3rem inputBox1' 
                label='Search for Zones' 
                placeholder='Search for Zones'
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
                        <td>{d.zone_id}</td>
                        <td>{d.name}</td>
                        <td>&nbsp;<button className='darkRedButtonInline' data-status={d.status} id={d.zone_id} value={d.name} onClick={editStatusOnStore}>Edit</button></td>
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
                <p className='mediumHeader'>Change Status of {zoneName}</p>
                <select type="text" defaultValue={zoneStatus} className='selectBox2 marginBottom2rem'>
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

export default EditZonesOnStore;