import { useEffect, useState } from 'react';
import SimpleBanner from '../../components/banners/SimpleBanner';
import AlternateBanner from '../../components/banners/AlternateBanner';

function Coupons() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/node/coupons/getSubsections`)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log('Fetch error:', err));
  }, []);

  return (
    
    <div id="couponContainer" className='text-center'>
      <div className="text-center mb-12">
        <SimpleBanner text="Coupons" />
      </div>
      <div className="flex flex-wrap justify-center mt-12 gap-12">
        {data
          .sort((a, b) => a.subsection.localeCompare(b.subsection)) // alphabetically sorting
          .map((d, i) => (
            <div key={i} id={`${d.path}Section`}>
              <a
                href={d.path || "#"}
                className="block w-full no-underline hover:no-underline"
              >
                <AlternateBanner
                  text={d.subsection}
                />
              </a>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Coupons;