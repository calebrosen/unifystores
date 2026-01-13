import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import HighlightedBanner from "../../components/banners/HighlightedBanner";
import SmallButton from "../../components/buttons/SmallButton";
import LargeButton from "../../components/buttons/LargeButton";
import XLButton from "../../components/buttons/XLButton";
import LargeInput from "../../components/inputs/LargeInput";
import MediumFileInput from "../../components/inputs/MediumFileInput";
import MediumTextarea from "../../components/textarea/MediumTextarea";
import MediumInput from "../../components/inputs/MediumInput";
import InfoBanner from "../../components/banners/InfoBanner";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

Modal.setAppElement("#root");

function DiscontinuedWhileSuppliesLast() {
  const [data, setData] = useState([]);
  const [mpnSearch, setMPNSearch] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [addNewModal, setAddNewIsOpen] = useState(false);

  const [selectedMPN, setSelectedMPN] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedReplacedBy, setSelectedReplacedBy] = useState("");

  // attachments for the currently edited item (URLs already stored)
  const [selectedAttachments, setSelectedAttachments] = useState([]);
  // new files chosen in the file input (File objects)
  const [filesToUpload, setFilesToUpload] = useState([]);

  // lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxSlides, setLightboxSlides] = useState([]);

useEffect(() => {
  fetch(
    `${process.env.REACT_APP_API_URL}/node/products/GetDiscontinuedDisabledProducts`
  )
    .then((res) => res.json())
    .then((data) => {
      const rows = (data[0] || []).map((row) => {
        let attachmentsArr = [];

        if (Array.isArray(row.attachments)) {
          attachmentsArr = row.attachments;
        } else if (
          typeof row.attachments === "string" &&
          row.attachments.trim() !== ""
        ) {
          attachmentsArr = row.attachments
            .split(",")
            .map((s) => "http://10.1.10.249/unify/src/assets/" + s.trim())
            .filter(Boolean);
        }

        return {
          ...row,
          attachments: attachmentsArr,
        };
      });

      setData(rows);
    })
    .catch((err) => console.log("Fetch error:", err));
}, []);


  const filteredSearch = data.filter((d) =>
    d.mpn.toLowerCase().includes(mpnSearch.toLowerCase())
  );

  const updateSearchTerm = (e) => {
    setMPNSearch(e.target.value);
  };

  const openModal = (d) => {
    setSelectedMPN(d.mpn);
    setSelectedReason(d.REASON);
    setSelectedReplacedBy(d.ReplacedBy);
    setSelectedAttachments(d.attachments || []); // expecting array of URLs from API
    setFilesToUpload([]);
    setIsOpen(true);
  };

  const openAddNewModal = () => {
    setSelectedMPN("");
    setSelectedReason("");
    setSelectedReplacedBy("");
    setSelectedAttachments([]);
    setFilesToUpload([]);
    setAddNewIsOpen(true);
  };

  // closing modal actions
  function closeModal() {
    setIsOpen(false);
    setAddNewIsOpen(false);
    setSelectedMPN("");
    setSelectedReason("");
    setSelectedReplacedBy("");
    setSelectedAttachments([]);
    setFilesToUpload([]);
  }

  const handleMPNChange = (e) => {
    setSelectedMPN(e.target.value);
  };

  const handleReasonChange = (e) => {
    setSelectedReason(e.target.value);
  };

  const handleReplacedByChange = (e) => {
    setSelectedReplacedBy(e.target.value);
  };

  const handleAttachmentsChange = (e) => {
    setFilesToUpload(Array.from(e.target.files || []));
  };

