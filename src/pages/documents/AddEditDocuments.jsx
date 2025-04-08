import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import CreatableSelect from "react-select/creatable";
import FtpFileManager from "../../components/FtpFileManager";
import Swal from "sweetalert2";

function AddEditDocuments() {
  const [rows, setRows] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [newDocument, setNewDocument] = useState({});
  const [brands, setBrands] = useState([]);
  const [topLevelCategories, setTopLevelCategories] = useState([]);
  const [secondLevelCategories, setSecondLevelCategories] = useState([]);
  const [thirdLevelCategories, setThirdLevelCategories] = useState([]);
  const [fourthLevelCategories, setFourthLevelCategories] = useState([]);
  const [fifthLevelCategories, setFifthLevelCategories] = useState([]);
  const [sixthLevelCategories, setSixthLevelCategories] = useState([]);
  const [productDisplayNames, setProductDisplayNames] = useState([]);
  const [fileTypes, setFileTypes] = useState([]);
  const [mpnOptions, setMPNOptions] = useState([]);
  // const [subFileTypes, setSubFileTypes] = useState([]);
  const [dbLoading, setDbLoading] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const getDocuments = () => {
      setSearchQuery("");
      axios
        .get(`${process.env.REACT_APP_API_URL}/node/documents/getDocuments`)
        .then((res) => {
          setRows(res.data[0]);
        })
        .catch((err) => console.log("Error:", err));
    };
    getDocuments();
  }, [refresh]);

  const explainLevel = (level) => {
    let swalTitle, swalHtml;
    if (level == "top") {
      swalTitle = "What should the top level be?";
      swalHtml =
        "This should be something like Grills, Accessories, Parts, Linear Fireplaces, or Patio Heaters.";
    } else if (level == "second") {
      swalTitle = "What should the second level be?";
      swalHtml =
        "If the top level is Grills or Fireplaces, this would normally be the series. Otherwise, this is typically the type of product. Such as type of accessory or part.";
    } else if (level == "third") {
      swalTitle = "What should the third level be?";
      swalHtml =
        "This level and levels below may not even be needed. Only put stuff and below here if you can break the product down further. For most grills, fireplaces, and main products we can break it down by size or type/configuration here.";
    } else if (level == "fourth") {
      swalTitle = "What should the fourth level be?";
      swalHtml =
        "We should be further breaking the product down by size or type/configuration here.";
    } else if (level == "fifth") {
      swalTitle = "What should the fifth level be?";
      swalHtml =
        "Typically you should not reach this level unless the product has some sort of configuration, such as Analog/Digital, Multi-User/Standard, Gourmet/Classic.";
    } else if (level == "sixth") {
      swalTitle = "What should the sixth level be?";
      swalHtml =
        "The only time you should ever hit this level is if you are dealing with something that you've overcomplicated or the manufacturer has overcomplicated. You will be at a minimum of 7 clicks to get to the manual, so unless you have to break it down this much, try to simplify things.";
    } else if (level == "productDisplayName") {
      swalTitle = "What should the product display name be?";
      swalHtml =
        "This is the display name of the product - it is the last thing that should be clicked before it breaks down into year. It may even be present in the prior levels, and is typically the model number or what the product is, like 'E660', or 'Charred Oak'.";
    } else if (level == "documentType") {
      swalTitle = "What should the document type be?";
      swalHtml =
        "This is normally an abbreviation of the type of document. It should be fully lowercase and snake case if needed.<br><br>om: Owner's Manual<br>ss: Overview<br>cad: Cad Drawing<br>wall_control: Wall Control<br>qsg: Quick Start Guide<br>app: App<br>catalog: Catalog<br>wiring: wiring<br>care: Care Guide<br>ag: Assembly Guide<br>spec: Spec Sheet<br>remote: Remote<br>trim: Trim Guide<br>lpg: Log Placement Guide<br>controls: Controls<br><br>If your document_type is not exactly one of these, your entry will not work. You can add to this list by adding your entry to the variable documentTypes on page.jsx.";
    } else if (level == "year") {
      swalTitle = "What should the year be?";
      swalHtml =
        "This is the year the document was released by the manufacturer. Most documents have an indicator or a date figure somewhere to figure this out. This is a string, so if needed, you can enter something like Pre 2004.";
    } else if (level == "path") {
      swalTitle = "How do I get the path?";
      swalHtml =
        "Upload the document below. Your folder structure should essentially mirror the structure defined above, with new folders at each level. Make sure everything is snake case. If a folder doesn't exist, create it. Once the document is uploaded, it should spit out the path for you to copy and paste into here.";
    } else if (level == "mpn") {
      swalTitle = "What do I put for MPN's?";
      swalHtml =
        "Put the MPN of the product(s) that this document applies to (comma delimited).<br><br>For example: E660i-9EAN,E660i-9E1N";
    }
    Swal.fire({
      title: swalTitle,
      html: swalHtml,
      icon: "question",
      customClass: "sweetalert-lg-info bg-slate-600 text-neutral-200",
    });
  };

  // this is populating the dropdown on add new
  useEffect(() => {
    const populateDropdowns = () => {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/node/documents/getDataForDocumentsDropdown`,
          newDocument
        )
        .then((res) => {
          if (!res.data[0][0]) {
            return;
          }
          if (res.data[0][0].hasOwnProperty("top_level_category")) {
            setTopLevelCategories(
              res.data[0].map((obj) => ({
                value: obj.top_level_category,
                label: obj.top_level_category,
              }))
            );
          } else if (res.data[0][0].hasOwnProperty("second_level_category")) {
            setSecondLevelCategories(
              res.data[0].map((obj) => ({
                value: obj.second_level_category,
                label: obj.second_level_category,
              }))
            );
          } else if (res.data[0][0].hasOwnProperty("third_level_category")) {
            setThirdLevelCategories(
              res.data[0].map((obj) => ({
                value: obj.third_level_category,
                label: obj.third_level_category,
              }))
            );
          } else if (res.data[0][0].hasOwnProperty("fourth_level_category")) {
            setFourthLevelCategories(
              res.data[0].map((obj) => ({
                value: obj.fourth_level_category,
                label: obj.fourth_level_category,
              }))
            );
            console.log(res.data[0][0]);
          } else if (res.data[0][0].hasOwnProperty("fifth_level_category")) {
            setFifthLevelCategories(
              res.data[0].map((obj) => ({
                value: obj.fifth_level_category,
                label: obj.fifth_level_category,
              }))
            );
          } else if (res.data[0][0].hasOwnProperty("sixth_level_category")) {
            setSixthLevelCategories(
              res.data[0].map((obj) => ({
                value: obj.sixth_level_category,
                label: obj.sixth_level_category,
              }))
            );
          }
        })
        .catch((err) =>
          console.log(
            "Error determining which level category to populate:",
            err
          )
        );
    };

    const getProductDisplayNames = () => {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/node/documents/getProductDisplayNames`,
          newDocument
        )
        .then((res) => {
          setProductDisplayNames(
            res.data[0].map((obj) => ({
              value: obj.product_display_name,
              label: obj.product_display_name,
            }))
          );
        })
        .catch((err) => console.log("Error:", err));
    };

    const getMPNOptions = () => {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/node/documents/getProductMPNs`,
          newDocument
        )
        .then((res) => {
          if (res.data[0][0].hasOwnProperty("mpn")) {
            setMPNOptions(
              res.data[0].map((obj) => ({
                value: obj.mpn,
                label: obj.mpn,
              }))
            );
          }
        })
        .catch((err) => console.log("Error:", err));
    };

    getMPNOptions();
    populateDropdowns();
    getProductDisplayNames();
  }, [newDocument]);

  // getting things on load
  useEffect(() => {
    const getBrands = () => {
      axios
        .get(`${process.env.REACT_APP_API_URL}/node/documents/getBrands`)
        .then((res) => {
          setBrands(
            res.data[0].map((obj) => ({
              value: obj.brand,
              label: obj.brand,
            }))
          );
        })
        .catch((err) => console.log("Error:", err));
    };

    const getDocumentTypes = () => {
      axios
        .get(`${process.env.REACT_APP_API_URL}/node/documents/getDocumentTypes`)
        .then((res) => {
          setFileTypes(
            res.data[0].map((obj) => ({
              value: obj.document_type,
              label: obj.document_type,
            }))
          );
        })
        .catch((err) => console.log("Error:", err));
    };

    getBrands();
    getDocumentTypes();
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const getFilteredDocuments = () => {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/node/documents/getFilteredDocuments`,
          { searchInput }
        )
        .then((res) => {
          if (res.data[0].length !== 0) {
            setRows(res.data[0]);
          }
        })
        .catch((err) => console.log("Error:", err));
    };

    getFilteredDocuments();
  }, [searchInput]);

  const openEditModal = (row) => {
    setCurrentRow(row);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentRow(null);
  };

  const addDocumentToDB = () => {
    if (newDocument && newDocument.path !== null && newDocument.path !== "") {
      const confirmAddToDB = confirm(
        "Are you sure you want to upload this to the stores?"
      );
      if (confirmAddToDB) {
        setDbLoading(true);
        const payload = { ...newDocument };
        axios
          .post(
            `${process.env.REACT_APP_API_URL}/node/documents/addNewDocument`,
            payload
          )
          .then((res) => {
            console.log(res);
            closeEditModal();
            if (res.data.sqlMessage) {
              alert(res.data.sqlMessage);
            } else {
              alert("Document added.");
              if (refresh) setRefresh(false);
              else setRefresh(true);
            }
          })
          .catch((err) => console.log("Error:", err));
        setDbLoading(false);
      }
    } else {
      console.log(newDocument);
      alert("Add the path");
    }
  };

  const openAddModal = () => {
    setNewDocument({
      brand: null,
      path: null,
      top_level_category: null,
      second_level_category: null,
      third_level_category: null,
      fourth_level_category: null,
      fifth_level_category: null,
      sixth_level_category: null,
      product_display_name: null,
      document_type: null,
      year: null,
      mpn: null,
    });
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setNewDocument({});
    setIsAddModalOpen(false);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchInput(searchQuery);
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleEdit = (e) => {
    const confirmUpdate = confirm("Are you sure you want to update this row?");
    if (confirmUpdate) {
      e.preventDefault();
      const payload = { ...currentRow };
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/node/documents/updateDocument`,
          payload
        )
        .then((res) => {
          console.log(res);
          closeEditModal();
          if (res.data.sqlMessage) {
            alert(res.data.sqlMessage);
          } else {
            alert("Document updated.");
            if (refresh) setRefresh(false);
            else setRefresh(true);
          }
        })
        .catch((err) => console.log("Error:", err));
    }
  };

  const deleteDocument = (fileId) => {
    const confirmDelete = confirm("Are you sure you want to delete this row?");
    if (confirmDelete) {
      const deleteId = fileId;
      console.log(deleteId);
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/node/documents/deleteDocument`,
          deleteId
        )
        .then((res) => {
          console.log(res);
          closeEditModal();
          if (res.data.sqlMessage) {
            alert(res.data.sqlMessage);
          } else {
            alert("Row deleted.");
            if (refresh) setRefresh(false);
            else setRefresh(true);
          }
        })
        .catch((err) => console.log("Error:", err));
    }
  };

  const handleChange = (e) => {
    setCurrentRow({ ...currentRow, [e.target.name]: e.target.value });
  };

  const handleAddInputChangeOldWay = (e) => {
    setNewDocument((prev) => ({
      ...prev,
      [e.target.name]: e.target.value || null,
    }));
  };

  const handleAddInputChange = (selectedOption, actionMeta) => {
    const fieldName = actionMeta.name;
    const value = selectedOption.value;

    //console.log(fieldName, ": ", value);

    if (fieldName == "brand" && value !== newDocument.brand) {
      setNewDocument({});
      setTopLevelCategories([]);
      setSecondLevelCategories([]);
      setThirdLevelCategories([]);
      setFourthLevelCategories([]);
      setFifthLevelCategories([]);
      setSixthLevelCategories([]);
    }
    setNewDocument((prev) => ({
      ...prev,
      [fieldName]: value || null,
    }));
  };

  return (
    <div>
      <div className="centeredContainer">
        {rows.length > 0 ? (
          <div>
            <div className="flex justify-center gap-12 mb-12">
              <div>
                <input
                  type="text"
                  value={searchQuery}
                  placeholder="Search..."
                  className="border-neutral-300 bg-slate-700 rounded-lg text-neutral-200 p-3 text-4xl"
                  onChange={(e) => setSearchQuery(e.target.value)}
                ></input>
              </div>

              <div>
                <button
                  className="text-neutral-200 bg-gradient-to-r from-cyan-800 to-slate-800 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-4xl font-semibold px-5 py-3 me-2 mb-2 transition hover:scale-105"
                  onClick={openAddModal}
                >
                  Add New
                </button>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Brand</th>
                  <th>1st Level</th>
                  <th>2nd Level</th>
                  <th>3rd Level</th>
                  <th>4th Level</th>
                  <th>5th Level</th>
                  <th>6th Level</th>
                  <th>Display Name</th>
                  <th>Type</th>
                  <th>Year</th>
                  <th>MPN's</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id || index}>
                    <td>{row.brand}</td>
                    <td>{row.top_level_category}</td>
                    <td>{row.second_level_category}</td>
                    <td>{row.third_level_category}</td>
                    <td>{row.fourth_level_category}</td>
                    <td>{row.fifth_level_category}</td>
                    <td>{row.sixth_level_category}</td>
                    <td>{row.product_display_name}</td>
                    <td>{row.document_type}</td>
                    <td>{row.year}</td>
                    <td>{row.mpn}</td>
                    <td
                      onClick={() => openEditModal(row)}
                      className="edit cursor-pointer"
                    >
                      Edit
                      <span className="glyphicon glyphicon-edit centered"></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Row"
        shouldCloseOnOverlayClick={true}
        className="w-1/3 bg-slate-700 text-white rounded-lg p-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        overlayClassName="Overlay"
      >
        {currentRow && (
          <form onSubmit={handleEdit} className="block mb-2">
            <label className="text-neutral-200 text-2xl block mb-3">
              Brand
              <input
                type="text"
                name="brand"
                className="block w-100 bg-slate-800 px-2 py-2.5 text-neutral-200 rounded-lg text-neutral-200 text-2xl"
                value={currentRow.brand}
                onChange={handleChange}
              />
            </label>
            <label className="text-neutral-200 text-2xl block mb-3">
              Path
              <input
                type="text"
                name="path"
                className="block w-100 bg-slate-800 px-2 py-2.5 text-neutral-200 rounded-lg text-neutral-200 text-2xl"
                value={currentRow.path}
                onChange={handleChange}
              />
            </label>
            <label className="text-neutral-200 text-2xl block mb-3">
              1st Level
              <input
                type="text"
                name="top_level_category"
                className="block w-100 bg-slate-800 px-2 py-2.5 text-neutral-200 rounded-lg text-neutral-200 text-2xl"
                value={currentRow.top_level_category}
                onChange={handleChange}
              />
            </label>
            <label className="text-neutral-200 text-2xl block mb-3">
              2nd Level
              <input
                type="text"
                name="second_level_category"
                className="block w-100 bg-slate-800 px-2 py-2.5 text-neutral-200 rounded-lg text-neutral-200 text-2xl"
                value={currentRow.second_level_category}
                onChange={handleChange}
              />
            </label>
            <label className="text-neutral-200 text-2xl block mb-3">
              3rd Level
              <input
                type="text"
                name="third_level_category"
                className="block w-100 bg-slate-800 px-2 py-2.5 text-neutral-200 rounded-lg text-neutral-200 text-2xl"
                value={currentRow.third_level_category}
                onChange={handleChange}
              />
            </label>
            <label className="text-neutral-200 text-2xl block mb-3">
              4th Level
              <input
                type="text"
                name="fourth_level_category"
                className="block w-100 bg-slate-800 px-2 py-2.5 text-neutral-200 rounded-lg text-neutral-200 text-2xl"
                value={currentRow.fourth_level_category}
                onChange={handleChange}
              />
            </label>
            <label className="text-neutral-200 text-2xl block mb-3">
              5th Level
              <input
                type="text"
                name="fifth_level_category"
                className="block w-100 bg-slate-800 px-2 py-2.5 text-neutral-200 rounded-lg text-neutral-200 text-2xl"
                value={currentRow.fifth_level_category}
                onChange={handleChange}
              />
            </label>
            <label className="text-neutral-200 text-2xl block mb-3">
              6th Level
              <input
                type="text"
                name="sixth_level_category"
                className="block w-100 bg-slate-800 px-2 py-2.5 text-neutral-200 rounded-lg text-neutral-200 text-2xl"
                value={currentRow.sixth_level_category}
                onChange={handleChange}
              />
            </label>
            <label className="text-neutral-200 text-2xl block mb-3">
              Display Name
              <input
                type="text"
                name="product_display_name"
                className="block w-100 bg-slate-800 px-2 py-2.5 text-neutral-200 rounded-lg text-neutral-200 text-2xl"
                value={currentRow.product_display_name}
                onChange={handleChange}
              />
            </label>
            <label className="text-neutral-200 text-2xl block mb-3">
              Document Type
              <input
                type="text"
                name="document_type"
                className="block w-100 bg-slate-800 px-2 py-2.5 text-neutral-200 rounded-lg text-neutral-200 text-2xl"
                value={currentRow.document_type}
                onChange={handleChange}
              />
            </label>
            <label className="text-neutral-200 text-2xl block mb-3">
              Year
              <input
                type="text"
                name="year"
                className="block w-100 bg-slate-800 px-2 py-2.5 text-neutral-200 rounded-lg text-neutral-200 text-2xl"
                value={currentRow.year}
                onChange={handleChange}
              />
            </label>
            <label className="text-neutral-200 text-2xl block mb-3">
              MPN's
              <input
                type="text"
                name="mpn"
                className="block w-100 bg-slate-800 px-2 py-2.5 text-neutral-200 rounded-lg text-neutral-200 text-2xl"
                value={currentRow.mpn}
                onChange={handleChange}
              />
            </label>
            <div className="spaceBetween">
              <button
                type="submit"
                className="bg-green-600 rounded-xl p-2.5 text-neutral-200 text-3xl hover:bg-green-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => deleteDocument(currentRow.file_id)}
                className="bg-red-600 rounded-xl p-2.5 text-neutral-200 text-3xl hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={closeAddModal}
        contentLabel="Add Row"
        shouldCloseOnOverlayClick={true}
        className="w-4/5 max-h-[93vh] overflow-y-auto bg-slate-700 text-white rounded-lg p-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-sans"
        overlayClassName="Overlay"
      >
        <div>
          <div className="h2 p-3 underline">
            Instructions/Guidelines on Adding a New Document
          </div>
          <ol className="h4">
            <li className="p-3">
              Find a document very similiar to what you are uploading.
            </li>
            <li className="p-3 mb-20">
              If something extremely similiar already exists - great! This
              should be true for 99% of documents added. Replicate the structure
              and make small changes to make it work for you.
            </li>
            <li className="p-3">
              If something extremely similiar doesn't already exist - follow
              these guidelines:
            </li>
            <li className="p-3">
              Replicate this level structure [grills, for example]: top level is
              Grills, then Aurora (series), then A660 (specific model), then
              Built-In (type).
            </li>
            <li className="p-3">
              Add or change specific levels as needed, but make it similiar to
              how things already are for most things.
            </li>
            <li className="p-3">
              Be sure to break things up into levels if in the future they may
              change. For example, for Coyote's Grills: Instead of naming the
              first level as Grills, then the second level as C3 Series, start
              at C Series and then break it up into C1, C2, C3, etc.
            </li>
            <li className="p-3">
              If you are not going to select or type a value in an input, leave
              it completely empty.
            </li>
          </ol>
          <div className="my-20">
            <label className="block mb-10 text-2xl text-neutral-200">
              <div className="flex justify-left">
                <span>Product Brand</span>
              </div>
              <CreatableSelect
                name="brand"
                className="text-neutral-800 mt-2"
                isClearable
                options={brands}
                onChange={handleAddInputChange}
              />
            </label>

            {newDocument.brand ? (
              <label className="block mb-10 text-2xl text-neutral-200">
                <div>
                  <span>Top Level Category</span>
                  <span className="ml-4 inline-block vertical-align-bottom align-items-bottom hover:cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="15"
                      width="15"
                      viewBox="0 0 512 512"
                      onClick={() => explainLevel("top")}
                    >
                      <path
                        fill="#fff"
                        d="M504 256c0 137-111 248-248 248S8 393 8 256C8 119.1 119 8 256 8s248 111.1 248 248z"
                      />
                      <path
                        fill="#3fa9f5"
                        d="M262.7 90c-54.5 0-89.3 23-116.5 63.8-3.5 5.3-2.4 12.4 2.7 16.3l34.7 26.3c5.2 3.9 12.6 3 16.7-2.1 17.9-22.7 30.1-35.8 57.3-35.8 20.4 0 45.7 13.1 45.7 33 0 15-12.4 22.7-32.5 34C247.1 238.5 216 254.9 216 296v4c0 6.6 5.4 12 12 12h56c6.6 0 12-5.4 12-12v-1.3c0-28.5 83.2-29.6 83.2-106.7 0-58-60.2-102-116.5-102zM256 338c-25.4 0-46 20.6-46 46 0 25.4 20.6 46 46 46s46-20.6 46-46c0-25.4-20.6-46-46-46z"
                      />
                    </svg>
                  </span>
                </div>
                <CreatableSelect
                  name="top_level_category"
                  className="text-neutral-800 mt-2"
                  isClearable
                  options={topLevelCategories}
                  onChange={handleAddInputChange}
                />
              </label>
            ) : null}

            {newDocument.brand && newDocument.top_level_category ? (
              <label className="block mb-10 text-2xl text-neutral-200">
                <div>
                  <span>Second Level Category</span>
                  <span className="ml-4 inline-block vertical-align-bottom align-items-bottom hover:cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="15"
                      width="15"
                      viewBox="0 0 512 512"
                      onClick={() => explainLevel("second")}
                    >
                      <path
                        fill="#fff"
                        d="M504 256c0 137-111 248-248 248S8 393 8 256C8 119.1 119 8 256 8s248 111.1 248 248z"
                      />
                      <path
                        fill="#3fa9f5"
                        d="M262.7 90c-54.5 0-89.3 23-116.5 63.8-3.5 5.3-2.4 12.4 2.7 16.3l34.7 26.3c5.2 3.9 12.6 3 16.7-2.1 17.9-22.7 30.1-35.8 57.3-35.8 20.4 0 45.7 13.1 45.7 33 0 15-12.4 22.7-32.5 34C247.1 238.5 216 254.9 216 296v4c0 6.6 5.4 12 12 12h56c6.6 0 12-5.4 12-12v-1.3c0-28.5 83.2-29.6 83.2-106.7 0-58-60.2-102-116.5-102zM256 338c-25.4 0-46 20.6-46 46 0 25.4 20.6 46 46 46s46-20.6 46-46c0-25.4-20.6-46-46-46z"
                      />
                    </svg>
                  </span>
                </div>
                <CreatableSelect
                  name="second_level_category"
                  className="text-neutral-800 mt-2"
                  isClearable
                  options={secondLevelCategories}
                  onChange={handleAddInputChange}
                />
              </label>
            ) : null}

            {newDocument.brand &&
            newDocument.top_level_category &&
            newDocument.second_level_category ? (
              <label className="block mb-10 text-2xl text-neutral-200">
                <div>
                  <span>Third Level Category</span>
                  <span className="ml-4 inline-block vertical-align-bottom align-items-bottom hover:cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="15"
                      width="15"
                      viewBox="0 0 512 512"
                      onClick={() => explainLevel("third")}
                    >
                      <path
                        fill="#fff"
                        d="M504 256c0 137-111 248-248 248S8 393 8 256C8 119.1 119 8 256 8s248 111.1 248 248z"
                      />
                      <path
                        fill="#3fa9f5"
                        d="M262.7 90c-54.5 0-89.3 23-116.5 63.8-3.5 5.3-2.4 12.4 2.7 16.3l34.7 26.3c5.2 3.9 12.6 3 16.7-2.1 17.9-22.7 30.1-35.8 57.3-35.8 20.4 0 45.7 13.1 45.7 33 0 15-12.4 22.7-32.5 34C247.1 238.5 216 254.9 216 296v4c0 6.6 5.4 12 12 12h56c6.6 0 12-5.4 12-12v-1.3c0-28.5 83.2-29.6 83.2-106.7 0-58-60.2-102-116.5-102zM256 338c-25.4 0-46 20.6-46 46 0 25.4 20.6 46 46 46s46-20.6 46-46c0-25.4-20.6-46-46-46z"
                      />
                    </svg>
                  </span>
                </div>
                <CreatableSelect
                  name="third_level_category"
                  className="text-neutral-800 mt-2"
                  isClearable
                  options={thirdLevelCategories}
                  onChange={handleAddInputChange}
                />
              </label>
            ) : null}

            {newDocument.brand &&
            newDocument.top_level_category &&
            newDocument.second_level_category &&
            newDocument.third_level_category ? (
              <label className="block mb-10 text-2xl text-neutral-200">
                <div>
                  <span>Fourth Level Category</span>
                  <span className="ml-4 inline-block vertical-align-bottom align-items-bottom hover:cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="15"
                      width="15"
                      viewBox="0 0 512 512"
                      onClick={() => explainLevel("fourth")}
                    >
                      <path
                        fill="#fff"
                        d="M504 256c0 137-111 248-248 248S8 393 8 256C8 119.1 119 8 256 8s248 111.1 248 248z"
                      />
                      <path
                        fill="#3fa9f5"
                        d="M262.7 90c-54.5 0-89.3 23-116.5 63.8-3.5 5.3-2.4 12.4 2.7 16.3l34.7 26.3c5.2 3.9 12.6 3 16.7-2.1 17.9-22.7 30.1-35.8 57.3-35.8 20.4 0 45.7 13.1 45.7 33 0 15-12.4 22.7-32.5 34C247.1 238.5 216 254.9 216 296v4c0 6.6 5.4 12 12 12h56c6.6 0 12-5.4 12-12v-1.3c0-28.5 83.2-29.6 83.2-106.7 0-58-60.2-102-116.5-102zM256 338c-25.4 0-46 20.6-46 46 0 25.4 20.6 46 46 46s46-20.6 46-46c0-25.4-20.6-46-46-46z"
                      />
                    </svg>
                  </span>
                </div>
                <CreatableSelect
                  name="fourth_level_category"
                  className="text-neutral-800 mt-2"
                  isClearable
                  options={fourthLevelCategories}
                  onChange={handleAddInputChange}
                />
              </label>
            ) : null}

            {newDocument.brand &&
            newDocument.top_level_category &&
            newDocument.second_level_category &&
            newDocument.third_level_category &&
            newDocument.fourth_level_category ? (
              <label className="block mb-10 text-2xl text-neutral-200">
                <div>
                  <span>Fifth Level Category</span>
                  <span className="ml-4 inline-block vertical-align-bottom align-items-bottom hover:cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="15"
                      width="15"
                      viewBox="0 0 512 512"
                      onClick={() => explainLevel("fifth")}
                    >
                      <path
                        fill="#fff"
                        d="M504 256c0 137-111 248-248 248S8 393 8 256C8 119.1 119 8 256 8s248 111.1 248 248z"
                      />
                      <path
                        fill="#3fa9f5"
                        d="M262.7 90c-54.5 0-89.3 23-116.5 63.8-3.5 5.3-2.4 12.4 2.7 16.3l34.7 26.3c5.2 3.9 12.6 3 16.7-2.1 17.9-22.7 30.1-35.8 57.3-35.8 20.4 0 45.7 13.1 45.7 33 0 15-12.4 22.7-32.5 34C247.1 238.5 216 254.9 216 296v4c0 6.6 5.4 12 12 12h56c6.6 0 12-5.4 12-12v-1.3c0-28.5 83.2-29.6 83.2-106.7 0-58-60.2-102-116.5-102zM256 338c-25.4 0-46 20.6-46 46 0 25.4 20.6 46 46 46s46-20.6 46-46c0-25.4-20.6-46-46-46z"
                      />
                    </svg>
                  </span>
                </div>
                <CreatableSelect
                  name="fifth_level_category"
                  className="text-neutral-800 mt-2"
                  isClearable
                  options={fifthLevelCategories}
                  onChange={handleAddInputChange}
                />
              </label>
            ) : null}

            {newDocument.brand &&
            newDocument.top_level_category &&
            newDocument.second_level_category &&
            newDocument.third_level_category &&
            newDocument.fourth_level_category &&
            newDocument.fifth_level_category ? (
              <label className="block mb-10 text-2xl text-neutral-200">
                <div>
                  <span>Sixth Level Category</span>
                  <span className="ml-4 inline-block vertical-align-bottom align-items-bottom hover:cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="15"
                      width="15"
                      viewBox="0 0 512 512"
                      onClick={() => explainLevel("sixth")}
                    >
                      <path
                        fill="#fff"
                        d="M504 256c0 137-111 248-248 248S8 393 8 256C8 119.1 119 8 256 8s248 111.1 248 248z"
                      />
                      <path
                        fill="#3fa9f5"
                        d="M262.7 90c-54.5 0-89.3 23-116.5 63.8-3.5 5.3-2.4 12.4 2.7 16.3l34.7 26.3c5.2 3.9 12.6 3 16.7-2.1 17.9-22.7 30.1-35.8 57.3-35.8 20.4 0 45.7 13.1 45.7 33 0 15-12.4 22.7-32.5 34C247.1 238.5 216 254.9 216 296v4c0 6.6 5.4 12 12 12h56c6.6 0 12-5.4 12-12v-1.3c0-28.5 83.2-29.6 83.2-106.7 0-58-60.2-102-116.5-102zM256 338c-25.4 0-46 20.6-46 46 0 25.4 20.6 46 46 46s46-20.6 46-46c0-25.4-20.6-46-46-46z"
                      />
                    </svg>
                  </span>
                </div>
                <CreatableSelect
                  name="sixth_level_category"
                  className="text-neutral-800 mt-2"
                  isClearable
                  options={sixthLevelCategories}
                  onChange={handleAddInputChange}
                />
              </label>
            ) : null}

            <label className="block mb-10 text-2xl text-neutral-200">
              <div>
                <span>Product Display Name</span>
                <span className="ml-4 inline-block vertical-align-bottom align-items-bottom hover:cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="15"
                    width="15"
                    viewBox="0 0 512 512"
                    onClick={() => explainLevel("productDisplayName")}
                  >
                    <path
                      fill="#fff"
                      d="M504 256c0 137-111 248-248 248S8 393 8 256C8 119.1 119 8 256 8s248 111.1 248 248z"
                    />
                    <path
                      fill="#3fa9f5"
                      d="M262.7 90c-54.5 0-89.3 23-116.5 63.8-3.5 5.3-2.4 12.4 2.7 16.3l34.7 26.3c5.2 3.9 12.6 3 16.7-2.1 17.9-22.7 30.1-35.8 57.3-35.8 20.4 0 45.7 13.1 45.7 33 0 15-12.4 22.7-32.5 34C247.1 238.5 216 254.9 216 296v4c0 6.6 5.4 12 12 12h56c6.6 0 12-5.4 12-12v-1.3c0-28.5 83.2-29.6 83.2-106.7 0-58-60.2-102-116.5-102zM256 338c-25.4 0-46 20.6-46 46 0 25.4 20.6 46 46 46s46-20.6 46-46c0-25.4-20.6-46-46-46z"
                    />
                  </svg>
                </span>
              </div>
              <CreatableSelect
                name="product_display_name"
                className="text-neutral-800 mt-2"
                isClearable
                options={productDisplayNames}
                onChange={handleAddInputChange}
              />
            </label>
            <label className="block mb-10 text-2xl text-neutral-200">
              <div>
                <span>Document Type</span>
                <span className="ml-4 inline-block vertical-align-bottom align-items-bottom hover:cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="15"
                    width="15"
                    viewBox="0 0 512 512"
                    onClick={() => explainLevel("documentType")}
                  >
                    <path
                      fill="#fff"
                      d="M504 256c0 137-111 248-248 248S8 393 8 256C8 119.1 119 8 256 8s248 111.1 248 248z"
                    />
                    <path
                      fill="#3fa9f5"
                      d="M262.7 90c-54.5 0-89.3 23-116.5 63.8-3.5 5.3-2.4 12.4 2.7 16.3l34.7 26.3c5.2 3.9 12.6 3 16.7-2.1 17.9-22.7 30.1-35.8 57.3-35.8 20.4 0 45.7 13.1 45.7 33 0 15-12.4 22.7-32.5 34C247.1 238.5 216 254.9 216 296v4c0 6.6 5.4 12 12 12h56c6.6 0 12-5.4 12-12v-1.3c0-28.5 83.2-29.6 83.2-106.7 0-58-60.2-102-116.5-102zM256 338c-25.4 0-46 20.6-46 46 0 25.4 20.6 46 46 46s46-20.6 46-46c0-25.4-20.6-46-46-46z"
                    />
                  </svg>
                </span>
              </div>
              <CreatableSelect
                name="document_type"
                className="text-neutral-800 mt-2"
                isClearable
                options={fileTypes}
                onChange={handleAddInputChange}
              />
            </label>

            <label className="block mb-10 text-2xl text-neutral-200">
              <div>
                <span>Year</span>
                <span className="ml-4 inline-block vertical-align-bottom align-items-bottom hover:cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="15"
                    width="15"
                    viewBox="0 0 512 512"
                    onClick={() => explainLevel("year")}
                  >
                    <path
                      fill="#fff"
                      d="M504 256c0 137-111 248-248 248S8 393 8 256C8 119.1 119 8 256 8s248 111.1 248 248z"
                    />
                    <path
                      fill="#3fa9f5"
                      d="M262.7 90c-54.5 0-89.3 23-116.5 63.8-3.5 5.3-2.4 12.4 2.7 16.3l34.7 26.3c5.2 3.9 12.6 3 16.7-2.1 17.9-22.7 30.1-35.8 57.3-35.8 20.4 0 45.7 13.1 45.7 33 0 15-12.4 22.7-32.5 34C247.1 238.5 216 254.9 216 296v4c0 6.6 5.4 12 12 12h56c6.6 0 12-5.4 12-12v-1.3c0-28.5 83.2-29.6 83.2-106.7 0-58-60.2-102-116.5-102zM256 338c-25.4 0-46 20.6-46 46 0 25.4 20.6 46 46 46s46-20.6 46-46c0-25.4-20.6-46-46-46z"
                    />
                  </svg>
                </span>
              </div>
              <input
                type="text"
                name="year"
                className="block w-full bg-slate-800 px-2 mt-2 py-2.5 text-neutral-200 rounded-lg text-2xl"
                value={newDocument.year}
                onChange={handleAddInputChangeOldWay}
              />
            </label>

            <label className="block mb-10 text-2xl text-neutral-200">
              <div>
                <span>MPN's</span>
                <span className="ml-4 inline-block vertical-align-bottom align-items-bottom hover:cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="15"
                    width="15"
                    viewBox="0 0 512 512"
                    onClick={() => explainLevel("mpn")}
                  >
                    <path
                      fill="#fff"
                      d="M504 256c0 137-111 248-248 248S8 393 8 256C8 119.1 119 8 256 8s248 111.1 248 248z"
                    />
                    <path
                      fill="#3fa9f5"
                      d="M262.7 90c-54.5 0-89.3 23-116.5 63.8-3.5 5.3-2.4 12.4 2.7 16.3l34.7 26.3c5.2 3.9 12.6 3 16.7-2.1 17.9-22.7 30.1-35.8 57.3-35.8 20.4 0 45.7 13.1 45.7 33 0 15-12.4 22.7-32.5 34C247.1 238.5 216 254.9 216 296v4c0 6.6 5.4 12 12 12h56c6.6 0 12-5.4 12-12v-1.3c0-28.5 83.2-29.6 83.2-106.7 0-58-60.2-102-116.5-102zM256 338c-25.4 0-46 20.6-46 46 0 25.4 20.6 46 46 46s46-20.6 46-46c0-25.4-20.6-46-46-46z"
                    />
                  </svg>
                </span>
              </div>
              <CreatableSelect
                name="mpn"
                className="text-neutral-800 mt-2"
                isClearable
                options={mpnOptions}
                onChange={handleAddInputChange}
              />
            </label>
            <label className="block mb-10 text-2xl text-neutral-200">
              <div>
                <span>Path</span>
                <span className="ml-4 inline-block vertical-align-bottom align-items-bottom hover:cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="15"
                    width="15"
                    viewBox="0 0 512 512"
                    onClick={() => explainLevel("path")}
                  >
                    <path
                      fill="#fff"
                      d="M504 256c0 137-111 248-248 248S8 393 8 256C8 119.1 119 8 256 8s248 111.1 248 248z"
                    />
                    <path
                      fill="#3fa9f5"
                      d="M262.7 90c-54.5 0-89.3 23-116.5 63.8-3.5 5.3-2.4 12.4 2.7 16.3l34.7 26.3c5.2 3.9 12.6 3 16.7-2.1 17.9-22.7 30.1-35.8 57.3-35.8 20.4 0 45.7 13.1 45.7 33 0 15-12.4 22.7-32.5 34C247.1 238.5 216 254.9 216 296v4c0 6.6 5.4 12 12 12h56c6.6 0 12-5.4 12-12v-1.3c0-28.5 83.2-29.6 83.2-106.7 0-58-60.2-102-116.5-102zM256 338c-25.4 0-46 20.6-46 46 0 25.4 20.6 46 46 46s46-20.6 46-46c0-25.4-20.6-46-46-46z"
                    />
                  </svg>
                </span>
              </div>
              <input
                type="text"
                name="path"
                className="block w-full bg-slate-800 px-2 mt-2 py-2.5 text-neutral-200 rounded-lg text-2xl"
                value={newDocument.path}
                onChange={handleAddInputChangeOldWay}
              />
            </label>
            <button
              className="text-neutral-200 bg-green-600 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-3xl font-semibold px-4 py-3 me-2 mb-2 transition hover:scale-105"
              onClick={addDocumentToDB}
            >
              Add to Store's DB
            </button>
            {dbLoading ? (
              <span>
                {" "}
                Adding...
                <div className="w-16 h-16 mt-10 border-4 border-gray-300  border-t-slate-600 rounded-full animate-spin"></div>
              </span>
            ) : null}
          </div>
        </div>
        <FtpFileManager />
        <div className="my-40"></div>
      </Modal>
    </div>
  );
}

export default AddEditDocuments;
