import { useEffect, useState, useMemo } from "react";
import MediumButton from "../../components/buttons/MediumButton";
import MediumInput from "../../components/inputs/MediumInput";
import AddCategoryFilterModal from "./AddCategoryFilterModal";
import BoldH1 from "../../components/headings/BoldH1";

function AddCategoryFilters() {
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [allFilterGroups, setAllFilterGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState({});
  const [allCategories, setAllCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // run all fetches in parallel for better performance
        const [_, filterGroupsRes, categoriesRes, mainRes] = await Promise.all([
          fetch(
            `${process.env.REACT_APP_API_URL}/node/filters/updateCategoryFilterLogicTable`
          ),
          fetch(
            `${process.env.REACT_APP_API_URL}/node/filters/getAllFilterGroups`
          ),
          fetch(
            `${process.env.REACT_APP_API_URL}/node/filters/getAllCategoriesWithFilterGroups`
          ),
          fetch(
            `${process.env.REACT_APP_API_URL}/node/filters/getCategoryFilterLogicTable`
          ),
        ]);

        const [filterGroupsData, categoriesData, categoryFiltersData] = await Promise.all([
          filterGroupsRes.json(),
          categoriesRes.json(),
          mainRes.json(),
        ]);

        setAllFilterGroups(filterGroupsData);
        setAllCategories(categoriesData[0]);
        setCategoryFilters(categoryFiltersData);
      } catch (err) {
        console.error("fetch error:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // memoized filtered categories for better performance
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categoryFilters;

    const lowerSearch = searchTerm.toLowerCase();
    return categoryFilters.filter(
      (category) =>
        category.name.toLowerCase().includes(lowerSearch) ||
        category.full_path.toLowerCase().includes(lowerSearch) ||
        category.category_id.toString().includes(lowerSearch)
    );
  }, [categoryFilters, searchTerm]);

  const openModal = (category) => {
    setActiveCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveCategory({});
  };

  if (isLoading) {
    return (
      <div className="text-center my-20">
        <div>Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center my-20">
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center my-10">
        <BoldH1 text="ADD CATEGORY FILTERS" size="text-6xl" />
      </div>

      {/* search bar */}
      <div className="mb-8 mt-20 text-center">
        <MediumInput
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <div className="mt-2 text-neutral-200">
            Found {filteredCategories.length} of {categoryFilters.length} categories
          </div>
        )}
      </div>

      <table className="w-full mt-20">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Category ID</th> 
            <th className="p-2 text-left">Category Name</th>
            <th className="p-2 text-left">Path</th>
            <th className="p-2 text-left">Edit</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-2 text-center">
                {searchTerm
                  ? "No categories found matching your search"
                  : "No categories available"}
              </td>
            </tr>
          ) : (
            filteredCategories.map((category) => (
              <tr key={category.category_id}>
                <td className="p-2">{category.category_id}</td>
                <td className="p-2">{category.name}</td>
                <td className="p-2">{category.full_path}</td>
                <td className="p-2">
                  <MediumButton text="Edit" action={() => openModal(category)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <AddCategoryFilterModal
        isOpen={isModalOpen}
        onClose={closeModal}
        activeCategory={activeCategory}
        allFilterGroups={allFilterGroups}
        allCategories={allCategories}
      />
    </div>
  );
}

export default AddCategoryFilters;