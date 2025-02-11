const connectToDB = require("../model/db");
require("dotenv").config({ path: "../env/.env" });
const fs = require("fs");
const { Client } = require("basic-ftp");
const path = require("path");

/* PRODUCTS */
// Loading all subsections
exports.getProductSubsections = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql =
      "Select `subsection`, `path` from subsections WHERE `section` = 'products'";
    db.query(sql, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database connection failed", error });
  }
};

exports.getProductsToCopy = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL copyProductsToStore.usp_get_products_for_unify()";
    db.query(sql, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database connection failed", error });
  }
};

exports.RefetchOCMasterTables = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL copyProductsToStore.usp_step_1_get_master_tables_copy()";
    db.query(sql, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database connection failed", error });
  }
};

exports.getProductsForViewingCopy = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL copyProductsToStore.usp_get_products_for_viewing_copy(?)";
    const values = [req.body.tempProductIdsString];
    db.query(sql, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database connection failed", error });
  }
};

exports.insertIntoSelectedProductsToCopy = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql =
      "CALL copyProductsToStore.usp_insert_into_selected_products_to_copy(?, ?, ?, ?)";
    const values = [
      req.body.pID,
      req.body.model,
      req.body.mpn,
      req.body.force_copy,
    ];
    db.query(sql, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database connection failed", error });
  }
};

exports.truncateSelectedProductsToCopyTable = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql =
      "CALL copyProductsToStore.usp_truncate_selected_products_to_copy_table()";
    db.query(sql, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database connection failed", error });
  }
};

exports.CopyProducts_GetTargetData = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL copyProductsToStore.usp_step_2_get_target_data(?)";
    const values = [req.body.selectedStore];
    db.query(sql, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database connection failed", error });
  }
};

exports.CopyProducts_GetProductsToCopy = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL copyProductsToStore.usp_step_3_get_products_to_copy()";
    db.query(sql, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database connection failed", error });
  }
};


exports.CopyProducts_CopyProductsToStore = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL copyProductsToStore.usp_step_4_copy_products_to(?)";
    const values = [req.body.selectedStore];
    db.query(sql, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database connection failed", error });
  }
};

exports.CopyProducts_CopyImagesToStore = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL copyProductsToStore.usp_step_5_copy_images_to_store()";
    db.query(sql, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database connection failed", error });
  }
};

exports.CopyProducts_CopyImagesToStore_Action = async (req, res) => {
  const { selectedStore, imagePath } = req.body;
  if (!selectedStore || !imagePath) {
    return res.status(400).send("Store and image path are required");
  }

  //there is a bug with simple-ftp that doesn't allow you to mess with directories and then transfer images.
  //so, i am splitting it into two steps. this works and doesn't have any issues
  try {
    console.log('Starting first step')
    const firstStepResult = await moveImages(selectedStore, imagePath, 1);

    console.log("First step result:", firstStepResult);

    console.log('Starting second step')
    
    const secondStepResult = await moveImages(selectedStore, imagePath, 2);

    console.log("Second step result:", secondStepResult);

    res.status(200).send("Images moved successfully in both steps");
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Failed to move images");
  }
};

async function moveImages(selectedStore, imagePath, step) {
  const client = new Client();
  client.ftp.verbose = true;
  let moveToClient = null;
  let storeHost, storeUser, storePW;

  switch (selectedStore.trim().toUpperCase()) {
    case "DIM":
      storeHost = process.env.DIMHOST;
      storeUser = process.env.DIMUSER;
      storePW = process.env.DIMPASSWORD;
      break;
    case "FMS":
      storeHost = process.env.FMSHOST;
      storeUser = process.env.FMSUSER;
      storePW = process.env.FMSPASSWORD;
      break;
    case "FMP":
      storeHost = process.env.FMPHOST;
      storeUser = process.env.FMPUSER;
      storePW = process.env.FMPPASSWORD;
      break;
    case "FPG":
      storeHost = process.env.FPGHOST;
      storeUser = process.env.FPGUSER;
      storePW = process.env.FPGPASSWORD;
      break;
    case "GNP":
      storeHost = process.env.GNPHOST;
      storeUser = process.env.GNPUSER;
      storePW = process.env.GNPPASSWORD;
      break;
    case "RFS":
      storeHost = process.env.RFSHOST;
      storeUser = process.env.RFSUSER;
      storePW = process.env.RFSPASSWORD;
      break;
    case "BMS":
      storeHost = process.env.BMSHOST;
      storeUser = process.env.BMSUSER;
      storePW = process.env.BMSPASSWORD;
    case "MFS":
      storeHost = process.env.MFSHOST;
      storeUser = process.env.MFSUSER;
      storePW = process.env.MFSPASSWORD;
      break;
    default:
      console.log("Store wasn't set in moveImages function.");
      return;
  }

  try {
    if (step == 1) {
      // accessing OCMASTER FTP
      await client.access({
        host: process.env.OCMASTERHOST,
        user: process.env.OCMASTERUSER,
        password: process.env.OCMASTERPASSWORD,
      });

      // ensuring directory exists locally
      const localDir = path.dirname(imagePath);
      fs.mkdirSync(localDir, { recursive: true });

      // downloading file
      await client.downloadTo(imagePath, "/oc_master/image/" + imagePath);

      // Initialize moveToClient here so it can be reused
      moveToClient = new Client();
      moveToClient.ftp.verbose = true;

      // accessing store FTP
      await moveToClient.access({
        host: storeHost,
        user: storeUser,
        password: storePW,
      });

      // extracting directory path from image path
      const directoryPath = imagePath.substring(
        0,
        imagePath.lastIndexOf("/") + 1
      );

      // ensure the directory exists on the target store, and creating it if necessary
      await moveToClient.ensureDir(directoryPath);

      return "Step 1: File downloaded";
    } else if (step == 2) {
      // Ensure moveToClient is accessible for the second step
      if (!moveToClient) {
        moveToClient = new Client();
        moveToClient.ftp.verbose = true;
        await moveToClient.access({
          host: storeHost,
          user: storeUser,
          password: storePW,
        });
      }

      // Uploading the image to the target store
      await moveToClient.uploadFrom(imagePath, imagePath);

      return "Step 2: File uploaded";
    }
  } catch (err) {
    console.log("Error in moveImages:", err);
  } finally {
    client.close();
    if (moveToClient) {
      moveToClient.close();
    }
  }
}

