import { useEffect, useState } from 'react';

function Dashboard() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('http://127.0.0.1:8081/sections')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log('Fetch error:', err));
  }, []);
  var temp = '';
  return (
    <div>
      <div className="centered xlHeader">
      SELECT A SECTION
      </div>
      <div id="container">
        {data
          .sort((a, b) => a.section.localeCompare(b.section)) // alphabetically sorting
          .map((d, i) => (
            <div key={i}  id={`${d.path} Section`} className='section'>
              <a href={d.path || '#'} className="noDecoration">
                <p className='sectionTitleHomePage'>{d.section}</p>
              </a>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Dashboard;