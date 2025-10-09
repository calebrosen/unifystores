const connectToDB = require("../model/db");
require("dotenv").config({ path: "../env/.env" });
const { PassThrough } = require("stream");
const fs = require("fs");
const ftp = require("basic-ftp");
const { Readable, Writable } = require("stream");
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

// buffer function for image copy to not have too many actions at once
async function downloadToBuffer(client, remotePath) {
  const chunks = [];
  const writer = new Writable({
    write(chunk, encoding, callback) {
      chunks.push(chunk);
      callback();
    }
  });
  await client.downloadTo(writer, remotePath);
  return Buffer.concat(chunks);
}

exports.CopyProducts_CopyImagesToStore_Action = async (req, res) => {
  let { selectedStore, images } = req.body;
  console.log("[image-copy] start for store:", selectedStore);

  if (!selectedStore || !Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ message: "Store and images array required" });
  }

  // filtering out any empty paths
  images = images.filter(p => typeof p === "string" && p.trim());

  const master = new ftp.Client();
  const store  = new ftp.Client();
  master.ftp.verbose = false;
  store.ftp.verbose  = false;

  let success = 0, missing = 0, errors = 0;

  try {
    // connect once
    console.log("[image-copy] master FTP connect…");
    await master.access({
      host:     process.env.OCMASTERHOST,
      user:     process.env.OCMASTERUSER,
      password: process.env.OCMASTERPASSWORD,
    });
    console.log("[image-copy] master ✔");

    const creds = getStoreFtpCredentials(selectedStore);
    if (!creds) throw new Error(`Invalid store: ${selectedStore}`);
    console.log("[image-copy] store FTP connect…");
    await store.access(creds);
    console.log("[image-copy] store ✔");

    for (let imagePath of images) {
      await store.cd("/");
      console.log("[image-copy] cwd reset to", await store.pwd());
      const remoteMasterPath = `/oc_master/image/${imagePath}`;
      const fileName         = path.basename(imagePath);
      console.log(`\n[image-copy] ➡️  ${remoteMasterPath}`);

      // ensuring path exists on master
      try {
        await master.size(remoteMasterPath);
      } catch (_) {
        console.warn(`⚠️ missing on master: ${remoteMasterPath}`);
        missing++;
        continue;
      }

      // ensuring folder strucutre on store
      const dir = path.posix.dirname(imagePath);
      console.log(`  • ensure remote folder: ${dir}`);
      for (let seg of dir.split("/").filter(Boolean)) {
        try {
          await store.cd(seg);
        } catch {
          console.log(`  • mkd ${seg}`);
          await store.send("MKD " + seg);
          await store.cd(seg);
        }
      }

      // downloading to memory and uploading to store
      try {
        console.log(`  • downloading into memory…`);
        const buffer = await downloadToBuffer(master, remoteMasterPath);

        console.log(`  • uploading to store: ${fileName}`);
        await store.uploadFrom(Readable.from(buffer), fileName);

        console.log(`✅ copied ${remoteMasterPath}`);
        success++;
      } catch (err) {
        console.error(`❌ error on ${remoteMasterPath}:`, err.message || err);
        errors++;
      }
    }

    const msg = `Done. ${success} copied, ${missing} missing, ${errors} errors.`;
    console.log("[bulk-image-copy] summary:", msg);
    return res.json({ success: errors === 0, message: msg });
  }
  catch (fatal) {
    console.error("[bulk-image-copy] fatal:", fatal);
    return res.status(500).json({ success: false, message: fatal.message });
  }
  finally {
    master.close();
    store.close();
    console.log("[bulk-image-copy] connections closed");
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
    GCL: ["GCLHOST", "GCLUSER", "GCLPASSWORD"],
    IRG: ["IRGHOST", "IRGUSER", "IRGPASSWORD"]
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
    const sql = "CALL usp_search_for_products_advanced(?,?,?,?,?)";
    const values = [req.body.name, req.body.mpn, req.body.model, req.body.status, req.body.hidden];
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



/* PRODUCT PROMOTIONS */

exports.GetProductPromotions = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL unify.usp_get_product_promotions()";
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

exports.UpdateProductPromotion = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL unify.usp_update_product_promotion(?, ?, ?, ?, ?, ?)";
    const values = [
      req.body.mpn,
      req.body.promo_price,
      req.body.start_date,
      req.body.end_date,
      req.body.promo_status,
      req.body.promo_notes
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

exports.AddProductPromotion = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL unify.usp_add_product_promotion(?, ?, ?, ?, ?, ?)";
    const values = [
      req.body.mpn,
      req.body.promo_price,
      req.body.start_date,
      req.body.end_date,
      req.body.promo_status,
      req.body.promo_notes
    ];
    db.query(sql, values, (err, data) => {
      if (err) {
        return res.status(500).json(err);
      }
      return res.json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database connection failed", error });
  }
};


exports.UpdateProductPromotion = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL unify.usp_update_product_promotion(?, ?, ?, ?, ?, ?, ?)";
    const values = [
      req.body.promo_id,
      req.body.mpn,
      req.body.promo_price,
      req.body.start_date,
      req.body.end_date,
      req.body.promo_status,
      req.body.promo_notes
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