const uploadAttachments = async (mpn, files) => {
  if (!files || files.length === 0) return [];

  const formData = new FormData();
  formData.append("mpn", mpn);

  files.forEach((file) => {
    formData.append("files", file); // "files" matches upload.array("files")
  });

  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/node/products/UploadDiscontinuedAttachments`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log(res);
  return res.data.urls || [];
};


  const handleUpdate = async () => {
    const confirmUpdate = confirm(
      `Are you sure you want to update the reason/replaced by for ${selectedMPN}?`
    );
    if (!confirmUpdate) return;

    try {
      // 1) upload any new files
      const uploadedUrls = await uploadAttachments(selectedMPN, filesToUpload);

      // 2) merge old + new attachments
      const allAttachments = [...selectedAttachments, ...uploadedUrls];

      // 3) send update to backend, including attachments
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/node/products/UpdateDiscontinuedOrDisabledProducts`,
        { selectedMPN, selectedReason, selectedReplacedBy, attachments: allAttachments }
      );

      if (res.data[0][0]["success"]) {
        alert(res.data[0][0]["success"]);
        location.reload();
      } else {
        alert("Something went wrong.");
      }
    } catch (err) {
      console.log("Error:", err);
      alert("Error updating product. Check console for details.");
    }
  };

  const handleAddNew = async () => {
    const confirmUpdate = confirm(
      `Are you sure you want to add ${selectedMPN}?`
    );
    if (!confirmUpdate) return;

    try {
      // 1) upload any attached files
      const uploadedUrls = await uploadAttachments(selectedMPN, filesToUpload);

      // for a new record, attachments are just the uploaded files
      const allAttachments = uploadedUrls;

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/node/products/AddDiscontinuedOrDisabledProduct`,
        { selectedMPN, selectedReason, selectedReplacedBy, attachments: allAttachments }
      );

      if (res.data[0][0]["success"]) {
        alert(res.data[0][0]["success"]);
      } else if (res.data[0][0]["duplicate"]) {
        alert("Product is already in list");
      } else {
        alert("Something went wrong.");
      }
    } catch (err) {
      console.log("Error:", err);
      alert("Error adding product. Check console for details.");
    }
  };

  // open lightbox for a row
  const openAttachmentsLightbox = (attachments, startIndex = 0) => {
    if (!attachments || attachments.length === 0) return;
    setLightboxSlides(attachments.map((url) => ({ src: url })));
    setLightboxIndex(startIndex);
    setLightboxOpen(true);
  };

  return (
    <div>
      <InfoBanner
        text={
          "When the quantity of the product reaches 0, the product will be disabled on all stores, removed from options (if applicable) and marked as discontinued."
        }
      />
      <div className="centeredContainer">
        <XLButton action={openAddNewModal} text={"Add New"} />
      </div>
      <div className="centeredContainer">
        <LargeInput
          label="Search by MPN"
          placeholder="Search by MPN"
          value={mpnSearch}
          onChange={updateSearchTerm}
        />
      </div>

      <table className="mt-5 w-full table-fixed">
        <thead>
          <tr>
            <th>MPN</th>
            <th className="w-[20%]">Reason</th>
            <th>Replaced By</th>
            <th>Status</th>
            <th>Quantity</th>
            <th>Date Reached Zero</th>
            <th>Days Not In Stock</th>
            <th>Attachments</th>
            <th>Date Added</th>
            <th className="whitespace-nowrap text-right">Edit</th>
          </tr>
        </thead>

        <tbody>
          {filteredSearch.map((d, i) => (
            <tr key={i}>
              <td>{d.mpn}</td>
              <td>{d.REASON}</td>
              <td>{d.ReplacedBy}</td>
              <td>{d.CurrentStatus}</td>
              <td>{d.Available}</td>
              <td>{d.DateReachedZero}</td>
              <td>{d.days_not_instock}</td>
              <td>
                {d.attachments && d.attachments.length > 0 ? (
                  <button
                    type="button"
                    className="text-blue-400 underline"
                    onClick={() => openAttachmentsLightbox(d.attachments, 0)}
                  >
                    View ({d.attachments.length})
                  </button>
                ) : (
                  <span>None</span>
                )}
              </td>
              <td>{d.DateAdded}</td>
              <td className="text-right">
                <SmallButton action={() => openModal(d)} text="Edit" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EDIT EXISTING MODAL */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        overlayClassName={"Overlay"}
        className="w-3/5 bg-slate-700 text-white rounded-lg p-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-slate-500 focus:outline-none"
      >
        <div>
          <HighlightedBanner text={selectedMPN} centered={false} />

          <label
            className="text-white text-4xl font-bold mt-8"
            htmlFor="editReason"
          >
            Reason
          </label>
          <MediumTextarea
            name={"editReason"}
            defaultValue={selectedReason}
            onChange={handleReasonChange}
            placeholder={"Reason"}
          />

          <label
            className="text-white text-4xl font-bold mt-8"
            htmlFor="editReplacedBy"
          >
            Replaced By
          </label>
          <MediumTextarea
            name={"editReplacedBy"}
            defaultValue={selectedReplacedBy}
            onChange={handleReplacedByChange}
            placeholder={"Replaced By"}
          />

          <label
            className="text-white text-4xl font-bold mt-8"
            htmlFor="editAttachments"
          >
            Attachments
          </label>

          {/* upload new attachments */}
          <MediumFileInput
            name={"editAttachments"}
            onChange={handleAttachmentsChange}
          />

          {/* show current + pending attachments */}
          <div className="mt-3 space-y-2">
            <div>
              <span className="font-semibold">Current:</span>{" "}
              {selectedAttachments && selectedAttachments.length > 0 ? (
                <ul className="list-disc ml-10 mt-1">
                  {selectedAttachments.map((url, idx) => (
                    <li key={idx}>
                      <button
                        type="button"
                        className="underline"
                        onClick={() =>
                          openAttachmentsLightbox(selectedAttachments, idx)
                        }
                      >
                        Attachment {idx + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-slate-300 ml-1">None</span>
              )}
            </div>

            {filesToUpload.length > 0 && (
              <div>
                <span className="font-semibold">New to upload:</span>
                <ul className="list-disc ml-10 mt-1">
                  {filesToUpload.map((file) => (
                    <li key={file.name}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-5 mb-1 flex gap-8">
            <LargeButton action={handleUpdate} text={"Save"} />
            <LargeButton
              action={closeModal}
              text={"Close"}
              color="bg-slate-600"
            />
          </div>
        </div>
      </Modal>

      {/* ADD NEW MODAL */}
      <Modal
        isOpen={addNewModal}
        onRequestClose={closeModal}
        contentLabel="Modal"
        className="w-3/5 bg-slate-700 text-white rounded-lg p-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        overlayClassName={"Overlay"}
      >
        <HighlightedBanner
          text={"Add New Discontinued Product"}
          centered={false}
        />

        <label className="text-white text-4xl font-bold mt-5" htmlFor="mpn">
          MPN
        </label>
        <div>
          <MediumInput
            name={"mpn"}
            placeholder={"MPN"}
            value={selectedMPN}
            onChange={handleMPNChange}
            accept=".png,.jpg,.jpeg,.gif,.webp"
          />
        </div>

        <label className="text-white text-4xl font-bold mt-8" htmlFor="reason">
          Reason
        </label>
        <MediumTextarea
          name={"reason"}
          onChange={handleReasonChange}
          placeholder={"Reason"}
        />

        <label
          className="text-white text-4xl font-bold mt-8"
          htmlFor="replacedBy"
        >
          Replaced By
        </label>
        <div>
          <MediumInput
            name={"replacedBy"}
            placeholder={"Replaced By"}
            onChange={handleReplacedByChange}
          />
        </div>

        <label
          className="text-white text-4xl font-bold mt-8"
          htmlFor="newAttachments"
        >
          Attachments
        </label>
        <MediumFileInput
          name={"newAttachments"}
          onChange={handleAttachmentsChange}
        />

        {filesToUpload.length > 0 && (
          <div className="mt-3">
            <span className="font-semibold">New to upload:</span>
            <ul className="list-disc ml-10 mt-1">
              {filesToUpload.map((file) => (
                <li key={file.name}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-5 mb-1 flex gap-8">
          <LargeButton action={handleAddNew} text={"Add New"} />
          <LargeButton
            action={closeModal}
            text={"Close"}
            color="bg-slate-600"
          />
        </div>
      </Modal>

      {/* LIGHTBOX */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
      />
    </div>
  );
}

export default DiscontinuedWhileSuppliesLast;
