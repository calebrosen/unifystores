import { useEffect, useState } from 'react';

function CustomerGroups() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/node/customers/getCustomerGroupSubsections`)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log('Fetch error:', err));
  }, []);

  return (
    
    <div id="customerGroupsContainer" className='subsectionContainer'>
    <p className='largeHeader'>SELECT A SUBSECTION</p>
      <div id="container">
        {data
          .sort((a, b) => a.subsection.localeCompare(b.subsection)) // alphabetically sorting
          .map((d, i) => (
            <div key={i}  id={`${d.path}Section`} className='section'>
              <a href={d.path || '#'} className="noDecoration">
                <p className='sectionTitleHomePage'>{d.subsection}</p>
              </a>
            </div>
          ))}
      </div>
    </div>
  );
}

export default CustomerGroups;