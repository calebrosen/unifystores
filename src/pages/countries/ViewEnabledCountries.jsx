import axios from "axios";
import { useEffect, useState } from "react";
import BoldH1 from "../../components/headings/BoldH1";
import MediumButton from "../../components/buttons/MediumButton";

function ViewEnabledCountries() {
  const [data, setData] = useState([]);

  function fetchEnabledCountries() {
    fetch(
      `${process.env.REACT_APP_API_URL}/node/countries/viewEnabledCountries`
    )
      .then((res) => res.json())
      .then((data) => setData(data[0]))
      .catch((err) => console.log("Fetch error:", err));
  }
  useEffect(() => {
    fetchEnabledCountries();
  }, []);

  const disableCountry = (e) => {
    const selectedCountryID = e.target.id;
    const confirmEdit = confirm(
      "Are you sure you would like to set country ID " +
        selectedCountryID +
        " to status 0 on all stores?"
    );
    if (confirmEdit) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/node/countries/disableCountry`,
          { selectedCountryID }
        )
        .then((res) => {
          if (res.data[0][0]["success"]) {
            alert(res.data[0][0]["success"]);
          } else {
            alert("Something went wrong.");
          }
          console.log(res);
        })
        /*waiting to refresh due to async*/
        .then(setTimeout(fetchEnabledCountries, 2500))
        .catch((err) => console.log("Error:", err));
    }
  };

  return (
    <div className="text-center">
      <BoldH1 text={"Enabled Countries (Except USA)"} />
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
              <td>
                <MediumButton
                    id={d.country_id}
                    value={d.name}
                    action={disableCountry}
                    text={"Disable"}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewEnabledCountries;
