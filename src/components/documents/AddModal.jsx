import Modal from "react-modal";
import CreatableSelect from "react-select/creatable";
import InfoBanner from "../banners/InfoBanner";
import LargeButton from "../buttons/LargeButton";
import MediumInputFW from "../inputs/MediumInputFW";
import FtpFileManager from "./FtpFileManager";
import { PDFPathContext } from "../../contexts/PDFPathContext";
import { useEffect, useContext } from "react";

export default function AddModal({
  isOpen,
  onClose,
  newDocument,
  setNewDocument,
  handleAddInputChange,
  handleAddInputChangeOldWay,
  addDocumentToDB,
  dbLoading,
  dropdowns,
}) {
  const {
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
  } = dropdowns;

  // setting path using context
  const { docPath } = useContext(PDFPathContext);
  useEffect(() => {
    if (!docPath) return;
    setNewDocument((prev) => ({
      ...prev,
      path: docPath,
    }));
  }, [docPath]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add Row"
      shouldCloseOnOverlayClick={true}
      className="w-4/5 max-h-[96vh] overflow-y-auto bg-slate-700 text-white rounded-lg px-4 py-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-sans"
      overlayClassName="Overlay"
    >
      <div>
        <InfoBanner
          maxW="max-w-full"
          text={`
            <div class="h4 space-y-2">
              <ol class="list-decimal list-inside space-y-3">
                <li>
                  Find a document that closely matches the one you're uploading.
                </li>
                <li>
                  If something extremely similar already exists—great! This should be true for 99% of documents added. Replicate the structure and make small adjustments as needed.
                </li>
                <li>
                  If no similar document exists, follow these guidelines:
                  <ul class="list-disc list-inside mt-2 ml-5 space-y-2">
                    <li>
                      Use a level-based structure. For example, for grills: 
                      <strong>Grills → Aurora (series) → A660 (model) → Built-In (type)</strong>.
                    </li>
                    <li>
                      Add or modify levels as necessary, but keep them consistent with existing conventions.
                    </li>
                    <li>
                      Anticipate future variations. For example, instead of “Grills → C3 Series,” structure it as: 
                      <strong>C Series → C1 / C2 / C3 → Built-In or Portable</strong>.
                    </li>
                  </ul>
                </li>
                <li>
                  Leave inputs completely empty if you're not entering or selecting a value.
                </li>
              </ol>
            </div>
          `}
        />

        <div className="my-10">
          {[
            {
              name: "brand",
              label: "Product Brand",
              options: brands,
              condition: true,
            },
            {
              name: "top_level_category",
              label: "Top Level Category",
              options: topLevelCategories,
              condition: newDocument.brand,
            },
            {
              name: "second_level_category",
              label: "Second Level Category",
              options: secondLevelCategories,
              condition: newDocument.top_level_category,
            },
            {
              name: "third_level_category",
              label: "Third Level Category",
              options: thirdLevelCategories,
              condition: newDocument.second_level_category,
            },
            {
              name: "fourth_level_category",
              label: "Fourth Level Category",
              options: fourthLevelCategories,
              condition: newDocument.third_level_category,
            },
            {
              name: "fifth_level_category",
              label: "Fifth Level Category",
              options: fifthLevelCategories,
              condition: newDocument.fourth_level_category,
            },
            {
              name: "sixth_level_category",
              label: "Sixth Level Category",
              options: sixthLevelCategories,
              condition: newDocument.fifth_level_category,
            },
            {
              name: "product_display_name",
              label: "Product Display Name",
              options: productDisplayNames,
              condition: true,
            },
            {
              name: "document_type",
              label: "Document Type",
              options: fileTypes,
              condition: true,
            },
            {
              name: "mpn",
              label: "MPN's",
              options: mpnOptions,
              condition: true,
            },
          ].map(({ name, label, options, condition }) =>
            condition ? (
              <label
                key={name}
                className="block mb-10 text-2xl text-neutral-200"
              >
                <div className="flex justify-left items-center mb-1">
                  <span>{label}</span>
                </div>
                <CreatableSelect
                  name={name}
                  isClearable
                  options={options}
                  onChange={handleAddInputChange}
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "#1e293b", // slate-800
                      borderColor: "#334155", // slate-700
                      color: "#e5e7eb", // neutral-200
                      minHeight: "unset",
                      height: "auto",
                      boxShadow: "none",
                      "&:hover": {
                        borderColor: "#334155",
                      },
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: "#1e293b", // slate-800
                      border: "1px solid #64748b", // slate-500
                      borderRadius: "0.5rem",
                      zIndex: 9999,
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? "#0092b8" // cyan-600
                        : state.isFocused
                        ? "#0f172a" // ✅ slate-900
                        : "#1e293b", // slate-800
                      color:
                        state.isSelected || state.isFocused
                          ? "#fff"
                          : "#e5e7eb",
                      cursor: "pointer",
                      padding: "0.5rem 0.75rem",
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: "#e5e7eb", // neutral-200
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "#9ca3af", // neutral-400
                    }),
                    input: (base) => ({
                      ...base,
                      color: "#e5e7eb", // neutral-200
                    }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      color: "#9ca3af", // neutral-400
                      padding: "10px",
                    }),
                    indicatorSeparator: () => ({
                      display: "none",
                    }),
                  }}
                />
              </label>
            ) : null
          )}

          <label className="block mb-10 text-2xl text-neutral-200">
            <div className="flex items-center mb-1">
              <span>Year</span>
            </div>
            <MediumInputFW
              type={"text"}
              name={"year"}
              value={newDocument.year || ""}
              onChange={handleAddInputChangeOldWay}
            />
          </label>

          <label className="block mb-10 text-2xl text-neutral-200">
            <div className="flex items-center mb-1">
              <span>Path</span>
            </div>
            <MediumInputFW
              type={"text"}
              name={"path"}
              value={newDocument.path || ""}
              onChange={handleAddInputChangeOldWay}
            />
          </label>

          <LargeButton text={"Add to Store's DB"} action={addDocumentToDB} />
          {dbLoading && (
            <span>
              <div className="w-16 h-16 mt-10 border-4 border-gray-300 border-t-slate-600 rounded-full animate-spin"></div>
            </span>
          )}
        </div>

        <FtpFileManager />
        <div className="my-4" />
      </div>
    </Modal>
  );
}
