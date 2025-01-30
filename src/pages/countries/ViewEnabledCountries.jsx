import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../contexts/StoreContext';


function ViewEnabledCountries() {
    const [data, setData] = useState([]);
    const { selectedStore } = useContext(StoreContext);

    function fetchEnabledCountries() {
        fetch(`${process.env.REACT_APP_API_URL}/node/countries/viewEnabledCountries`)
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
            axios.post(`${process.env.REACT_APP_API_URL}/node/countries/disableCountry`, { selectedCountryID })
            .then(res => {
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
            <p className="text-neutral-200 text-6xl bold underline">Enabled Countries (Except USA)</p>
            <table className="mt-5">
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
                        <td><button  className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-2xl font-semibold py-2 px-3 me-2 mb-2 transition hover:scale-105" data-status={d.status} id={d.country_id} value={d.name} onClick={disableCountry}>Disable</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ViewEnabledCountries;