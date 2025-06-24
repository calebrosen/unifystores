
import { useEffect, useState } from "react";
import MediumButton from "../../components/buttons/MediumButton";
import AddCategoryFilterModal from "./AddCategoryFilterModal";
import BoldH1 from "../../components/headings/BoldH1";

function AddCategoryFilters() {
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [allFilterGroups, setAllFilterGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState({});
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetch(
          `${process.env.REACT_APP_API_URL}/node/filters/updateCategoryFilterLogicTable`
        );
        const fetchFilterGroups = await fetch(
          `${process.env.REACT_APP_API_URL}/node/filters/getAllFilterGroups`
        );
        setAllFilterGroups(await fetchFilterGroups.json());

        const categoriesWithFilterGroups = await fetch(
          `${process.env.REACT_APP_API_URL}/node/filters/getAllCategoriesWithFilterGroups`
        );
        const categoriesData = await categoriesWithFilterGroups.json();
        setAllCategories(categoriesData[0]);

        const mainRes = await fetch(
          `${process.env.REACT_APP_API_URL}/node/filters/getCategoryFilterLogicTable`
        );
        setCategoryFilters(await mainRes.json());
      } catch (err) {
        console.log("Fetch error:", err);
      }
    };

    loadData();
  }, []);

  const openModal = (category) => {
    setActiveCategory(category);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="text-center my-10">
        <BoldH1 text="ADD CATEGORY FILTERS" size="text-6xl" />
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
          {categoryFilters.map((category) => (
            <tr key={category.category_id}>
              <td className="p-2">{category.category_id}</td>
              <td className="p-2">{category.name}</td>
              <td className="p-2">{category.full_path}</td>
              <td className="p-2">
                <MediumButton text="Edit" action={() => openModal(category)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddCategoryFilterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeCategory={activeCategory}
        allFilterGroups={allFilterGroups}
        allCategories={allCategories}
      />
    </div>
  );
}

export default AddCategoryFilters;
