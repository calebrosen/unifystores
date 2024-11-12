'use strict';

const domain = window.location.host;

function App() {
  const [selectedModel, setSelectedModel] = React.useState([]);
  const [parts, setParts] = React.useState([]);


  const getModel = (model) => {
    let url = `http://${domain}/unify/src/pages/partdiagrams/php/part_diagrams_local/php/get_model.php?model=${model}`;
    console.log(url);
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        setSelectedModel(result);
        if (result.length > 0) {
          getParts(result[0].model_id);
        } else {
          setParts([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching model data:", err);
      });
  };

  const getParts = (model_id) => {
    let url = `http://${domain}/unify/src/pages/partdiagrams/php/part_diagrams_local/php/get_parts.php?model_id=${model_id}`;
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        setParts(result);
      })
      .catch((err) => {
        console.error("Error fetching parts data:", err);
      });
  };

  const handleButtonClick = (e, model) => {
    e.preventDefault();
    getModel(model);
  };

  return (
    <>
      <Buttons handleButtonClick={handleButtonClick} />
      {selectedModel.length > 0 || parts.length > 0 ? (
        <Exploded_view model={selectedModel} parts={parts} />
      ) : (
        <div className="no-model">No model selected</div>
      )}
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
