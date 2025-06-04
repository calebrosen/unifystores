import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../contexts/StoreContext';
import AlternateBanner from '../banners/AlternateBanner';

function StoresRadio({ children }) {
  const [data, setData] = useState([]);
  const { selectedStore, setSelectedStore } = useContext(StoreContext); // use context

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/node/stores/getStores`)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log('Fetch error:', err));
  }, []);

  const handleStoreChange = (event) => {
    setSelectedStore(event.target.value);
  };

  return (
    <div>
      <AlternateBanner text="SELECT STORE" size={"text-5xl"} />
      <div className="flex flex-row gap-7 justify-content-center mt-6 mb-8" id="storesRadioInner">
      {
        data
          .sort((a, b) => a.ms_short_name.localeCompare(b.ms_short_name)) // alphabetically sorting
          .map((d, i) => (
            <span key={i}>
              <input
                type="radio"
                name="storeSelection"
                value={d.ms_short_name}
                data-custom-url={d.ms_url}
                data-custom-admin-url={d.ms_admin_url}
                id={`select${d.ms_short_name}`}
                checked={selectedStore === d.ms_short_name}
                onChange={handleStoreChange}
              />
              <label htmlFor={`select${d.ms_short_name}`} className="text-neutral-200 mx-2 text-[2.35rem]"> {d.ms_short_name} </label>
            </span>
          ))
      }
      </div>
      {children}
    </div>
  );
}

export default StoresRadio;
