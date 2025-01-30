import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../contexts/StoreContext";

function CopyCategories() {
  const [data, setData] = useState([]);
  const [categoryIDsToCopy, setCategoryIDsToCopy] = useState([]);
  const [categoriesPreview, setCategoriesPreview] = useState([]);
  const [step, setStep] = useState(1);
  const [nameSearch, setNameSearch] = useState('');
  const { selectedStore } = useContext(StoreContext);

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_URL}/node/categories/fetchOCMasterCategories`
    )
      .then((res) => res.json())
      .then((data) => setData(data[0]))
      .catch((err) => console.log("Fetch error:", err));
  }, []);

  const ClearSelection = () => {
    setCategoryIDsToCopy([]);
    const allCheckboxes = document.querySelectorAll(
      "input[class='checkboxForCopyProduct']"
    );
    allCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
  };

  const FilterCategories = (e) => {
    setNameSearch(e.target.value);
  }

  const FilteredCategories = data.filter((d) =>
    (d.name && d.name.toLowerCase().includes(nameSearch.toLowerCase()))
    ||
    (d.parent_name && d.parent_name.toLowerCase().includes(nameSearch.toLowerCase()))
  );

  const UpdateCategoriesToCopyList = (e) => {
    const categoryIDForList = e.currentTarget.getAttribute(
      "data-custom-category-id"
    );
    const checked = e.target.checked;
    if (checked) {
      setCategoryIDsToCopy((prev) => [...prev, categoryIDForList]);
    } else {
      setCategoryIDsToCopy((prev) =>
        prev.filter((categoryID) => categoryID !== categoryIDForList)
      );
    }
  };

  const ChangeStep = (step) => {
    setStep(step);
    if (step === 1) {
      setCategoryIDsToCopy([]);
      setCategoriesPreview([]);
    }
    else if (step === 2) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/node/categories/InsertCategoryIDsToCopy`,
          { categoryIDsToCopy }
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

  const CopyCategoriesAction = () => {
    if (selectedStore) {
      const confirmCopyCategories = confirm(`Are you sure you want to copy these categories to ${selectedStore}?`);
      if (confirmCopyCategories) {
        axios.post(
          `${process.env.REACT_APP_API_URL}/node/products/CopyProducts_GetTargetData`,
          {
            selectedStore,
          }
        )
        .then((res) => {
          if (res.data[0][0]["success"]) {
            fetch(
              `${process.env.REACT_APP_API_URL}/node/categories/CopyCategoriesAction`
            )
            .then((res) => res.json())
            .then((data) => {
              if (data[0][0]["success"]) {
                alert("success");
                ChangeStep(1);
              }
            })
            .catch((err) =>
              console.log("Error copying categories:", err)
            );
          } else {
            alert("Something went wrong while getting target data.");
          }
          console.log(res);
        })
        .catch((err) => alert("Error:", err));
      }
    } else {
      alert('Select a store.');
    }
  }

  return (
    <>
      {/* First step (selecting categories) */}
      {step == 1 && (
        <div id="categoryContainer" className="subsectionContainer">
          {categoryIDsToCopy && categoryIDsToCopy.length > 0 && (
            <div>
              <p className="text-3xl text-neutral-200 mt-8">Category ID's selected: </p>
              {categoryIDsToCopy.map((d, i) => (
                <span key={i} className="text-neutral-200 text-3xl">
                  {d}&nbsp;
                </span>
              ))}
              <div className="mt-10">
                <button
                  className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold py-3 px-3 me-2 mb-2 transition hover:scale-105"
                  onClick={() => ChangeStep(2)}
                >
                  Proceed
                </button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button
                  className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold py-3 px-3 me-2 mb-2 transition hover:scale-105"
                  onClick={ClearSelection}
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}
          <div>
            <input
              className="bg-slate-700 p-3 rounded-lg text-neutral-200 text-4xl mt-4 w-25"
              label="Search by Name or Parent Name"
              placeholder="Search by Name or Parent Name"
              onChange={FilterCategories}
            />
          </div>
          <table className="marginTop2rem">
            <thead>
              <tr>
                <th>Copy</th>
                <th>ID</th>
                <th>Name</th>
                <th>Parent</th>
                <th>Status</th>
                <th>Date Added</th>
              </tr>
            </thead>
            <tbody>
              {FilteredCategories.map((d, i) => (
                <tr key={i}>
                  <td>
                    &nbsp;&nbsp;&nbsp;
                    <input
                      type="checkbox"
                      className="checkboxForCopyProduct"
                      data-custom-category-id={d.category_id}
                      onClick={UpdateCategoriesToCopyList}
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
    {step === 2 && categoriesPreview && categoriesPreview.length > 0 &&
    <div id="categoryContainer" className="subsectionContainer">
      <div className="xlHeader marginTop4rem">Review Categories</div>
      <div>
        <button className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-2xl font-semibold py-2 px-3 me-2 mb-2 transition hover:scale-105" onClick={CopyCategoriesAction}>Proceed</button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button
            className="deleteButtonLG marginTop2rem"
            onClick={() => ChangeStep(1)}
        >
        Go Back
        </button>
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
    }
    </>
  );
}

export default CopyCategories;
