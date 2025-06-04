import axios from "axios";
import { useContext, useEffect, useState } from "react";
import InfoBanner from "../../components/banners/InfoBanner";
import LargeButton from "../../components/buttons/LargeButton";
import BoldH1 from "../../components/headings/BoldH1";
import { StoreContext } from "../../contexts/StoreContext";

const CopyAttributes = () => {
  const [data, setData] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState("");
  const { selectedStore } = useContext(StoreContext);
  const [productsToAffect, setProductsToAffect] = useState([]);
  const [showLastPreview, setShowLastPreview] = useState(false);
  const [storeProductsToAffectPreview, setStoreProductsToAffectPreview] =
    useState([]);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [productIDsToAffect, setProductIDsToAffect] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/node/attributes/getAttributes`)
    .then((res) => res.json())
    .then((data) => {
      setData(data[0]);
    })
    .catch((err) => console.log("Fetch error:", err));
  }, []);

  const PreviewCopyAction = () => {
    if (selectedAttribute) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/node/attributes/getProductsForAttributeCopy`,
          {
            selectedAttribute,
          }
        )
        .then((res) => {
          if (res.data) {
            const tmp = res.data[0];
            if (tmp.length > 0) {
              setProductsToAffect(tmp);
            } else {
              alert("No products were found with that attribute.");
            }
          } else {
            alert("Something went wrong.");
          }
        })
        .catch((err) => alert("Error:", err));
    } else {
      alert("Select a store and attribute.");
    }
  };

  const PreviewProductsToAffect = () => {
    if (selectedAttribute && selectedStore) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/node/attributes/previewProductsForAttributeCopy`,
          {
            selectedStore,
            selectedAttribute,
          }
        )
        .then((res) => {
          if (res.data) {
            setStoreProductsToAffectPreview(res.data[0]);
            //setting each checkbox as checked by default
            const newCheckedItems = new Set(
              res.data[0].map((item) => item.StoreID)
            );
            setCheckedItems(newCheckedItems);
          } else {
            alert(
              "Something went wrong when attempting to find products to preview. Maybe there were no applicable products."
            );
          }
        })
        .catch((err) => alert("Error:", err));
      setShowLastPreview(true);
    } else {
      alert("Select a store to copy to.");
    }
  };

  const CopyAttributesFromOCMToStoreAction = () => {
    if (Array.from(checkedItems).length > 0) {
      let confirmTmp = confirm(`Are you sure you want to copy the attributes from the selected products on OCMaster to ${selectedStore}?`);
      if (confirmTmp) {
        const productIdsString = Array.from(checkedItems).toString();
        console.log(productIdsString);
        axios
        .post(
          `${process.env.REACT_APP_API_URL}/node/attributes/copyAttributesFromOCMasterToStore`,
          {
            selectedStore,
            selectedAttribute,
            productIdsString
          }
        )
        .then((res) => {
          if (res.data) {
            alert('success');
          } else {
            alert(
              "Something went wrong when attempting to find products to preview. Maybe there were no applicable products."
            );
          }
          console.log(res);
        })
        .catch((err) => alert("Error:", err));
      }
    }
  }

  const HandleChangeAttribute = (e) => {
    setSelectedAttribute(e.currentTarget.value);
  };

  const handleCheckboxChange = (item) => {
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = new Set(prevCheckedItems);

      if (newCheckedItems.has(item)) {
        newCheckedItems.delete(item); // Uncheck
      } else {
        newCheckedItems.add(item); // Check
      }
      return newCheckedItems;
    });
  };

  const GoBack = () => {
    // This function resets everything to initial states
    setProductsToAffect([]);
    setStoreProductsToAffectPreview([]);
    setShowLastPreview(false);
    setCheckedItems(new Set());
  };

  function UnSelectAll() {
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = new Set(prevCheckedItems);
      newCheckedItems.clear();
      return newCheckedItems;
    })
  }

  function SelectAll() {
    const tempSet = new Set(storeProductsToAffectPreview.map((item) => item.StoreID));
    setCheckedItems(tempSet);
  }

  if (!productsToAffect.length > 0) {
    return (
      <div>
        <div className="centered">
          <div className="mt-20 mb-10">
            <BoldH1 text="SELECT AN ATTRIBUTE TO COPY"/>
          </div>

          <select
            className="bg-slate-800 p-3 rounded-lg text-neutral-200 border-1 border-slate-700 placeholder:text-neutral-400"
            onChange={HandleChangeAttribute}
          >
            <option></option>
            {data
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((d, i) => (
              <option key={i} value={d.attribute_id}>
                {d.name}
              </option>
            ))}
          </select>
          <div className="mt-10">
            <LargeButton
              action={PreviewCopyAction}
              text={"Proceed"}
            />
          </div>
        </div>
      </div>
    );
  } else if (showLastPreview) {
    return (
      <div>
        <div className="centered">
          
          <InfoBanner
            text={`Products with the boxes checked will be copied to. (T stands for Target, OCM stands for OCMaster.`}
            size={"text-3xl"}
          />
          <div className="flex gap-10 justify-content-center my-14">
            <LargeButton
              action={SelectAll}
              text={"Check all"}
            />
            <LargeButton
              action={UnSelectAll}
              text={"Uncheck all"}
              color={"bg-slate-700"}
            />
            <LargeButton
              action={CopyAttributesFromOCMToStoreAction}
              text={"Proceed"}
            />
            <LargeButton
              action={GoBack}
              text={"Go back"}
              color={"bg-slate-700"}
            />
          </div>

          <table className="mt-5">
            <thead>
              <tr>
                <th>Copy</th>
                <th>T ID</th>
                <th>T MPN</th>
                <th>T Model</th>
                <th>T Name</th>
                <th>T Hidden</th>
                <th>T Status</th>
                <th>OCM MPN</th>
                <th>OCM Model</th>
                <th>OCM Name</th>
                <th>Attr. Name</th>
                <th>Attr. Text</th>
              </tr>
            </thead>
            <tbody>
              {storeProductsToAffectPreview &&
              storeProductsToAffectPreview.length > 0 ? (
                storeProductsToAffectPreview.map((d, i) => (
                  <tr key={i}>
                    <td>
                      <input
                        type="checkbox"
                        checked={checkedItems.has(d.StoreID)} // StoreID is the product ID on the store selected (so it's unique)
                        onChange={() => handleCheckboxChange(d.StoreID)} // handling checkbox change
                        style={{ marginLeft: "16px" }}
                        className="checkboxForCopyProduct"
                      />
                    </td>
                    <td>{d.StoreID}</td>
                    <td>{d.StoreMPN}</td>
                    <td>{d.StoreModel}</td>
                    <td>{d.StoreName}</td>
                    <td>{d.Hidden}</td>
                    <td>{d.Status}</td>
                    <td>{d.OCM_MPN}</td>
                    <td>{d.OCM_Model}</td>
                    <td>{d.OCM_Name}</td>
                    <td>{d.OCM_Attribute_Name}</td>
                    <td>{d.OCM_Attribute_Text}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={12}
                    style={{ textAlign: "center", fontSize: "20px" }}
                  >
                    Loading...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="centered">
          <div className="flex gap-10 justify-content-center my-14">
            <LargeButton
              action={PreviewProductsToAffect}
              text={"Proceed"}
            />
            <LargeButton
              action={GoBack}
              text={"Go back"}
              color={"bg-slate-700"}
            />
          </div>
          <BoldH1 text={`Products on OCMaster with Attribute ID ${selectedAttribute}`}/>
          <table className="mt-5">
            <thead>
              <tr>
                <th>ID</th>
                <th>MPN</th>
                <th>Model</th>
                <th>Name</th>
                <th>Attr. Name</th>
                <th>Attr. Text</th>
              </tr>
            </thead>
            <tbody>
              {productsToAffect.map((d, i) => (
                <tr key={i}>
                  <td>{d.ID}</td>
                  <td>{d.MPN}</td>
                  <td>{d.Model}</td>
                  <td>{d.Name}</td>
                  <td>{d.AttributeName}</td>
                  <td>{d.AttributeText}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
};

export default CopyAttributes;