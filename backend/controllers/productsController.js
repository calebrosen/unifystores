const connectToDB = require("../model/db");
require("dotenv").config({ path: "../env/.env" });
const fs = require("fs");
const { Client } = require("basic-ftp");
const path = require("path");

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
    const sql = "CALL copyProductsToStore.GetProductsForUnify()";
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
    const sql = "CALL copyProductsToStore.uspStep1_GetMasterTablesCopy()";
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
    const sql = "CALL copyProductsToStore.GetProductsForViewingCopy(?)";
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
      "CALL copyProductsToStore.InsertIntoSelectedProductsToCopy(?, ?, ?, ?)";
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
      "CALL copyProductsToStore.TruncateSelectedProductsToCopyTable()";
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
    const sql = "CALL copyProductsToStore.uspStep2_GetTargetData(?)";
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
    const sql = "CALL copyProductsToStore.uspStep3_GetProductsToCopy()";
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
    const sql = "CALL copyProductsToStore.uspStep4_CopyProductsTo(?)";
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
    const sql = "CALL copyProductsToStore.uspStep5_CopyImagesToStore()";
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

exports.pushCustomerGroups = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL PushCustomerGroupToStore(?, ?)";
    const values = [req.body.selectedStore, req.body.customerGroupID];
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

exports.pushCustomerGroups = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL PushCustomerGroupToStore(?, ?)";
    const values = [req.body.selectedStore, req.body.customerGroupID];
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

exports.pushCustomerGroups = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL PushCustomerGroupToStore(?, ?)";
    const values = [req.body.selectedStore, req.body.customerGroupID];
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

exports.pushCustomerGroups = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL PushCustomerGroupToStore(?, ?)";
    const values = [req.body.selectedStore, req.body.customerGroupID];
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

exports.pushCustomerGroups = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL PushCustomerGroupToStore(?, ?)";
    const values = [req.body.selectedStore, req.body.customerGroupID];
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

exports.pushCustomerGroups = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL PushCustomerGroupToStore(?, ?)";
    const values = [req.body.selectedStore, req.body.customerGroupID];
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
