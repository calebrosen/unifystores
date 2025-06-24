import Modal from "react-modal";
import axios from "axios";
import { useEffect, useState } from "react";
import SmallSimpleBanner from "../../components/banners/SmallSimpleBanner";
import LargeButton from "../../components/buttons/LargeButton";
import Swal from "sweetalert2";

export default function AddCategoryFilterModal({
  isOpen,
  onClose,
  activeCategory,
  allFilterGroups,
  allCategories,
}) {
  const [filterGroups, setFilterGroups] = useState([]);
  const [selectedCopyCategoryId, setSelectedCopyCategoryId] = useState("");

  const fetchFilterGroupNamesByIds = async (ids = []) => {
    if (!ids.length) return [];
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/node/filters/getFilterGroupNamesForCategory`,
        { filter_group_ids: ids }
      );
      return res.data[0] || [];
    } catch (err) {
      console.error("Failed to fetch filter group names:", err);
      return [];
    }
  };

  useEffect(() => {
    const fetchFilters = async () => {
      if (!isOpen || !activeCategory?.filter_group_ids?.length) return;
      const filters = await fetchFilterGroupNamesByIds(
        activeCategory.filter_group_ids
      );
      setFilterGroups(filters);
    };

    fetchFilters();
  }, [activeCategory?.category_id, isOpen]);

  const handleRemove = (indexToRemove) => {
    const updated = filterGroups.filter((_, i) => i !== indexToRemove);
    setFilterGroups(updated);
  };

  const addFilterGroupToCategory = (filterGroupId) => {
    const parsedId = parseInt(filterGroupId, 10);
    const groupToAdd = allFilterGroups.find(
      (group) => group.filter_group_id === parsedId
    );
    if (
      groupToAdd &&
      !filterGroups.some((f) => f.filter_group_id === parsedId)
    ) {
      setFilterGroups([...filterGroups, groupToAdd]);
    }
  };

  const copyFiltersFromCategory = async (categoryId) => {
    const parsedId = parseInt(categoryId, 10);
    if (!parsedId || isNaN(parsedId)) return;

    try {
      // Fetch the category with filter_group_ids (either from props or API)
      const categoryToCopy = allCategories.find(
        (c) => c.category_id === parsedId
      );
      const filterGroupIds = categoryToCopy?.filter_group_ids;

      if (!filterGroupIds?.length) return;

      const copiedFilters = await fetchFilterGroupNamesByIds(filterGroupIds);

      setFilterGroups([]);
      setFilterGroups(copiedFilters);
      setSelectedCopyCategoryId("");
    } catch (err) {
      console.error("Error copying filters from category:", err);
    }
  };

  const saveCategoryFilters = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save these filter groups for this category?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, save",
      cancelButtonText: "Cancel",
      customClass: "sweetalert-lg-info bg-slate-600 text-neutral-200",
    }).then((result) => {
      if (result.isConfirmed && activeCategory) {
        const filterGroupIds = filterGroups.map(
          (group) => group.filter_group_id
        ).join(",");
        axios
          .post(
            `${process.env.REACT_APP_API_URL}/node/filters/saveCategoryFilter`,
            {
              category_id: activeCategory.category_id,
              filter_group_ids: filterGroupIds,
            }
          )
          .then(() => {
            onClose();
            alert("success");
          })
          .catch((error) => {
            console.error("Error saving category filters:", error);
          });
      }
    });
  };

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
        <div className="py-6 px-2.5">
          <SmallSimpleBanner
            text={activeCategory.full_path}
            centered={false}
            size={"text-[2.635rem]"}
          />
        </div>

        <div className="py-4 px-2.5">
          <div className="mb-5 flex gap-40">
            <div>
              <label className="block">Add Filter Group</label>
              <select
                onChange={(e) => addFilterGroupToCategory(e.target.value)}
                className="bg-slate-800 p-3 rounded-lg text-neutral-200 border-1 text-3xl border-slate-700 placeholder:text-neutral-400"
              >
                <option value="">-- Select --</option>
                {allFilterGroups.map((filterGroup) => (
                  <option
                    key={filterGroup.filter_group_id}
                    value={filterGroup.filter_group_id}
                  >
                    {filterGroup.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block">Copy Filters from Category</label>
              <select
                value={selectedCopyCategoryId}
                onChange={(e) => copyFiltersFromCategory(e.target.value)}
                className="bg-slate-800 p-3 rounded-lg text-neutral-200 border-1 text-3xl border-slate-700 placeholder:text-neutral-400"
              >
                <option value="">-- Select Category --</option>
                {allCategories
                  .filter((c) => c.category_id !== activeCategory?.category_id)
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            {filterGroups.map((filterGroup, index) => (
              <div
                key={filterGroup.filter_group_id || index}
                className="inline-flex items-center bg-slate-600 px-4 py-2.5 text-3xl rounded-full mr-2 mb-3"
              >
                <button
                  onClick={() => handleRemove(index)}
                  className="text-red-400 hover:text-red-600 font-bold mr-2 text-[2.35rem] pb-1"
                  title="Remove"
                >
                  ×
                </button>
                <span className="text-white">{filterGroup.name}</span>
              </div>
            ))}
          </div>

          <div className="text-sm text-gray-400 mt-2">
            Current Filter Group IDs:{" "}
            {JSON.stringify(filterGroups.map((f) => f.filter_group_id))}
          </div>

          <div className="mt-5">
            <LargeButton text="Save Filters" action={saveCategoryFilters} />
          </div>
        </div>
      </div>
    </Modal>
  );
}
