import axios from "axios";
import React, { useState } from "react";
import Modal from "react-modal";
import isAuthenticated from "../../components/auth";

Modal.setAppElement("#root");

function EditSingleProductDescription() {
  const [activeTab, setActiveTab] = useState("edit");
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [selectedMPN, setSelectedMPN] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [productLabel, setProductLabel] = useState("");
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [searchType, setSearchType] = useState(1);
  const [OCMProductID, setOCMProductID] = useState('');
  //
  // product description that is set on load of the modal
  const [description, setDescription] = useState("");
  // product description that the selected product will be changed to
  const [newDescription, setNewDescription] = useState("");
  //
  // product name that is set on load of the modal
  const [name, setName] = useState("");
  // product name that the selected product will be changed to
  const [newName, setNewName] = useState("");
  //
  // meta description that is set on load of the modal
  const [metaDescription, setMetaDescription] = useState("");
  // meta description that the selected product will be changed to
  const [newMetaDescription, setNewMetaDescription] = useState("");
  //
  // meta keywords that is set on load of the modal
  const [metaKeywords, setMetaKeywords] = useState("");
  // meta keywords that the selected product will be changed to
  const [newMetaKeywords, setNewMetaKeywords] = useState("");

  // this function just gets the OCM product_description table info using the product ID
  function fetchProductDescriptionInfo(OCMProductID) {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/node/products/GetProductDescriptionInfo`,
        { OCMProductID }
      )
      .then((res) => {
        if (res.data.length > 0 && res.data[0].length > 0) {
          const name = res.data[0][0].name;
          setName(name);
          setNewName(name);
          const metaDescription = res.data[0][0].metaDescription;
          setMetaDescription(metaDescription);
          setNewMetaDescription(metaDescription);
          const metaKeywords = res.data[0][0].metaKeyword;
          setMetaKeywords(metaKeywords);
          setNewMetaKeywords(metaKeywords);

          const description = res.data[0][0].description;
          if (description) {
            let tempDescription = decodeHtmlEntities(description);

            setDescription(tempDescription);
            setNewDescription(tempDescription);
          } else {
            console.error("Description not found");
          }
        } else {
          console.error("No data found in response");
        }
        console.log(res);
      })
      .catch((err) => console.error("Error:", err));
  }

  //this just converts the database tags to html (like &lt; and stuff)
  function decodeHtmlEntities(input) {
    input = input
      .replace(/&nbsp;/g, " ") // non-breaking space
      .replace(/&lt;/g, "<") // less-than sign
      .replace(/&gt;/g, ">") // greater-than sign
      .replace(/&amp;/g, "&") // ampersand
      .replace(/&quot;/g, '"') // double quote
      .replace(/&#39;/g, "'") // single quote
      .replace(/&cent;/g, "¢") // cent sign
      .replace(/&pound;/g, "£") // pound sign
      .replace(/&yen;/g, "¥") // yen sign
      .replace(/&euro;/g, "€") // euro sign
      .replace(/&copy;/g, "©") // copyright sign
      .replace(/&reg;/g, "®") // registered trademark sign
      .replace(/&trade;/g, "™") // trademark sign
      .replace(/&sect;/g, "§") // section sign
      .replace(/&deg;/g, "°") // degree sign
      .replace(/&plusmn;/g, "±") // plus-minus sign
      .replace(/&para;/g, "¶") // paragraph sign
      .replace(/&middot;/g, "·") // middle dot
      .replace(/&hellip;/g, "…") // ellipsis
      .replace(/&frac14;/g, "¼") // fraction 1/4
      .replace(/&frac12;/g, "½") // fraction 1/2
      .replace(/&frac34;/g, "¾") // fraction 3/4
      .replace(/&times;/g, "×") // multiplication sign
      .replace(/&divide;/g, "÷") // division sign
      .replace(/&permil;/g, "‰") // per mille sign
      .replace(/&prime;/g, "′") // prime (minutes)
      .replace(/&Prime;/g, "″") // double prime (seconds)
      .replace(/&micro;/g, "µ") // micro sign
      .replace(/&rsaquo;/g, "›") // single right-pointing angle quotation mark
      .replace(/&lsaquo;/g, "‹") // single left-pointing angle quotation mark
      .replace(/&rsquo;/g, "’") // right single quotation mark
      .replace(/&lsquo;/g, "‘") // left single quotation mark
      .replace(/&rdquo;/g, "”") // right double quotation mark
      .replace(/&ldquo;/g, "“") // left double quotation mark
      .replace(/&ndash;/g, "–") // en dash
      .replace(/&mdash;/g, "—"); // em dash

    // using a temporary div to decode any remaining entities
    const e = document.createElement("div");
    e.innerHTML = input;
    return e.innerHTML;
  }

  //opening modal actions
  const openModal = (e) => {
    setSelectedMPN("");
    setSelectedModel("");
    setProductLabel("");
    setDescription("");
    setNewDescription("");
    setName("");
    setNewName("");
    setMetaDescription("");
    setNewMetaDescription("");
    setMetaKeywords("");
    setNewMetaKeywords("");
    const OCMProductID = e.target.id;
    fetchProductDescriptionInfo(OCMProductID);
    setOCMProductID(OCMProductID);
    setActiveTab("edit");
    setSelectedMPN(e.target.getAttribute("data-custom-mpn"));
    setSelectedModel(e.target.getAttribute("data-custom-model"));
    setProductLabel(e.target.getAttribute("data-custom-label"));
    setIsOpen(true);
  };

  //closing modal actions
  function closeModal() {
    setSelectedMPN("");
    setSelectedModel("");
    setProductLabel("");
    setDescription("");
    setNewDescription("");
    setName("");
    setNewName("");
    setMetaDescription("");
    setNewMetaDescription("");
    setMetaKeywords("");
    setNewMetaKeywords("");
    setIsOpen(false);
  }

  const ProductDescriptionPreview = () => {
    return (
      <div>
      <h3>Preview</h3>
      <div className='productDescriptionPreview' dangerouslySetInnerHTML={{__html:newDescription}}>
      </div>
      </div>
    )
  }

  // this function updates the new value variables on change (pass it the event (e), and the field name that is changed)
  const handleValuesChange = (e, field) => {
    const value = e.target.value;
    switch (field) {
      case "name":
        setNewName(value);
        break;
      case "description":
        setNewDescription(value);
        break;
      case "metaDescription":
        setNewMetaDescription(value);
        break;
      case "metaKeywords":
        setNewMetaKeywords(value);
        break;
      default:
        break;
    }
  };

  // search action (on form submit)
  const handleSearch = (e) => {
    e.preventDefault();
    const name = e.target.form.elements.productName.value;
    const mpn = e.target.form.elements.productMPN.value;
    const model = e.target.form.elements.productModel.value;
    const status = e.target.form.elements.productStatus.value;
    const hidden = e.target.form.elements.productHidden.value;
    searchProducts(name, mpn, model, hidden, status);
  };

  // searching for products using field values
  const searchProducts = (name, mpn, model, hidden, status) => {
    console.log(searchType);
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/node/products/searchForProducts`,
        { name, mpn, model, status, hidden, searchType }
      )
      .then((res) => {
        setSearchedProducts(res.data[0]);
      })
      .catch((err) => console.error("Error saving description:", err));
  };

  const saveProductDescription = () => {
    const CheckAuth = isAuthenticated();
    if (CheckAuth == true) {
      const confirmSave = confirm("Are you sure you want to save?");
      if (confirmSave) {
        console.group('Save information');
        console.log("ocm ID: ", OCMProductID);
        console.log("new name: ", newName);
        console.log("new description: ", newDescription);
        console.log("new metakeywords: ", newMetaKeywords);
        console.log("new metaDescription: ", newMetaDescription);
        console.groupEnd();
        //posting
        axios
          .post(
            `${process.env.REACT_APP_API_URL}/node/products/UpdateProductDescriptionName`,
            { OCMProductID, newName, newDescription, newMetaKeywords, newMetaDescription }
          )
          .then((res) => {
            if (res.data[0][0]["success"]) {
              alert("success");
            }
            console.log(res);
          })
          .catch((err) => console.error("Error saving:", err));
      }
    } else {
      alert("User is logged out. Please refresh to log back in.");
    }
  };

  const handleUnunifiedCheckbox = (e) => {
    console.log(e.target.checked);
    if (e.target.checked) {
      setSearchType(0)
    }
    else {
      setSearchType(1)
    }
  }

  return (
    <div>
    <div className="centered">
      <span className="my-5 text-white text-6xl font-bold underline">Edit Product Description Table</span>
    </div>
      <form>
        <div className="centeredContainer mb-4">
          <label className="text-white text-3xl">
            Name:&nbsp;
            <input
              className="bg-slate-700 rounded-lg text-neutral-200 p-2"
              placeholder="Name"
              name="productName"
            />
          </label>
          <label className="text-white text-3xl">
            MPN: &nbsp;
            <input
              className="bg-slate-700 rounded-lg text-neutral-200 p-2"
              label="MPN"
              placeholder="MPN"
              name="productMPN"
            />
          </label>
          <label className="text-white text-3xl">
            Model: &nbsp;
            <input
              className="bg-slate-700 rounded-lg text-neutral-200 p-2"
              label="Model"
              placeholder="Model"
              name="productModel"
            />
          </label>
          <label className="text-white text-3xl">
            Status: &nbsp;
            <select
              className="bg-slate-700 rounded-lg text-neutral-200 p-2"
              type="select"
              name="productStatus"
            >
              <option value="5">Don't care</option>
              <option value="1">Enabled</option>
              <option value="0">Disabled</option>
            </select>
          </label>
          <label className="text-white text-3xl">
            Hidden: &nbsp;
            <select
              className="bg-slate-700 rounded-lg text-neutral-200 p-2"
              type="select"
              name="productHidden"
            >
              <option value="5">Don't care</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </label>
        </div>
        <div className="centered">
          <label className="text-white text-2xl">Ununified Only? <input type="checkbox" onChange={handleUnunifiedCheckbox}></input></label>&nbsp;&nbsp;&nbsp;
          <button
            type="submit"
            onClick={handleSearch}
            className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-3xl font-semibold px-3 py-2 transition hover:scale-105"
          >
            Search
          </button>
        </div>
      </form>
      <table className="mt-5">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>Model</th>
            <th>MPN</th>
            <th>View/Edit</th>
          </tr>
        </thead>
        <tbody>
          {searchedProducts.map((d, i) => (
            <tr key={i}>
              <td>{d.productID}</td>
              <td>{d.Name}</td>
              <td>{d.Model}</td>
              <td>{d.MPN}</td>
              <td>
                <button
                  data-custom-model={d.Model}
                  data-custom-mpn={d.MPN}
                  data-custom-label={d.Label}
                  id={d.productID}
                  className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-3xl font-semibold p-2 transition hover:scale-105"
                  onClick={openModal}
                >
                  View/Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Description Modal"
        overlayClassName={"Overlay"}
        className="w-3/5 bg-slate-700 text-white rounded-lg p-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div>
          <div>
            <h1 className="text-white text-4xl font-bold">
              Model: {selectedModel} ••• MPN: {selectedMPN} ••• Label:{" "}
              {productLabel}{" "}
            </h1>
            <br />
            {/* Name */}
            <h2>Product Name</h2>
            <textarea
              className="bg-slate-800 text-white p-2 mt-2 mb-10 w-full h-auto"
              defaultValue={name}
              onChange={(e) => handleValuesChange(e, "name")}
            ></textarea>
            {/* Description */}
            <h2>Product Description</h2>
            <br></br>
            <h3>Code</h3>
              <textarea
                defaultValue={description}
                className="bg-slate-800 text-white p-2 mt-2 w-full h-auto"
                onChange={(e) => handleValuesChange(e, "description")}
              />
            <ProductDescriptionPreview/>
            {/* Meta Description */}
            <h2>Meta Description</h2>
            <textarea
              maxLength={155}
              className="bg-slate-800 text-white p-2 mt-2 mb-10 w-full h-auto"
              defaultValue={metaDescription}
              onChange={(e) => handleValuesChange(e, "metaDescription")}
            ></textarea>
            {/* Meta Keywords */}
            <h2>Meta Keywords</h2>
            <textarea
              className="bg-slate-800 text-white p-2 mt-2 mb-10 w-full h-auto"
              defaultValue={metaKeywords}
              onChange={(e) => handleValuesChange(e, "metaKeywords")}
            ></textarea>
          </div>
          <div className="centered">
            <button className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold py-2 px-3 transition hover:scale-105" onClick={saveProductDescription}>Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default EditSingleProductDescription;
