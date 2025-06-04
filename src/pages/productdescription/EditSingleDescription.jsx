// Improved version of EditSingleProductDescription component with unified modal state and restored select styling
import axios from "axios";
import { useState } from "react";
import Modal from "react-modal";
import isAuthenticated from "../../components/auth";
import LargeButton from "../../components/buttons/LargeButton";
import MediumButton from "../../components/buttons/MediumButton";
import BoldH1 from "../../components/headings/BoldH1";
import MediumInput from "../../components/inputs/MediumInput";
import MediumTextArea from "../../components/textarea/MediumTextarea";
import HighlightedBanner from "../../components/banners/HighlightedBanner";

Modal.setAppElement("#root");

function EditSingleProductDescription() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedMPN, setSelectedMPN] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [productLabel, setProductLabel] = useState("");
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [OCMProductID, setOCMProductID] = useState("");

  const [searchForm, setSearchForm] = useState({
    productName: "",
    productMPN: "",
    productModel: "",
    productStatus: "5",
    productHidden: "5",
  });

  const [productFields, setProductFields] = useState({
    name: "",
    description: "",
    metaDescription: "",
    metaKeywords: "",
  });

  const handleSearchValueChange = (field) => (e) => {
    setSearchForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleFieldChange = (field) => (e) => {
    setProductFields((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const {
      productName,
      productMPN,
      productModel,
      productStatus,
      productHidden,
    } = searchForm;
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/node/products/searchForProducts`,
        {
          name: productName,
          mpn: productMPN,
          model: productModel,
          status: productStatus,
          hidden: productHidden,
        }
      )
      .then((res) => {
        setSearchedProducts(res.data[0]);
      })
      .catch((err) => console.error("Error saving description:", err));
  };

  const openModal = (product) => {
    console.log(1);
    setSelectedMPN(product.MPN);
    setSelectedModel(product.Model);
    setProductLabel(product.Label);
    setOCMProductID(product.productID);
    fetchProductDescriptionInfo(product.productID);
    setIsOpen(true);
  };

  const fetchProductDescriptionInfo = (OCMProductID) => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/node/products/GetProductDescriptionInfo`,
        { OCMProductID }
      )
      .then((res) => {
        const data = res.data[0]?.[0];
        if (data) {
          setProductFields({
            name: data.name,
            description: decodeHtmlEntities(data.description || ""),
            metaDescription: data.metaDescription,
            metaKeywords: data.metaKeyword,
          });
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  const decodeHtmlEntities = (input) => {
    const e = document.createElement("div");
    e.innerHTML = input;
    return e.innerHTML;
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const saveProductDescription = () => {
    if (!isAuthenticated())
      return alert("User is logged out. Please refresh to log back in.");
    if (!confirm("Are you sure you want to save?")) return;
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/node/products/UpdateProductDescriptionName`,
        {
          OCMProductID,
          newName: productFields.name,
          newDescription: productFields.description,
          newMetaKeywords: productFields.metaKeywords,
          newMetaDescription: productFields.metaDescription,
        }
      )
      .then((res) => {
        if (res.data[0][0]["success"]) alert("success");
      })
      .catch((err) => console.error("Error saving:", err));
  };

  return (
    <div>
      <div className="text-center">
        <BoldH1 text="Edit Product Description Table" />
      </div>

      <form onSubmit={handleSearch}>
        <div className="flex justify-center gap-24 mt-6">
          <div className="text-white text-2xl mb-1">
            Name
            <div>
              <MediumInput
                name="productName"
                value={searchForm.productName}
                onChange={handleSearchValueChange("productName")}
              />
            </div>
          </div>

          <div className="text-white text-2xl mb-1">
            MPN
            <div>
              <MediumInput
                name="productMPN"
                value={searchForm.productMPN}
                onChange={handleSearchValueChange("productMPN")}
              />
            </div>
          </div>

          <div className="text-white text-2xl mb-1">
            Model
            <div>
              <MediumInput
                name="productModel"
                value={searchForm.productModel}
                onChange={handleSearchValueChange("productModel")}
              />
            </div>
          </div>

          <div className="text-white text-2xl mb-1">
            Status
            <div>
              <select
                className="bg-slate-800 px-3 py-[0.91rem] rounded-lg text-neutral-200 border-1 border-slate-700 placeholder:text-neutral-400"
                name="productStatus"
                value={searchForm.productStatus}
                onChange={handleSearchValueChange("productStatus")}
              >
                <option value="5">Don't care</option>
                <option value="1">Enabled</option>
                <option value="0">Disabled</option>
              </select>
            </div>
          </div>

          <div className="text-white text-2xl mb-1">
            Hidden
            <div>
              <select
                className="bg-slate-800 px-3 py-[0.91rem] rounded-lg text-neutral-200 border-1 border-slate-700 placeholder:text-neutral-400"
                name="productHidden"
                value={searchForm.productHidden}
                onChange={handleSearchValueChange("productHidden")}
              >
                <option value="5">Don't care</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-12 mt-8">
          <LargeButton text="Search" type="submit"/>
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
          {searchedProducts.map((product, i) => (
            <tr key={i}>
              <td>{product.productID}</td>
              <td>{product.Name}</td>
              <td>{product.Model}</td>
              <td>{product.MPN}</td>
              <td>
                <MediumButton
                  text="View/Edit"
                  action={() => openModal(product)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="w-2/5 bg-slate-700 text-white rounded-lg p-4 max-h-[93vh] overflow-y-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        overlayClassName="Overlay"
      >
        <div className="text-center">
          <HighlightedBanner text={`Edit ${selectedMPN} Description`} />
        </div>

        <div className="mt-4">Product Name</div>
        <MediumTextArea
          value={productFields.name}
          onChange={handleFieldChange("name")}
        />

        <div className="mt-4">Product Description</div>
        <MediumTextArea
          value={productFields.description}
          onChange={handleFieldChange("description")}
        />

        <div className="mt-4">Preview</div>
        <div
          className="productDescriptionPreview"
          dangerouslySetInnerHTML={{ __html: productFields.description }}
        />

        <div className="mt-4">Meta Description</div>
        <MediumTextArea
          value={productFields.metaDescription}
          onChange={handleFieldChange("metaDescription")}
          maxLength={155}
        />

        <div className="mt-4">Meta Keywords</div>
        <MediumTextArea
          value={productFields.metaKeywords}
          onChange={handleFieldChange("metaKeywords")}
          maxLength={155}
        />

        <div className="mt-6 text-center">
          <LargeButton text={"Save"} action={saveProductDescription} />
        </div>
      </Modal>
    </div>
  );
}

export default EditSingleProductDescription;
