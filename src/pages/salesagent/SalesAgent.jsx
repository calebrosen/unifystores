import { useEffect, useState } from 'react';

function SalesAgent() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/node/salesagents/getSalesagentSubsections`)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log('Fetch error:', err));
  }, []);

  return (
    
    <div id="salesAgentContainer" className='subsectionContainer'>
      <div className="text-center mb-12">
        <span className="inline-block font-sans bg-gradient-to-r from-cyan-800 to-slate-800 text-white font-medium py-6 px-8 rounded-xl text-6xl shadow-lg transform hover:scale-105 transition-transform duration-300">
          SELECT A SUBSECTION
        </span>
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
                <div className="py-4 px-4 font-mono bg-slate-700 border-neutral-600 border-1 rounded-3xl text-white text-2xl shadow-md hover:border-cyan-600 transition-all duration-300 transform hover:scale-105">
                  <p className="sectionTitleHomePage text-center text-white">
                    {d.subsection}
                  </p>
                </div>
              </a>
            </div>
          ))}
      </div>
    </div>
  );
}

export default SalesAgent;