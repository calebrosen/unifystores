import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../contexts/StoreContext";
import MediumButton from "../../components/buttons/MediumButton";
import LargeButton from "../../components/buttons/LargeButton";
import MediumInput from "../../components/inputs/MediumInput";
import LargeInput from "../../components/inputs/LargeInput";
import BoldH1 from "../../components/headings/BoldH1";

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
        <div className="text-center">
          {categoryIDsToCopy && categoryIDsToCopy.length > 0 && (
            <div className="flex justify-center my-8 gap-8">
              <LargeButton
                action={() => ChangeStep(2)}
                text={"Proceed"}
              />
              <LargeButton
                action={ClearSelection}
                text={"Clear Selection"}
                color={"bg-slate-700"}
              />
            </div>
          )}
          <div className="mt-12 mb-14">
            <LargeInput
              label="Search by Name or Parent Name"
              placeholder="Search by Name or Parent Name"
              value={nameSearch}
              onChange={FilterCategories}
            />
          </div>
          <table className="mt-4">
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
    <div className="text-center">
      <BoldH1
        text={"REVIEW CATEGORIES"}
      />
      <div className="flex justify-center my-8 gap-8">
        <LargeButton
          action={CopyCategoriesAction}
          text={"Copy Categories"}
        />
        <LargeButton
          action={() => ChangeStep(1)}
          text={"Go Back"}
          color={"bg-slate-700"}
        />
      </div>

      <table className="mt-4">
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
