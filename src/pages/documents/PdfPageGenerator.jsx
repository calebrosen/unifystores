import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import axios from "axios";
import React, { useEffect, useState } from "react";

function PdfPageGenerator() {
  const [documentPaths, setDocumentPaths] = useState({});
  const [openCategories, setOpenCategories] = useState({});
  const [activeTabs, setActiveTabs] = useState({});
  const [screenSize, setScreenSize] = useState("desktop");
  const [brands, setBrands] = useState([]);
  const [years, setYears] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fileTypes, setFileTypes] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedFileType, setSelectedFileType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize("mobile");
      else if (width < 1024) setScreenSize("tablet");
      else setScreenSize("desktop");
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    pullDocumentPaths();

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);


  useEffect(() => {
    async function refetchDocuments() {
        if (selectedBrand || selectedCategory || selectedYear || selectedFileType) {
          axios
            .post(`${process.env.REACT_APP_API_URL}/node/documents/getFilteredFilePaths`, { selectedBrand, selectedCategory, selectedYear, selectedFileType })
            .then((res) => {
              const rows = res.data[0];
              if (rows) {
                organizeDocumentPaths(rows);
              }
            })
            .catch((err) => console.log("Error:", err));
        }
    }

    refetchDocuments();

  }, [selectedBrand, selectedCategory, selectedYear, selectedFileType]);

  const pullDocumentPaths = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/node/documents/getFilePaths`)
      .then((res) => {
        const rows = res.data[0];
        if (rows) {
          organizeDocumentPaths(rows);
        }
      })
      .catch((err) => console.log("Error:", err));
  };
  
  const documentTypes = {
    om: "<i class='fa-solid fa-file-pdf'></i> Owner's Manual",
    ss: "<i class='fa-solid fa-file-alt'></i> Sell Sheet",
    cad: "<i class='fa-solid fa-compass-drafting'></i> CAD Drawing",
    wall_control: "<i class='fa-solid fa-sliders'></i> Wall Control",
    qsg: "<i class='fa-solid fa-book-open'></i> Quick Start Guide",
    app: "<i class='fa-solid fa-mobile'></i> App",
    catalog: "<i class='fa-solid fa-book'></i> Catalog",
    wiring: `<i class="fa-solid fa-plug"></i> Wiring`,
    spec_guide: "<i class='fa-solid fa-file'></i> Spec Guide",
    care: "<i class='fa-solid fa-hand-sparkles'></i> Care Guide",
    ag: "<i class='fa-solid fa-screwdriver-wrench'></i> Assembly Guide",
    spec: "<i class='fa-solid fa-file'></i> Spec Sheet",
    remote: "<i class='fa-solid fa-gamepad'></i> Remote",
    trim: "<i class='fa-solid fa-ruler-combined'></i> Trim Guide",
    lpg: "<i class='fa-solid fa-fire'></i> Log Placement Guide",
    controls: "<i class='fa-solid fa-sliders'></i> Controls",
  };

  const organizeDocumentPaths = (rows) => {
    
    let paths = {};

    
  // logic here needs to be re-worked //
  // 
    
    // re-initializing years and categories every time to only show years applicable to the selected brand(s)

    
    const uniqueYears = new Set();
    const uniqueCategories = new Set();
    const documentTypes = new Set();

    // storing all brands and document types and keeping them
    const uniqueBrands = new Set(brands);


    ///
    //
    // end logic rework
    
    rows.forEach((row) => {

      if (!paths[row.brand]) {
        // adding brand if it does not exist
        paths[row.brand] = {};
      }

      // adding stuff to sets for filters
      uniqueBrands.add(row.brand);
      uniqueYears.add(row.year);

      // setting variable to the top level of the selected brand in JSON
      let currentCategory = paths[row.brand];

      // category structre
      const categoryLevels = [
        row.top_level_category,
        row.second_level_category,
        row.third_level_category,
        row.fourth_level_category,
        row.fifth_level_category,
        row.sixth_level_category,
      ];

      // loop through each possible category (1-6) and building out json
      categoryLevels.forEach((category, key) => {
        if (!category) return;

        if (key == 0) {
          uniqueCategories.add(category);
        }

        if (!currentCategory[category]) {
          // adding category to structure if it does not exist
          currentCategory[category] = {};
        }
        currentCategory = currentCategory[category];
      });

      // adding product display name if it doesn't exist
      if (!currentCategory[row.product_display_name]) {
        currentCategory[row.product_display_name] = {};
      }

      // adding product path if it doesn't exist
      if (!currentCategory[row.product_display_name][row.product_path]) {
        currentCategory[row.product_display_name][row.product_path] = {};
      }

      /* so far, we will be at something like this -

        {
          Fire Magic (brand): {
            Grills (top_level_category): {
              Choice (second_level_category): {
                Standard (third_level_category): {
                  C540 (fourth_level_catgeory): {
                    Built-In (fifth_level_category): {
                      C540 (product_display_name): {
                        fire_magic/grills/choice/standard/c540/builtin/ (product_path): {

                        }
                      }
                    }
                    ~~~ other type(s) (Portable) ~~~
                  }
                  ~~~ other Choice Grills (C430, C650) ~~~
                },
                ~~~ other Choice Style (Multi-User) ~~~
              },
              ~~~ other grills ~~~
            },
            ~~~ other top level categories (like Parts) ~~~
          },
          ~~~ other brands ~~~
        }

      */

      // adding product year if it doesnt exist
      if (
        !currentCategory[row.product_display_name][row.product_path][
          row.year
        ]
      ) {
        currentCategory[row.product_display_name][row.product_path][
          row.year
        ] = {};
      }

      
      // adding document_type if it doesnt exist
      if (!currentCategory[row.product_display_name][row.product_path][row.year][row.document_type]) {
 
        documentTypes.add(row.document_type);
        
        // creating document type regardless
        currentCategory[row.product_display_name][row.product_path][row.year][row.document_type] = {};
        
        // if subtype is null, just creating path object for document_type - if not, it will be handled below
        if (row.document_subtype == null) {
          currentCategory[row.product_display_name][row.product_path][row.year][row.document_type] = {
            path: row.path,
          };
        }
      } else {
        // if there is more than one file in the same folder. the naming conventions for this condition are handled at => let paths = value.split(",");"
        let oldPath = currentCategory[row.product_display_name][row.product_path][row.year][row.document_type].path;
        let newPath = oldPath + "," + row.path;
        if (row.document_subtype == null) {
          currentCategory[row.product_display_name][row.product_path][row.year][row.document_type] = {
            path: newPath,
          };
        }
      }

      // adding document_subtype if it exists
      if (row.document_subtype !== null) {

        documentTypes.add(row.document_subtype);

        currentCategory[row.product_display_name][row.product_path][row.year][row.document_type][row.document_subtype] = {
          path: row.path,
        };
      }

       /* at this point, we will be at something like this -

        {
          Fire Magic (brand): {
            Grills (top_level_category): {
              Choice (second_level_category): {
                Standard (third_level_category): {
                  C540 (fourth_level_catgeory): {
                    Built-In (fifth_level_category): {
                      C540 (product_display_name): {
                        fire_magic/grills/choice/standard/c540/builtin/ (product_path): {
                          2024 (year): {
                            om (document_type): {
                              path: fire_magic/grills/choice/multi_user/cm540/builtin/2024/om/choice.pdf
                            }
                          }
                        }
                      }
                    }
                    ~~~ other type(s) (Portable) ~~~
                  }
                  ~~~ other Choice Grills (C430, C650) ~~~
                },
                ~~~ other Choice Style (Multi-User) ~~~
              },
              ~~~ other grills ~~~
            },
            ~~~ other top level categories (like Parts) ~~~
          },
          ~~~ other brands ~~~
        }

      */
    });

    setDocumentPaths(paths);

    setCategories([...uniqueCategories]);
    setFileTypes([...documentTypes]);
    setBrands([...uniqueBrands]);
    setYears([...uniqueYears]);
  }

  const FilterInputs = () => {
    return (
      <div className="flex justify-center">
        <form className="mx-auto">
          <div className="flex gap-10">
              <select id="brands"
                value={selectedBrand}
                className="bg-slate-500 text-3xl rounded-sm focus:border-blue-500 block p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option>All Brands</option>
                {brands.map((key) => (
                  <option value={key}>{key}</option>
                ))}
              </select>

              <select id="categories"
                value={selectedCategory}
                className="bg-slate-500 text-3xl rounded-sm focus:border-blue-500 block p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
              <option>All Categories</option>
              {categories
                .sort((a, b) => b-a)
                .map((key) => (
                  <option value={key}>{key}</option>
                ))}
              </select>

              <select id="years"
                value={selectedYear}
                className="bg-slate-500 text-3xl rounded-sm focus:border-blue-500 block p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option>All Years</option>
              {years
                .sort((a, b) => b-a)
                .map((key) => (
                  <option value={key}>{key}</option>
                ))}
              </select>

              <select
                id="document_types"
                value={selectedFileType}
                className="bg-slate-500 text-3xl rounded-sm focus:border-blue-500 block p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => setSelectedFileType(e.target.value)}
              >
                <option>All File Types</option>
                {fileTypes
                  .sort((a, b) => b - a)
                  .map((key) => {
                    const z = documentTypes[key].split("</i> ").pop();
                    return <option value={key} key={key}>{z}</option>;
                  })}
              </select>

          </div>
        </form>

      </div>
    );
  };

  const handleCategoryClick = (categoryPath) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryPath]: !prev[categoryPath],
    }));
  };

  const handleTabChange = (categoryPath, newValue) => {
    setActiveTabs((prev) => ({
      ...prev,
      [categoryPath]: newValue,
    }));
  };

  const checkCharFrequency = (str, char) => {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === char) {
        count++;
      }
    }
    return count;
  };

  const renderCategories = (categoryData, depth = 1, parentCategory = "", categoryPath = "") => {
    if (typeof categoryData !== "object" || categoryData === null) {
      return null;
    }

    const categoryKeys = Object.keys(categoryData);

    // if depth is 3, create tabs
    if (depth === 3) {
      const activeTab = activeTabs[categoryPath] || 0;
      return (
        <div key={categoryPath} className="w-100">
          <div className="flex justify-center w-full">
            <Tabs
              value={activeTab}
              onChange={(event, newValue) =>
                handleTabChange(categoryPath, newValue)
              }
              variant="scrollable"
              scrollButtons={
                ["mobile", "tablet", "desktop"].includes(screenSize)
                  ? "auto"
                  : false
              }
              // color of the text
              textColor="white"
              // bg color
              className="bg-slate-700 mt-3"
              sx={{
                borderRadius: "0.2rem",
                fontWeight: "bold",
                // this color is the indicator at the bottom
                "& .MuiTabs-indicator": {
                  backgroundColor: "white",
                },
                "& .MuiTab-root": {
                  fontFamily:
                    '"sans-serif", "system-ui",  "Noto Sans", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                  fontSize: "1.2rem",
                  fontWeight: 500,
                  padding: "1rem",
                },
              }}
              allowScrollButtonsMobile
            >
              {categoryKeys.map((key, index) => (
                <Tab key={index} label={key} />
              ))}
            </Tabs>
          </div>

          <div className="text-left">
            {categoryKeys.map((key, index) => (
              <div
                key={index}
                className={`${
                  activeTab === index ? "block" : "hidden"
                } text-left p-4`}
              >
                {renderCategories(
                  categoryData[key],
                  depth + 1,
                  key,
                  `${categoryPath}_${key}`
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return categoryKeys.map((key,index) => {
      let value = categoryData[key];
      const newCategoryPath = `${categoryPath}_${key}`
        .replace(/\//g, "_")
        .replace(/\s+/g, "_")
        .replace(/&/g, "_");
       
      // if the value is a string and ends with .pdf, treat it as the path
      if (typeof value === "string" && value.endsWith(".pdf")) {
        // getting value of text from the json above
        let documentText = documentTypes[parentCategory];

        if (value.includes(",")) {
          let paths = value.split(",");

          return (
            <div key={key}>
              {paths.map((path, index) => {
                // this if is for when you have more than one path in the same folder
                // you can specify different text because the condition switch would just choose the first one
                switch (true) {
                  case path.includes("options"):
                    documentText = "<i class='fa-solid fa-ruler-combined'></i> Trim Options";
                    break;
                  case path.includes("installation"):
                    documentText = "<i class='fa-solid fa-ruler-combined'></i> Trim Installation";
                    break;
                  case path.includes("41mm"):
                    documentText = "<i class='fa-solid fa-compass-drafting'></i> CAD Drawing (41mm Trim)";
                    break;
                  case path.includes("16mm"):
                    documentText = "<i class='fa-solid fa-compass-drafting'></i> CAD Drawing (16mm Trim)";
                    break;
                  case path.includes("ss/insert"):
                    documentText = "<i class='fa-solid fa-file-alt'></i> Sell Sheet (Insert)";
                    break;
                  case path.includes("ss/builtin"):
                    documentText = "<i class='fa-solid fa-file-alt'></i> Sell Sheet (Built-In)";
                    break;
                }

                return (
                  <div
                    key={`${key}-${index}`}
                    className="text-left text-2xl pl-2 mb-3"
                  >
                    {" "}
                    {/* using a unique key by combining `key` and `index` */}
                    <a href={path} target="_blank" rel="noreferrer">
                      <span
                        dangerouslySetInnerHTML={{ __html: documentText }}
                      ></span>
                    </a>
                  </div>
                );
              })}
            </div>
          );
        } else {
          // this is the normal condition, where there is no commas in the path
          return (
            <div key={key} className="text-left text-2xl pl-2 mb-3">
              <a href={value} target="_blank" rel="noreferrer">
                <span dangerouslySetInnerHTML={{ __html: documentText }}></span>
              </a>
            </div>
          );
        }
      }

      if (typeof value === "object" && Object.keys(value).length > 0) {
        if (
          documentTypes.hasOwnProperty(key) ||
          checkCharFrequency(key, "/") > 1
   
        ) {
          return renderCategories(value, depth + 1, key, newCategoryPath);
          // continue rendering children
        }
        const isDropdownCategory = depth > 2;
        const isOpen = openCategories[newCategoryPath];

        return (
          <div
            key={key}
            className={depth === 3 ? "w-full my-6" : "w-full my-2"}
          >
            {/* styling for different depths */}
            {depth === 1 ? (
              <div className="border-t-2 py-10 border-gray-600 w-50 mx-auto">
                <div className="text-6xl font-bold p-2 text-white mt-10">
                  {key}
                </div>
              </div>
            ) : depth === 2 ? (
              <div className="text-4xl font-bold p-2 text-white my-2">
                {key}
              </div>
            ) : depth === 3 ? (
              <div className="text-xl font-bold px-3 py-3 rounded-md text-white inline-block my-2 bg-gray-500 w-100">
                {key}
              </div>
            ) : (
              <div
                className="cursor-pointer text-2xl font-bold px-3 py-3 rounded-md text-white inline-block my-2 bg-gray-600 w-100"
                onClick={() => handleCategoryClick(newCategoryPath)}
              >
                {isOpen ? "▲" : "▼"} {key}
              </div>
            )}

            {/* conditional rendering for nested categories */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                isDropdownCategory && !isOpen
                  ? "max-h-0 opacity-0"
                  : "opacity-100"
              }`}
              style={{
                transitionProperty: "max-height, opacity, clip-path",
                maxHeight: isDropdownCategory && !isOpen ? "0px" : "100%", // smooth expand/collapse
                clipPath:
                  isDropdownCategory && !isOpen
                    ? "inset(0 0 100% 0)"
                    : "inset(0 0 0 0)",
              }}
            >
              <div
                className={
                  depth > 2
                    ? "border-l-2 border-gray-600 pl-3 transition-all duration-500"
                    : ""
                }
              >
                <div className="transition-all duration-500">
                  {renderCategories(value, depth + 1, key, newCategoryPath)}
                </div>
              </div>
            </div>
          </div>
        );
      }

      return null;
    });
  };

  return (
    <div className="font-sans text-white">
      <FilterInputs />
      <div className="text-white text-center mt-6">
        {renderCategories(documentPaths)}
      </div>
    </div>
  );
}

export default PdfPageGenerator;
