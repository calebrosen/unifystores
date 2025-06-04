import { useEffect, useState } from "react";
import AlternateBanner from "../../components/banners/AlternateBanner";
import SimpleBanner from '../../components/banners/SimpleBanner';

function Dashboard() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/node/dashboard/mainDashboard`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log("Fetch error:", err));
  }, []);
  return (
    <div id="dashboardContainer" className="text-center">
      <div className="text-center mb-12">
        <SimpleBanner text="Dashboard"/>
      </div>
      <div className="container flex flex-wrap justify-center mt-12 gap-12">
        {data
          .sort((a, b) => a.section.localeCompare(b.section)) // alphabetically sorting
          .map((d, i) => (
            <a href={d.path || "#"} className="no-underline hover:no-underline">
              <AlternateBanner text={d.section}/>
            </a>
          ))}
      </div>
    </div>
  );
}

export default Dashboard;
