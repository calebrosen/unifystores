var parts = [
  {
    "name": "3542-DS-2",
    "shortDes": "Cooking Grids",
    "description": "Fire Magic Diamond Sear Cooking Grids for A430, C430 and Custom 1 Grills",
    "gridColumnStart": 43,
    "gridColumnEnd": 44,
    "gridRowStart": 6,
    "gridRowEnd": 7
  },
  {
    "name": "23759-C",
    "shortDes": "Hood",
    "description": "Fire Magic Smoker Hood With Warming Rack for Custom 1 Charcoal Grills",
    "gridColumnStart": 45,
    "gridColumnEnd": 47,
    "gridRowStart": 13,
    "gridRowEnd": 14
  },
  {
    "name": "24330-017",
    "shortDes": "Shelf",
    "description": "Fire Magic Rigid Shelf for Custom 1 Charcoal and A430 Patio Post Grill",
    "gridColumnStart": 23,
    "gridColumnEnd": 24,
    "gridRowStart": 18,
    "gridRowEnd": 20
  }
]

function setMarkers(parts){

  let container = document.querySelector(".imageMap__container");

  parts.map((part, index) => {
    const marker = document.createElement("div")
    marker.classList = "markers";
    marker.style.position = "absolute";
    marker.dataset.id = index;
    marker.style = `grid-column-start:${part.gridColumnStart}; grid-column-end: ${part.gridColumnEnd}; grid-row-start: ${part.gridRowStart}; grid-row-end: ${part.gridRowEnd}`
    container.appendChild(marker);
  })
}

function getGridElementsPosition(index) {
  console.log(index)
  const gridEl = document.querySelector(".imageMap__container");

  let offset_column_start = Number(window.getComputedStyle(gridEl.children[index]).gridColumnStart);
  let offset_column_end = Number(window.getComputedStyle(gridEl.children[index]).gridColumnEnd);
  let offset_row_start = Number(window.getComputedStyle(gridEl.children[index]).gridRowStart);
  let offset_row_end = Number(window.getComputedStyle(gridEl.children[index]).gridRowEnd);

  console.log(offset_column_start, offset_column_end, offset_row_start, offset_row_end)
  return { offset_column_start, offset_column_end, offset_row_start, offset_row_end };
}

function getNodeIndex(elm) {
  var c = elm.parentNode.children,
    i = 0;
  for (; i < c.length; i++) if (c[i] == elm) return i;
}

function addClickEventsToGridItems() {
  let gridItems = document.getElementsByClassName("markers");
  for (let i = 0; i < gridItems.length; i++) {
    gridItems[i].onclick = (e) => {
      console.log(e.target)
      let position = getGridElementsPosition(getNodeIndex(e.target));
    };
  }
}

addClickEventsToGridItems();



