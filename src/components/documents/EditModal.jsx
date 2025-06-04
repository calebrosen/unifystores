import Modal from "react-modal";
import LargeButton from "../buttons/LargeButton";
import MediumInputFW from "../inputs/MediumInputFW";

export default function EditModal({
  isOpen,
  onClose,
  currentRow,
  handleChange,
  onSave,
  onDelete,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Edit Row"
      shouldCloseOnOverlayClick={true}
      className="w-1/3 bg-slate-700 max-h-[93vh] overflow-y-auto text-white rounded-lg p-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      overlayClassName="Overlay"
    >
      {currentRow && (
        <form onSubmit={onSave} className="block mb-1">
          {[
            "brand",
            "path",
            "top_level_category",
            "second_level_category",
            "third_level_category",
            "fourth_level_category",
            "fifth_level_category",
            "sixth_level_category",
            "product_display_name",
            "document_type",
            "year",
            "mpn",
          ].map((field) => (
            <label key={field} className="text-neutral-200 text-2xl block mb-2 capitalize">
              {field.replace(/_/g, " ")}
              <MediumInputFW
                name={field}
                value={currentRow[field] || ""}
                onChange={handleChange}
              />
            </label>
          ))}

          <div className="flex gap-12 mt-3">
            <LargeButton text="Save" type="Submit" />
            <LargeButton
              text="Delete"
              color="bg-slate-800"
              action={() => onDelete(currentRow.file_id)}
            />
          </div>
        </form>
      )}
    </Modal>
  );
}
