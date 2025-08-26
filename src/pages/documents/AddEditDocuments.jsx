import axios from "axios";
import { useEffect, useRef, useState } from "react";
import LargeButton from "../../components/buttons/LargeButton";
import AddModal from "../../components/documents/AddModal";
import DocumentTable from "../../components/documents/DocumentTable";
import EditModal from "../../components/documents/EditModal";
import useDocumentDropdownData from "../../components/documents/useDocumentDropdownData";
import BoldH1 from "../../components/headings/BoldH1";
import LargeInput from "../../components/inputs/LargeInput";

export default function AddEditDocuments() {
  const [rows, setRows] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newDocument, setNewDocument] = useState({});
  const [dbLoading, setDbLoading] = useState(false);

  // dropdown options
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

  const dropdowns = {
    brands,
    topLevelCategories,
    secondLevelCategories,
    thirdLevelCategories,
    fourthLevelCategories,
    fifthLevelCategories,
    sixthLevelCategories,
    productDisplayNames,
    fileTypes,
    mpnOptions,
  };

  // fetch all documents on load/refresh
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/node/documents/getDocuments`)
      .then((res) => setRows(res.data[0]))
      .catch((err) => console.log("Error:", err));
  }, [refresh]);

  // populate dropdowns when newDocument changes
  useDocumentDropdownData(
    newDocument,
    setTopLevelCategories,
    setSecondLevelCategories,
    setThirdLevelCategories,
    setFourthLevelCategories,
    setFifthLevelCategories,
    setSixthLevelCategories,
    setProductDisplayNames,
    setMPNOptions
  );

  // get brands and doc types on initial load
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/node/documents/getBrands`)
      .then((res) =>
        setBrands(res.data[0].map((obj) => ({ value: obj.brand, label: obj.brand })))
      );
    axios
      .get(`${process.env.REACT_APP_API_URL}/node/documents/getDocumentTypes`)
      .then((res) =>
        setFileTypes(res.data[0].map((obj) => ({ value: obj.document_type, label: obj.document_type })))
      );
  }, []);

  // manual search
  const handleSearch = () => {

    axios
      .post(`${process.env.REACT_APP_API_URL}/node/documents/getFilteredDocuments`, {
        searchInput: searchQuery,
      })
      .then((res) => {
        if (res.data[0].length !== 0) {
          setRows(res.data[0]);
        } else {
          alert("No results found.");
        }
      })
      .catch((err) => console.log("Error:", err));
  };

  // handle opening modal
  const openEditModal = (row) => {
    setCurrentRow(row);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setCurrentRow(null);
    setIsEditModalOpen(false);
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
    setIsAddModalOpen(false);
    setNewDocument({});
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
    const value = selectedOption?.value || null;

    const cleared = {
      brand: {
        top_level_category: null,
        second_level_category: null,
        third_level_category: null,
        fourth_level_category: null,
        fifth_level_category: null,
        sixth_level_category: null,
      },
      top_level_category: {
        second_level_category: null,
        third_level_category: null,
        fourth_level_category: null,
        fifth_level_category: null,
        sixth_level_category: null,
      },
      second_level_category: {
        third_level_category: null,
        fourth_level_category: null,
        fifth_level_category: null,
        sixth_level_category: null,
      },
      third_level_category: {
        fourth_level_category: null,
        fifth_level_category: null,
        sixth_level_category: null,
      },
      fourth_level_category: {
        fifth_level_category: null,
        sixth_level_category: null,
      },
      fifth_level_category: {
        sixth_level_category: null,
      },
    };

    setNewDocument((prev) => ({
      ...prev,
      [fieldName]: value,
      ...(cleared[fieldName] || {}),
    }));
  };

  const addDocumentToDB = () => {
    if (!newDocument.path) {
      alert("Add the path");
      return;
    }

    const confirmAddToDB = confirm("Are you sure you want to upload this to the stores?");
    if (!confirmAddToDB) return;

    setDbLoading(true);
    axios
      .post(`${process.env.REACT_APP_API_URL}/node/documents/addNewDocument`, newDocument)
      .then((res) => {
        if (res.data.sqlMessage) {
          alert(res.data.sqlMessage);
        } else {
          alert("Document added.");
          setRefresh((r) => !r);
          closeAddModal();
        }
      })
      .catch((err) => console.log("Error:", err))
      .finally(() => setDbLoading(false));
  };

  const handleEdit = (e) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to update this row?")) return;

    axios
      .post(`${process.env.REACT_APP_API_URL}/node/documents/updateDocument`, currentRow)
      .then((res) => {
        if (res.data.sqlMessage) {
          alert(res.data.sqlMessage);
        } else {
          alert("Document updated.");
          setRefresh((r) => !r);
          closeEditModal();
        }
      })
      .catch((err) => console.log("Error:", err));
  };

  const deleteDocument = (fileId) => {
    if (!confirm("Are you sure you want to delete this row?")) return;
    console.log("Deleting file with ID:", fileId);
    axios
      .post(`${process.env.REACT_APP_API_URL}/node/documents/deleteDocument`, { file_id: fileId })
      .then((res) => {
        if (res.data.sqlMessage) {
          alert(res.data.sqlMessage);
        } else {
          alert("Row deleted.");
          setRefresh((r) => !r);
          closeEditModal();
        }
      })
      .catch((err) => console.log("Error:", err));
  };

  return (
    <div>
      <div className="flex flex-col items-center text-center gap-6 mb-12">
        <BoldH1 text="SEARCH, EDIT OR ADD NEW DOCUMENTS" />
        <div className="flex gap-4 mb-10">
          <LargeInput
            value={searchQuery}
            placeholder="Search..."
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <LargeButton text="Search" action={handleSearch} />
        </div>
        <LargeButton text="Add New" action={openAddModal} />
      </div>

      {rows.length > 0 && <DocumentTable rows={rows} onEdit={openEditModal} />}

      <EditModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        currentRow={currentRow}
        handleChange={handleChange}
        onSave={handleEdit}
        onDelete={deleteDocument}
      />

      <AddModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        newDocument={newDocument}
        setNewDocument={setNewDocument}
        handleAddInputChange={handleAddInputChange}
        handleAddInputChangeOldWay={handleAddInputChangeOldWay}
        addDocumentToDB={addDocumentToDB}
        dbLoading={dbLoading}
        dropdowns={dropdowns}
      />
    </div>
  );
}
