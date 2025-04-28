const connectToDB = require("../model/db");
require("dotenv").config({ path: "../env/.env" });
const fs = require("fs");
const ftp = require("basic-ftp");
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
    const { page = 1, pageSize = 50, searchName = '', searchMPN = '' } = req.query;
    const offset = (page - 1) * pageSize;

    const db = await connectToDB();

    // use promise() so we can await properly
    const [results] = await db.promise().query("CALL copyProductsToStore.usp_get_products_for_unify(?, ?)", [searchName, searchMPN]);

    const allProducts = results[0] || [];
    const totalProducts = allProducts.length;

    const paginatedProducts = allProducts.slice(offset, offset + parseInt(pageSize));

    return res.json({
      products: paginatedProducts,
      total: totalProducts,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(totalProducts / pageSize),
    });

  } catch (error) {
    console.error("Error in getProductsToCopy:", error);
    return res.status(500).json({ message: "Database connection failed", error });
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
    console.warn("[ImageCopy] Missing selectedStore or imagePath:", { selectedStore, imagePath });
    return res.status(400).send("Store and image path are required");
  }

  const localPath = path.join(__dirname, "../temp", path.basename(imagePath));
  fs.mkdirSync(path.dirname(localPath), { recursive: true });

  console.log(`[ImageCopy] Starting copy for image: ${imagePath}`);

  try {
    // Step 1: Download from OCMASTER
    const masterClient = new ftp.Client();
    masterClient.ftp.verbose = false;

    console.log("[ImageCopy] Connecting to OCMASTER FTP...");
    await masterClient.access({
      host: process.env.OCMASTERHOST,
      user: process.env.OCMASTERUSER,
      password: process.env.OCMASTERPASSWORD,
    });
    console.log("[ImageCopy] Connected to OCMASTER FTP.");

    const masterImagePath = `/oc_master/image/${imagePath}`;
    console.log(`[ImageCopy] Downloading from master FTP: ${masterImagePath}`);
    await masterClient.downloadTo(localPath, masterImagePath);
    console.log("[ImageCopy] Downloaded image to local temp folder.");

    await masterClient.close();
    console.log("[ImageCopy] Closed connection to OCMASTER FTP.");

    // Step 2: Upload to selected store
    console.log(`[ImageCopy] Preparing to upload to store: ${selectedStore}`);
    const storeCreds = getStoreFtpCredentials(selectedStore);
    if (!storeCreds) {
      console.error("[ImageCopy] Invalid store code:", selectedStore);
      return res.status(400).send("Invalid store code");
    }

    const storeClient = new ftp.Client();
    storeClient.ftp.verbose = false;

    console.log(`[ImageCopy] Connecting to store FTP (${selectedStore})...`);
    await storeClient.access(storeCreds);
    console.log(`[ImageCopy] Connected to store FTP.`);

    const folderPath = path.posix.dirname(imagePath);
    const fileName = path.basename(imagePath);

    const segments = folderPath.split("/").filter(Boolean);
    for (const segment of segments) {
      try {
        await storeClient.cd(segment);
        console.log(`[ImageCopy] Changed into folder: ${segment}`);
      } catch {
        console.log(`[ImageCopy] Folder not found, creating folder: ${segment}`);
        await storeClient.send("MKD " + segment);
        await storeClient.cd(segment);
      }
    }

    console.log(`[ImageCopy] Uploading image ${fileName} to store FTP...`);
    await storeClient.uploadFrom(localPath, fileName);
    console.log("[ImageCopy] Upload successful.");

    await storeClient.close();
    console.log("[ImageCopy] Closed connection to store FTP.");

    // Cleanup local temp file
    fs.unlinkSync(localPath);
    console.log("[ImageCopy] Cleaned up local temp file.");

    res.status(200).send("Images moved successfully in both steps");
  } catch (error) {
    console.error("[ImageCopy] Error during image transfer:", error.message || error);
    res.status(500).send("Failed to move images");
  }
};

// function to return FTP credentials based on store code
function getStoreFtpCredentials(code) {
  const store = code.trim().toUpperCase();
  const creds = {
    DIM: ["DIMHOST", "DIMUSER", "DIMPASSWORD"],
    FMS: ["FMSHOST", "FMSUSER", "FMSPASSWORD"],
    FMP: ["FMPHOST", "FMPUSER", "FMPPASSWORD"],
    FPG: ["FPGHOST", "FPGUSER", "FPGPASSWORD"],
    GNP: ["GNPHOST", "GNPUSER", "GNPPASSWORD"],
    RFS: ["RFSHOST", "RFSUSER", "RFSPASSWORD"],
    BMS: ["BMSHOST", "BMSUSER", "BMSPASSWORD"],
    MFS: ["MFSHOST", "MFSUSER", "MFSPASSWORD"],
    MHS: ["MHSHOST", "MHSUSER", "MHSPASSWORD"]
  };

  if (!creds[store]) return null;

  return {
    host: process.env[creds[store][0]],
    user: process.env[creds[store][1]],
    password: process.env[creds[store][2]]
  };
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


// inserting into for product update
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