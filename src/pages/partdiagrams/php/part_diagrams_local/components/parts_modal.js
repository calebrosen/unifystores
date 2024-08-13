'use strict';


// function Parts_modal({ setSelectedIndex, part, part_description, grid_column_start, grid_column_end, grid_row_start, grid_row_end }) {
function Parts_modal({ setSelectedIndex, part, modelId }) {
  const [selectedPartId, setSelectedPartId] = React.useState(part.product_id);
  console.log(selectedPartId)
  const [options, setOptions] = React.useState([]);

  const ref = React.useRef();

  useOnClickOutside(ref, () => setSelectedIndex(-1));

  function useOnClickOutside(ref, handler) {
    React.useEffect(
      () => {
        const listener = (event) => {
          // Do nothing if clicking ref's element or descendent elements
          if (!ref.current || ref.current.contains(event.target)) {
            return;
          }
          handler(event);
        };
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        return () => {
          document.removeEventListener("mousedown", listener);
          document.removeEventListener("touchstart", listener);
        };
      },
      [ref, handler]
    )
  }
  
  //fixing pulling related options
  React.useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(`./part_diagrams_local/php/get_options.php?partid=${selectedPartId}&modelid=${modelId}`);
        if (response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setOptions(data);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, [selectedPartId, modelId]);


  return (
    <div className="modalBackground" onClick={() => setSelectedIndex(-1)}>
      <div ref={ref} className="modalContainer" onClick={e => e.stopPropagation()} style={{ gridColumnStart: part.grid_column_start, gridColumnEnd: part.grid_column_end, gridRowStart: part.grid_row_start, gridRowEnd: part.grid_row_end }}>
        <div className="modalTitle">
          <button id="titleButton" onClick={() => { setSelectedIndex(-1) }}>X</button>
        </div>
        <div className="modalBody">
          <div className="modalGrid">
            <div className="partImage"><img style={{ width: 100, height: 70 }} src={`image/${part.image}`}></img></div>
            <div className="partInfo">
              <div style={{ color: 'red' }} className="tab10"><strong>Model: {part.model}</strong></div>
              <div className="tab10_block"><strong>Product Name: </strong>{part.name}</div>
              <div className="partInfo2">
                <span className="tab10 quantity"><strong>Quantity: </strong>{part.quantity > 0 ? "In Stock" : "Call for Availability"}</span>
                <span className="tab price"><strong>Price: </strong>{!part.special_price ? '$' + parseFloat(part.price).toFixed(2) : '$' + parseFloat(part.special_price).toFixed(2)}</span>
                <span style={{ color: 'red' }} className="tab description"><strong>{!part.description ? '' : 'Description: ' + part.description}</strong></span>
              </div>
            </div>
            <div><a className="gotoProduct" type="button" href={part.keyword} target="_blank">Go To Product<i className='bi bi-box-arrow-up-right'></i></a></div>        
          </div>
          {options.length != 0 && options.map((opt) => {
            return (
              <div className="modalGrid">
                <div className="partImage"><img style={{ width: 100, height: 70 }} src={`image/${opt.image}`}></img></div>
                <div className="partInfo">
                  <div style={{ color: 'red' }} className="tab10"><strong>Model: {opt.model}</strong></div>
                  <div className="tab10_block"><strong>Product Name: </strong>{opt.name}</div>
                  <div className="partInfo2">
                    <span className="tab10 quantity"><strong>Quantity: </strong>{opt.quantity > 0 ? "In Stock" : "Call for Availability"}</span>
                    <span className="tab price"><strong>Price: </strong>{!opt.special_price ? '$' + parseFloat(opt.price).toFixed(2) : '$' + parseFloat(opt.special_price).toFixed(2)}</span>
                    <span style={{ color: 'red' }} className="tab description"><strong>{!opt.description ? '' : 'Description: ' + opt.description}</strong></span>
                  </div>
                </div>
                <div><a className="gotoProduct" type="button" href={opt.keyword} target="_blank">Go To Product<i className='bi bi-box-arrow-up-right'></i></a></div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// , inlineSize: 545, overflowWrap: 'break-word', float: 'right', paddingRight: 15
