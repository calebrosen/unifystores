import axios from "axios";
import { useEffect } from "react";

export default function useDocumentDropdownData(
  newDocument,
  setTopLevelCategories,
  setSecondLevelCategories,
  setThirdLevelCategories,
  setFourthLevelCategories,
  setFifthLevelCategories,
  setSixthLevelCategories,
  setProductDisplayNames,
  setMPNOptions
) {

  useEffect(() => {
    const fetchDropdown = async () => {
        console.log("✅ Hook loaded with:", newDocument);
      if (!newDocument.brand) return;

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/node/documents/getDataForDocumentsDropdown`,
          newDocument
        );

        if (!res.data[0] || !res.data[0][0]) return;

        const key = Object.keys(res.data[0][0])[0];
        const options = res.data[0].map((obj) => ({
          value: obj[key],
          label: obj[key],
        }));
        console.log(options);
        switch (key) {
          case "top_level_category":
            setTopLevelCategories(options);
            setSecondLevelCategories([]);
            setThirdLevelCategories([]);
            setFourthLevelCategories([]);
            setFifthLevelCategories([]);
            setSixthLevelCategories([]);
            break;
          case "second_level_category":
            setSecondLevelCategories(options);
            setThirdLevelCategories([]);
            setFourthLevelCategories([]);
            setFifthLevelCategories([]);
            setSixthLevelCategories([]);
            break;
          case "third_level_category":
            setThirdLevelCategories(options);
            setFourthLevelCategories([]);
            setFifthLevelCategories([]);
            setSixthLevelCategories([]);
            break;
          case "fourth_level_category":
            setFourthLevelCategories(options);
            setFifthLevelCategories([]);
            setSixthLevelCategories([]);
            break;
          case "fifth_level_category":
            setFifthLevelCategories(options);
            setSixthLevelCategories([]);
            break;
          case "sixth_level_category":
            setSixthLevelCategories(options);
            break;
        }
      } catch (err) {
        console.error("Error populating dropdowns:", err);
      }
    };

    fetchDropdown();
  }, [
    newDocument.brand,
    newDocument.top_level_category,
    newDocument.second_level_category,
    newDocument.third_level_category,
    newDocument.fourth_level_category,
    newDocument.fifth_level_category,
  ]);

  useEffect(() => {
    if (!newDocument.brand) return;

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/node/documents/getProductDisplayNames`,
        newDocument
      )
      .then((res) =>
        setProductDisplayNames(
          res.data[0].map((obj) => ({
            value: obj.product_display_name,
            label: obj.product_display_name,
          }))
        )
      )
      .catch((err) => console.error("Error loading productDisplayNames:", err));
    console.log('sending new document for getting mpns: ', newDocument);
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/node/documents/getProductMPNs`,
        newDocument
      )
      .then((res) =>
        setMPNOptions(
          res.data[0].map((obj) => ({
            value: obj.mpn,
            label: obj.mpn,
          }))
        )
      )
      .catch((err) => console.error("Error loading MPNs:", err));
  }, [newDocument.brand, newDocument.top_level_category, newDocument.second_level_category, newDocument.third_level_category, newDocument.fourth_level_category, newDocument.fifth_level_category, newDocument.sixth_level_category]);
}
