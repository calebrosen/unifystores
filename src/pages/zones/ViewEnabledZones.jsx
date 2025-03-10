import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../contexts/StoreContext';


function ViewEnabledZones() {
    const [data, setData] = useState([]);
    const { selectedStore } = useContext(StoreContext);

    function fetchEnabledZones() {
        fetch(`${process.env.REACT_APP_API_URL}/node/zones/viewEnabledZones`)
        .then(res => res.json())
        .then(data => setData(data[0]))
        .catch(err => console.log('Fetch error:', err));
    }
    useEffect(() => {
        fetchEnabledZones();
    }, []);

    const disableZone = (e) => {
        const selectedZoneName = e.target.value;
        const selectedZoneID = e.target.id;
        const confirmEdit = confirm('Are you sure you would like to set ' + selectedZoneName + ' (ID: ' +  selectedZoneID + ') to status 0 on all stores?');
        if (confirmEdit) {
            axios.post(`${process.env.REACT_APP_API_URL}/node/zones/disableZone`, { selectedZoneID })
            .then(res => {
                if (res.data[0][0]['success']) {
                  alert(res.data[0][0]['success']);
                } else {
                  alert("Something went wrong.");
                }
                console.log(res);
            })
            /*waiting to refresh due to async*/
            .then(setTimeout(fetchEnabledZones,2500))
            .catch(err => console.log('Error:', err));
        }
    }

    return (
        <div id="zonesContainer" className='text-center'>
            <p className="text-6xl text-white font-bold underline">Enabled Zones (Except the 50 States)</p>
            <table className='mt-5'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Disable</th>
                    </tr>
                </thead>
                <tbody>
                {data.map((d, i) => (
                    <tr key={i}>
                        <td>{d.zone_id}</td>
                        <td>{d.name}</td>
                        <td>&nbsp;<button className='darkRedButtonInline' data-status={d.status} id={d.zone_id} value={d.name} onClick={disableZone}>Disable</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ViewEnabledZones;