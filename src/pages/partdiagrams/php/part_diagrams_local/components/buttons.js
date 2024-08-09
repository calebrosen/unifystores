
function Buttons({ handleButtonClick }) {
  return (
    <div className="text-center">
      <div className="dropdown-container">
        <div className="dropdown">
          <label htmlFor="fmg-dropdown">Fire Magic Grills:</label>
          <select id="fmg-dropdown" onChange={(e) => handleButtonClick(e, e.target.value)}>
            <option value="">Select a model</option>
            <option value="e660i">E660i</option>
            <option value="e790i">E790i</option>
            <option value="e1060i">E1060i</option>
            <option value="e660s">E660S</option>
            <option value="e790s">E790S</option>
            <option value="e1060s">E1060S</option>
            <option value="a430i">A430i</option>
            <option value="a540i">A540i</option>
            <option value="a660i">A660i</option>
            <option value="a790i">A790i</option>
            <option value="a830i">A830i</option>
            <option value="a430s">A430s</option>
            <option value="a540s">A540s</option>
            <option value="a660s">A660s</option>
            <option value="a830s">A830s</option>
            <option value="charcoal22">22-SC01C</option>
            <option value="firemasterCountertop3324">Firemaster 30-inch</option>
            <option value="firemasterCountertop3329">Firemaster 23-inch</option>
            <option value="liftAFire3334">Lift-A-Fire 30-inch</option>
            <option value="liftAFire3339">Lift-A-Fire 23-inch</option>
            <option value="c430i">C430i</option>
            <option value="c540i">C540i</option>
            <option value="c650i">C650i</option>
            <option value="cm430i">CM430i</option>
            <option value="cm540i">CM540i</option>
            <option value="cm650i">CM650i</option>
            <option value="c430sp">C430s</option>
            <option value="e251s">E251s</option>
            <option value="e251t">E251t</option>
            {/* Add other Fire Magic Grill options here */}
          </select>
        </div>
        <div className="dropdown">
          <label htmlFor="aog-dropdown">American Outdoor Grill:</label>
          <select id="aog-dropdown" onChange={(e) => handleButtonClick(e, e.target.value)}>
            <option value="">Select a model</option>
            <option value="lseries24">L Series 24"</option>
            <option value="lseries30">L Series 30"</option>
            <option value="lseries36">L Series 36"</option>
            <option value="lseries24c">L Series 24" Portable</option>
            <option value="lseries30c">L Series 30" Portable</option>
            <option value="lseries36c">L Series 36" Portable</option>
            <option value="lseries24pm">L Series 24" Post Mount</option>
            <option value="tseries24">T Series 24"</option>
            <option value="tseries30">T Series 30"</option>
            <option value="tseries36">T Series 36"</option>
            <option value="tseries24c">T Series 24" Portable</option>
            <option value="tseries30c">T Series 30" Portable</option>
            <option value="tseries36c">T Series 36" Portable</option>
            <option value="tseries24pm">T Series 24" Post Mount</option>
            <option value="lseriesSideburner">L Series Double Side Burner</option>
            <option value="tseriesSideburner">T Series Double Side Burner</option>
            <option value="aogSingleSideburner">Single Side Burner</option>
            {/* Add other American Outdoor Grill options here */}
          </select>
        </div>
        <div className="dropdown">
          <label htmlFor="legacy-dropdown">Legacy Grills:</label>
          <select id="legacy-dropdown" onChange={(e) => handleButtonClick(e, e.target.value)}>
            <option value="">Select a model</option>
            <option value="r34s1s1">Regal I Countertop Series 34</option>
            <option value="regal1">Regal I Gourmet Series 14</option>
            <option value="regal2">Regal II Gourmet Series 15</option>
            <option value="magnumPortable">Regal Magnum</option>
            <option value="series11">Gourmet Series 11</option>
            <option value="deluxeClassic">Classic Series 61</option>
            <option value="d3cs1s1">Gourmet 3C Series</option>
            <option value="deluxe31">Classic 31 Series</option>
            <option value="c3132s">Custom I Gourmet</option>
            <option value="custom2">Custom II Gourmet</option>
            <option value="C2">Custom II Classic</option>
            <option value="series12">Series 12</option>
            <option value="series13">Series 13</option>
            <option value="monarch1b">Monarch Gourmet</option>
            <option value="monarchBuiltin">Monarch Magnum</option>
            <option value="monarchPortable">Monarch Magnum Portable</option>
            <option value="elite50Builtin">Elite 50 Gourmet</option>
            <option value="elite50Portable">Elite 50 Portable</option>
            <option value="eliteMagnumPortable">Elite Magnum Portable</option>
            <option value="eliteMagnumPowerburner">Elite Magnum with Power Burner</option>
            <option value="eliteMagnumDoubleburner">Elite Magnum with Double Side Burner</option>
            {/* Add other Legacy Grill options here */}
          </select>
        </div>
        <div className="dropdown">
          <label htmlFor="sidecooker-dropdown">Side Cookers:</label>
          <select id="sidecooker-dropdown" onChange={(e) => handleButtonClick(e, e.target.value)}>
            <option value="">Select a model</option>
            <option value="echelonSideburner">Echelon Side Burner</option>
            <option value="echelonPowerburner">Echelon Power Burner</option>
            <option value="echelonSearing">Echelon Searing</option>
            <option value="E660i-0">Echelon Gourmet Griddle</option>
            <option value="auroraSideburner">Aurora Side Burner</option>
            <option value="auroraPowerburner">Aurora Power Burner</option>
            <option value="auroraSearing">Aurora Searing</option>
            <option value="choiceSideburner">Choice Side Burner</option>
            <option value="gourmetPowerburner">Gourmet Power Burner</option>
            <option value="gourmetSearingStation">Gourmet Searing Station</option>
            {/* Add other Side Cookers options here */}
          </select>
        </div>
      </div>
    </div>
  );
}

