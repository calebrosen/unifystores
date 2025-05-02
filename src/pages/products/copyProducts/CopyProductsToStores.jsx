import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { StoreContext } from "../../../contexts/StoreContext";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";


function CopyProductsToStores() {
  const { selectedStore } = useContext(StoreContext);

  const [products, setProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [viewProducts, setViewProducts] = useState([]);
  const [forceCopy, setForceCopy] = useState({});
  const [lastMessage, setLastMessage] = useState("");

  const [nameQuery, setNameQuery] = useState('');
  const [mpnQuery, setMpnQuery] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [mpnInput, setMpnInput] = useState('');

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (currentPage = 1, currentPageSize = 50, searchName = '', searchMPN = '') => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/node/products/getProductsToCopy?page=${currentPage}&pageSize=${currentPageSize}&searchName=${encodeURIComponent(searchName)}&searchMPN=${encodeURIComponent(searchMPN)}`
      );
      const data = await res.json();
      setProducts(data.products || []);
      setPage(data.page);
      setPageSize(data.pageSize);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching paginated products:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts(page, pageSize, nameQuery, mpnQuery);
  }, [page, pageSize, nameQuery, mpnQuery]);

  const searchProducts = () => {
    setMpnQuery(mpnInput);
    setNameQuery(nameInput);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  
  const toggleProductSelection = (productId) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleForceCopy = (productId) => {
    setForceCopy((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleProceedStep2 = async () => {
    if (!selectedStore) {
      Swal.fire("Error", "Select a store to copy the products to.", "error");
      return;
    }

    if (selectedProductIds.length === 0) {
      Swal.fire("Error", "Select at least one product.", "error");
      return;
    }

    try {
      setLoading(true);
      await axios.get(`${process.env.REACT_APP_API_URL}/node/products/RefetchOCMasterTables`);
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/node/products/getProductsForViewingCopy`, {
        tempProductIdsString: selectedProductIds.toString(),
      });
      setViewProducts(data[0] || []);
      setStep(2);
    } catch (error) {
      console.error("Error loading products for copy:", error);
      Swal.fire("Error", "Failed to load products for copying.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleProceedStep3 = async () => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "This will copy products. There is no easy undo.",
      icon: "warning",
      showCancelButton: true,
      customClass: "sweetalert-lg-info bg-slate-600 text-neutral-200",
    });

    if (!confirmed.isConfirmed) return;

    try {
      setLoading(true);
      setLastMessage("Preparing copy...");

      // truncate table
      await axios.post(`${process.env.REACT_APP_API_URL}/node/products/truncateSelectedProductsToCopyTable`);

      // inserting products
      const insertPromises = viewProducts.map((product) =>
        axios.post(`${process.env.REACT_APP_API_URL}/node/products/insertIntoSelectedProductsToCopy`, {
          pID: product.product_id,
          model: product.model,
          mpn: product.mpn,
          force_copy: forceCopy[product.product_id] ? 1 : 0,
        })
      );
      await Promise.all(insertPromises);

      // run procedures
      await axios.post(`${process.env.REACT_APP_API_URL}/node/products/CopyProducts_GetTargetData`, { selectedStore });
      console.log("Target data fetched successfully.");
      setLastMessage("Target data fetched successfully.");
      await axios.post(`${process.env.REACT_APP_API_URL}/node/products/CopyProducts_GetProductsToCopy`);
      console.log("Products to copy fetched successfully.");
      setLastMessage("Products to copy fetched successfully.");
      await axios.post(`${process.env.REACT_APP_API_URL}/node/products/CopyProducts_CopyProductsToStore`, { selectedStore });
      console.log("Products copied successfully.");
      setLastMessage("Products copied successfully. Copying images now...");
      setStep(3);

      await copyImages();
    } catch (error) {
      console.error("Error copying products:", error);
      Swal.fire("Error", "An error occurred during the copy.", "error");
    } finally {
      setLoading(false);
    }
  };

  

  const copyImages = async () => {
    try {
      setLastMessage("Gathering images to copy…");
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/node/products/CopyProducts_CopyImagesToStore`
      );
      const rows = Array.isArray(data[0]) ? data[0] : [];
      if (rows.length === 0) {
        setLastMessage("No images found to copy.");
        return;
      }
      const imagePaths = rows.map(r => r.image);
      console.log('Images to copy: ', imagePaths);
      setLastMessage(`Copying images…`);
      const bulkRes = await axios.post(`${process.env.REACT_APP_API_URL}/node/products/CopyProducts_CopyImagesToStore_Action`, {selectedStore, images: imagePaths});
      setLastMessage(bulkRes.data.message);
    } catch (err) {
      console.error("Image copy failed:", err);
      setLastMessage("Image copy failed");
    }
  };

  
  const clearSelections = () => {
    setSelectedProductIds([]);
  };

  const ExplainForceCopy = () => {
    Swal.fire({
      title: "What does Force Copy mean?",
      text: "Force copy means that even if the product already exists, it will copy it over. Otherwise, it will not copy it over. For example, if you are copying a E660i-9EAN, and the store already has an E660i-9EAN (even though the item descriptions may be different), it will not copy it unless this box is checked.",
      icon: "question",
      customClass: "sweetalert-lg-info bg-slate-600 text-neutral-200",
    });
  };

  const goBack = () => {
    setLastMessage("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center gap-6 mt-20">
        <div className="text-5xl text-neutral-200">{lastMessage}</div>
        <div className="w-20 h-20 border-4 border-gray-300 border-t-slate-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div>
          <div className="flex justify-center gap-6 my-8">
          <input
            className="bg-slate-800 p-3 rounded-lg text-2xl text-neutral-200 placeholder:text-neutral-400"
            placeholder="Search by Name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />

          <input
            className="bg-slate-800 p-3 rounded-lg text-2xl text-neutral-200 placeholder:text-neutral-400"
            placeholder="Search by MPN"
            value={mpnInput}
            onChange={(e) => setMpnInput(e.target.value)}
          />

          <button
            onClick={searchProducts}
            className="bg-cyan-700 hover:bg-cyan-800 px-4 py-3 text-3xl rounded-xl text-white font-semibold transition hover:scale-105"
          >
            Search
          </button>

        </div>
        <Step1
          products={products}
          selectedProductIds={selectedProductIds}
          toggleProductSelection={toggleProductSelection}
          clearSelections={clearSelections}
          handleProceedStep2={handleProceedStep2}
          page={page}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </div>
    );
  } else if (step === 2) {
    return (
      <Step2
        viewProducts={viewProducts}
        forceCopy={forceCopy}
        toggleForceCopy={toggleForceCopy}
        handleProceedStep3={handleProceedStep3}
        explainForceCopy={ExplainForceCopy}
        goBack={goBack}
        lastMessage={lastMessage}
      />
    );
  } else if (step === 3) {
    return (
      <Step3
        goBack={goBack}
        lastMessage={lastMessage}
      />
    );
  }

  return null;
}

export default CopyProductsToStores;
