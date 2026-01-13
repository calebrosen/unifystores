import Modal from "react-modal";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
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
  const [filterGroupSearch, setFilterGroupSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [showFilterGroupDropdown, setShowFilterGroupDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const fetchFilterGroupNamesByIds = async (ids = []) => {
    if (!ids.length) return [];
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/node/filters/getFilterGroupNamesForCategory`,
        { filter_group_ids: ids }
      );
      return res.data[0] || [];
    } catch (err) {
      console.error("failed to fetch filter group names:", err);
      return [];
    }
  };

  useEffect(() => {
    const fetchFilters = async () => {
      if (!isOpen || !activeCategory?.category_id) {
        setFilterGroups([]);
        setSelectedCopyCategoryId("");
        setFilterGroupSearch("");
        setCategorySearch("");
        return;
      }

      const ids = activeCategory.filter_group_ids || [];

      if (ids.length > 0) {
        const filters = await fetchFilterGroupNamesByIds(ids);
        setFilterGroups(filters);
      } else {
        setFilterGroups([]);
      }

      setSelectedCopyCategoryId("");
      setFilterGroupSearch("");
      setCategorySearch("");
    };

    fetchFilters();
  }, [isOpen, activeCategory?.category_id]);

  // filtered filter groups based on search
  const filteredFilterGroups = useMemo(() => {
    if (!filterGroupSearch.trim()) return allFilterGroups;
    
    const lowerSearch = filterGroupSearch.toLowerCase();
    return allFilterGroups.filter((group) =>
      group.name.toLowerCase().includes(lowerSearch)
    );
  }, [allFilterGroups, filterGroupSearch]);

  // filtered categories based on search
  const filteredCategories = useMemo(() => {
    const categories = allCategories
      .filter((c) => c.category_id !== activeCategory?.category_id)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (!categorySearch.trim()) return categories;

    const lowerSearch = categorySearch.toLowerCase();
    return categories.filter((category) =>
      category.name.toLowerCase().includes(lowerSearch)
    );
  }, [allCategories, categorySearch, activeCategory?.category_id]);

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
    setFilterGroupSearch("");
    setShowFilterGroupDropdown(false);
  };

  const copyFiltersFromCategory = async (categoryId) => {
    const parsedId = parseInt(categoryId, 10);
    if (!parsedId || isNaN(parsedId)) return;

    try {
      // fetch the category with filter_group_ids (either from props or api)
      const categoryToCopy = allCategories.find(
        (c) => c.category_id === parsedId
      );
      const filterGroupIds = categoryToCopy?.filter_group_ids;

      if (!filterGroupIds?.length) return;

      const copiedFilters = await fetchFilterGroupNamesByIds(filterGroupIds);

      setFilterGroups([]);
      setFilterGroups(copiedFilters);
      setSelectedCopyCategoryId("");
      setCategorySearch("");
      setShowCategoryDropdown(false);
    } catch (err) {
      console.error("error copying filters from category:", err);
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
        const filterGroupIds = filterGroups
          .map((group) => group.filter_group_id)
          .join(",");
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
            window.location.reload();
          })
          .catch((error) => {
            console.error("error saving category filters:", error);
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
            {/* filter group searchable dropdown */}
            <div className="relative">
              <label className="block">Add Filter Group</label>
              <input
                type="text"
                placeholder="Search filter groups..."
                value={filterGroupSearch}
                onChange={(e) => setFilterGroupSearch(e.target.value)}
                onFocus={() => setShowFilterGroupDropdown(true)}
                className="bg-slate-800 p-3 rounded-lg text-neutral-200 border-1 text-3xl border-slate-700 placeholder:text-neutral-400 w-full"
              />
              {showFilterGroupDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg max-h-60 overflow-y-auto">
                  {filteredFilterGroups.length === 0 ? (
                    <div className="p-3 text-neutral-400 text-2xl">
                      No filter groups found
                    </div>
                  ) : (
                    filteredFilterGroups.map((filterGroup) => (
                      <div
                        key={filterGroup.filter_group_id}
                        onClick={() =>
                          addFilterGroupToCategory(filterGroup.filter_group_id)
                        }
                        className="p-3 text-3xl hover:bg-slate-700 cursor-pointer text-neutral-200"
                      >
                        {filterGroup.name}
                      </div>
                    ))
                  )}
                </div>
              )}
              {showFilterGroupDropdown && (
                <div
                  className="fixed inset-0 z-0"
                  onClick={() => setShowFilterGroupDropdown(false)}
                />
              )}
            </div>

            {/* category searchable dropdown */}
            <div className="relative">
              <label className="block">Copy Filters from Category</label>
              <input
                type="text"
                placeholder="Search categories..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                onFocus={() => setShowCategoryDropdown(true)}
                className="bg-slate-800 p-3 rounded-lg text-neutral-200 border-1 text-3xl border-slate-700 placeholder:text-neutral-400 w-full"
              />
              {showCategoryDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg max-h-60 overflow-y-auto">
                  {filteredCategories.length === 0 ? (
                    <div className="p-3 text-neutral-400 text-2xl">
                      No categories found
                    </div>
                  ) : (
                    filteredCategories.map((category) => (
                      <div
                        key={category.category_id}
                        onClick={() => copyFiltersFromCategory(category.category_id)}
                        className="p-3 text-3xl hover:bg-slate-700 cursor-pointer text-neutral-200"
                      >
                        {category.name}
                      </div>
                    ))
                  )}
                </div>
              )}
              {showCategoryDropdown && (
                <div
                  className="fixed inset-0 z-0"
                  onClick={() => setShowCategoryDropdown(false)}
                />
              )}
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