import { useEffect, useState } from 'react';

function Dashboard() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/node/dashboard/mainDashboard`)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log('Fetch error:', err));
  }, []);
  return (
    <div>
      <div className="centered xlHeader">
      SELECT A SECTION
      </div>
      <div id="container">
        {data
          .sort((a, b) => a.section.localeCompare(b.section)) // alphabetically sorting
          .map((d, i) => (
            <div key={i}  id={`${d.path} Section`} className='section animated animatedFadeInUp fadeInUp'>
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