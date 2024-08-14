import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../contexts/StoreContext';


function ViewEnabledCountries() {
    const [data, setData] = useState([]);
    const { selectedStore } = useContext(StoreContext);

    function fetchEnabledCountries() {
        fetch('http://127.0.0.1:8081/viewEnabledCountries')
        .then(res => res.json())
        .then(data => setData(data[0]))
        .catch(err => console.log('Fetch error:', err));
    }
    useEffect(() => {
        fetchEnabledCountries();
    }, []);

    const disableCountry = (e) => {
        const selectedCountryName = e.target.value;
        const selectedCountryID = e.target.id;
        const confirmEdit = confirm('Are you sure you would like to set ' + selectedCountryName + ' (ID: ' +  selectedCountryID + ') to status 0 on all stores?');
        if (confirmEdit) {
            axios.post('http://127.0.0.1:8081/disableCountry', { selectedCountryID })
            .then(res => {
                console.log(res);
                if (res.data[0][0]['success']) {
                  alert(res.data[0][0]['success']);
                } else {
                  alert("Something went wrong.");
                }
                console.log(res);
            })
            /*waiting to refresh due to async*/
            .then(setTimeout(fetchEnabledCountries,2500))
            .catch(err => console.log('Error:', err));
        }
    }

    return (
        <div id="countriesContainer" className='subsectionContainer'>
            <p className='xlHeader'>Enabled Countries</p>
            <table className='marginTop3rem'>
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
                        <td>{d.country_id}</td>
                        <td>{d.name}</td>
                        <td>&nbsp;<button className='darkRedButtonInline' data-status={d.status} id={d.country_id} value={d.name} onClick={disableCountry}>Disable</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ViewEnabledCountries;