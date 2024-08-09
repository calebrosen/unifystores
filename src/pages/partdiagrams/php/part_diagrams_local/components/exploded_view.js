'use strict';

function Exploded_view({ model, parts }) {
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  return (
    <div>
      {!model ? <div className="no-model">No model selected</div> :
        <div>
          <div className="grillName"><span>{model[0].model_name}</span></div>
          <div className="imageMap__container">
            <div class="ribbon ribbon-top-left"><span>{model[0].model_type}</span></div>
            <img className="img-thumbnail" id="explodedImage" src={model[0].model_img_src} alt="Exploded View" />
            {parts.map((part, index) => {
              return (
                <div className="markers" style={{ gridColumnStart: part.grid_column_start, gridColumnEnd: part.grid_column_end, gridRowStart: part.grid_row_start, gridRowEnd: part.grid_row_end }}
                  onClick={(e) => setSelectedIndex(e.currentTarget.dataset.id)} data-id={index}>
                 <span className={part.tag.toLowerCase().includes("cover") && !part.tag.toLowerCase().includes("back") && !part.tag.toLowerCase().includes("grid") ? "badge grillcov-tag" : "badge"}>  {(part.tag).split(" ")[0]}<div>{(part.tag).split(" ").slice(1).join(" ")}</div></span>
                </div>
              )
            })}

            {selectedIndex != -1 && <Parts_modal setSelectedIndex={setSelectedIndex} part={parts[selectedIndex]} modelId={model[0].model_id}/>}

          </div>
        </div>
      }
    </div>
  )
}

