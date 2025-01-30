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
<div className="container mx-auto px-6">
<div className="text-center mb-12">
  <span className="inline-block ns bg-gradient-to-r from-cyan-800 to-slate-800 text-neutral-200 font-medium py-6 px-8 rounded-xl text-7xl shadow-lg transform hover:scale-105 transition-all duration-300">
    Select a Section
  </span>
</div>



  <div className="grid grid-cols-3 justify-evenly mt-12 gap-8">
    {data
      .sort((a, b) => a.section.localeCompare(b.section)) // alphabetically sorting
      .map((d, i) => (
        <div key={i} id={`${d.path} Section`} className='flex items-stretch'>
          <a href={d.path || '#'} className="block w-full no-underline hover:no-underline">
            <div className="py-7 px-7 bg-slate-700 border-neutral-600 border-1 rounded-3xl text-3xl shadow-md hover:text-neutral-200 hover:border-cyan-600 transition-all duration-300 transform hover:scale-105">
              <p className="sectionTitleHomePage text-center text-white opacity-90">{d.section}</p>
            </div>
          </a>
        </div>
      ))}
  </div>
</div>

  );
}

export default Dashboard;