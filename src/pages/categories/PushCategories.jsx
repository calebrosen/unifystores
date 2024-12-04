import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../contexts/StoreContext";

function PushCategories() {
  const [data, setData] = useState([]);
  const [categoryIDsToPush, setCategoryIDsToPush] = useState([]);
  const [categoriesPreview, setCategoriesPreview] = useState([]);
  const [step, setStep] = useState(1);
  const { selectedStore } = useContext(StoreContext);

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_URL}/node/categories/fetchOCMasterCategories`
    )
      .then((res) => res.json())
      .then((data) => setData(data[0]))
      .catch((err) => console.log("Fetch error:", err));
  }, []);

  const pushToStore = (e) => {
    if (selectedStore) {
      const categoryID = e.target.id;
      const name = e.target.value;
      const confirmPush = confirm(
        'Are you sure you want to push category "' +
          name +
          '" to ' +
          selectedStore +
          "?"
      );
      if (confirmPush) {
        axios
          .post(
            `${process.env.REACT_APP_API_URL}/node/categories/pushCategories`,
            { selectedStore, categoryID }
          )
          .then((res) => {
            if (res.data[0][0]["success"]) {
              alert(res.data[0][0]["success"]);
            } else {
              alert("Something went wrong.");
            }
            console.log(res);
          })
          .catch((err) => alert("Error:", err));
      }
    } else {
      alert("Try selecting a store first.");
    }
  };

  const ClearSelection = () => {
    setCategoryIDsToPush([]);
    const allCheckboxes = document.querySelectorAll(
      "input[class='checkboxForCopyProduct']"
    );
    allCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
  };

  const UpdateCategoriesToPushList = (e) => {
    const categoryIDForList = e.currentTarget.getAttribute(
      "data-custom-category-id"
    );
    const checked = e.target.checked;
    if (checked) {
      setCategoryIDsToPush((prev) => [...prev, categoryIDForList]);
    } else {
      setCategoryIDsToPush((prev) =>
        prev.filter((categoryID) => categoryID !== categoryIDForList)
      );
    }
  };

  const ChangeStep = (step) => {
    setStep(step);
    if (step === 2) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/node/categories/InsertCategoryIDsToCopy`,
          { categoryIDsToPush }
        )
        .then(() => {
          fetch(
            `${process.env.REACT_APP_API_URL}/node/categories/GenerateCategoriesForPreviews`
          )
          .then((res) => res.json())
          .then((data) => {
            setCategoriesPreview(data[0]);
          })
          .catch((err) =>
            console.log("Fetch error generating categories for preview:", err)
          );
        })
        .catch((err) => alert("Error inserting:", err));
    }
  };

  return (
    <>
      {/* First step (selecting categories) */}
      {step == 1 && (
        <div id="categoryContainer" className="subsectionContainer">
          <div className="xlHeader marginTop4rem">Push Categories</div>
          {categoryIDsToPush && categoryIDsToPush.length > 0 && (
            <div>
              <span style={{ fontSize: "24px" }}>Category ID's selected: </span>
              {categoryIDsToPush.map((d, i) => (
                <span key={i} style={{ fontSize: "20px" }}>
                  {d}&nbsp;
                </span>
              ))}
              <div>
                <button
                  className="saveButtonLG marginTop2rem"
                  onClick={() => ChangeStep(2)}
                >
                  Proceed
                </button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button
                  className="deleteButtonLG marginTop2rem"
                  onClick={ClearSelection}
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          <table className="marginTop2rem">
            <thead>
              <tr>
                <th>Push</th>
                <th>ID</th>
                <th>Name</th>
                <th>Parent</th>
                <th>Status</th>
                <th>Date Added</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i}>
                  <td>
                    &nbsp;&nbsp;&nbsp;
                    <input
                      type="checkbox"
                      className="checkboxForCopyProduct"
                      data-custom-category-id={d.category_id}
                      onClick={UpdateCategoriesToPushList}
                    />
                  </td>
                  <td>{d.category_id}</td>
                  <td>{d.name}</td>
                  <td>{d.parent_name}</td>
                  <td>{d.status}</td>
                  <td>{d.date_added}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Second step */}
      {step === 2 && categoriesPreview && categoriesPreview.length > 0 ? (
    <div id="categoryContainer" className="subsectionContainer">
      <div className="xlHeader marginTop4rem">Review Categories</div>
      <div>
        <button className="saveButtonLG marginTop2rem">Proceed</button>
      </div>

      <table className="marginTop2rem">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Date Added</th>
          </tr>
        </thead>
        <tbody>
          {categoriesPreview.map((d, i) => (
            <tr key={i}>
              <td>{d.category_id}</td>
              <td>{d.category_name}</td>
              <td>{d.status}</td>
              <td>{d.date_added}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    ) : (
      <p>No categories available to preview.</p>
    )}
    </>
  );
}

export default PushCategories;