/* START OF UPDATE PRODUCTS */

//truncating table to insert product data
exports.truncateSelectedProductsToUpdateTable = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql =
      "CALL copyProductsToStore.usp_truncate_selected_products_to_update_table()";
    db.query(sql, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database connection failed", error });
  }
};


// Inserting into for product update
exports.insertIntoSelectedProductsToUpdate = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql =
      "CALL copyProductsToStore.usp_insert_into_selected_products_to_update(?, ?, ?)";
    const values = [
      req.body.pID,
      req.body.model,
      req.body.mpn
    ];
    db.query(sql, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database connection failed", error });
  }
};


exports.getProductsToUpdate = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL copyProductsToStore.usp_step_3_get_products_to_update()";
    db.query(sql, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database connection failed", error });
  }
};


exports.updateProductsTo = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL copyProductsToStore.usp_step_4_update_product_to(?)";
    const values = [req.body.selectedStore];
    db.query(sql, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database connection failed", error });
  }
};

/* PRODUCT DESCRIPTION */

// Loading all subsections
exports.getProductDescriptionSubsections = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "Select `subsection`, `path` from subsections WHERE `section` = 'Product Description'";
    db.query(sql, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database connection failed", error });
  }
};

// loading the edit page
exports.viewEditProductDescription = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL usp_get_product_summary_diff_table;";
    db.query(sql, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database connection failed", error });
  }
};

// getting differences on selected product (in the modal)
exports.getProductDescDifferences = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL usp_get_product_description_differences(?);";
    const values = [req.body.difID];
    db.query(sql, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database connection failed", error });
  }
};

// saving to stores
exports.saveProductDescription = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL usp_push_product_description_to_stores(?, ?, ?, ?);";
    const values = [
      req.body.storeId,
      req.body.selectedMPN,
      req.body.selectedModel,
      req.body.descriptionToSave,
    ];
    db.query(sql, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database connection failed", error });
  }
};

// refetching from OCMaster
exports.refetchProductDescriptions = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL usp_get_product_summary_tables()";
    db.query(sql, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database connection failed", error });
  }
};

exports.searchForProducts = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL usp_search_for_products_advanced(?,?,?,?,?,?)";
    const values = [req.body.name, req.body.mpn, req.body.model, req.body.status, req.body.hidden, req.body.searchType];
    db.query(sql, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database connection failed", error });
  }
};

// for loading individual product description table per product
exports.GetProductDescriptionInfo = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL usp_get_product_description_info(?)";
    const values = [req.body.OCMProductID];
    db.query(sql, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database connection failed", error });
  }
};

// updating product description/name/meta
exports.UpdateProductDescriptionName = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL usp_update_product_description(?, ?, ?, ?, ?)";
    const values = [req.body.OCMProductID, req.body.newName, req.body.newDescription, req.body.newMetaKeywords, req.body.newMetaDescription];
    db.query(sql, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database connection failed", error });
  }
};


/* DISCONTINUED PRODUCTS / WHILE SUPPLIES LAST */

// getting discontinued / while supplies last products to display
exports.DiscontinuedDisabledProducts = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL work_area_db.usp_get_discontinued_or_disabled_products()";
    db.query(sql, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database connection failed", error });
  }
};

// Updating discontinued products reason or replacedby
exports.UpdateDiscontinuedOrDisabledProducts = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL work_area_db.usp_update_discontinued_or_disabled_product(?, ?, ?)";
    const values = [req.body.selectedMPN, req.body.selectedReason, req.body.selectedReplacedBy];
    db.query(sql, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database connection failed", error });
  }
};

// Adding new discontinued/disabled product
exports.AddDiscontinuedOrDisabledProduct = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL work_area_db.usp_add_discontinued_or_disabled_product(?, ?, ?)";
    const values = [req.body.selectedMPN, req.body.selectedReason, req.body.selectedReplacedBy];
    db.query(sql, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database connection failed", error });
  }
};