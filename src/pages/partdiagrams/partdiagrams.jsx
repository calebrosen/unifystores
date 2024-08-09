import { useEffect, useState } from 'react';

function PartDiagrams() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('http://127.0.0.1:8081/partDiagrams')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log('Fetch error:', err));
  }, []);

  return (
    
    <div id="partDiagramsContainer" className='subsectionContainer'>
    <p className='largeHeader'>SELECT A SUBSECTION</p>
      <div id="container">
        {data
          .sort((a, b) => a.subsection.localeCompare(b.subsection)) // alphabetically sorting
          .map((d, i) => (
            <div key={i} id={`${d.path}Section`} className='section'>
              <a href={d.path || '#'} target={d.path.includes('pushToStores') ? '_self' : '_blank'} className="noDecoration">
                <p className='sectionTitleHomePage'>{d.subsection}</p>
              </a>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default PartDiagrams;