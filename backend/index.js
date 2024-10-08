require("dotenv").config({ path: "./env/.env" });
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const fs = require("fs");
const { Client } = require("basic-ftp");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

const unify = mysql.createConnection({
  host: process.env.UBUNTUHOST,
  user: process.env.UBUNTUUSER,
  password: process.env.UBUNTUPASSWORD,
  database: process.env.UNIFYDB,
  port: process.env.UBUNTUPORT,
});

const federated = mysql.createConnection({
  host: process.env.UBUNTUHOST,
  user: process.env.UBUNTUUSER,
  password: process.env.UBUNTUPASSWORD,
  database: process.env.FEDERATEDB,
  port: process.env.UBUNTUPORT,
});

const copyProducts = mysql.createConnection({
  host: process.env.UBUNTUHOST,
  user: process.env.UBUNTUUSER,
  password: process.env.UBUNTUPASSWORD,
  database: process.env.COPYPRODUCTSDB,
  port: process.env.UBUNTUPORT,
});

app.get("/", (re, res) => {
  return res.json("from backend");
});

app.get("/sections", (req, res) => {
  const sql = "Select `section`, `path` from sections";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/fetchStores", (req, res) => {
  const sql = "Select * from managed_stores WHERE ms_status = 1";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/coupons", (req, res) => {
  const sql =
    "Select `subsection`, `path` from subsections WHERE `section` = 'Coupons'";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/information", (req, res) => {
  const sql =
    "Select `subsection`, `path` from subsections WHERE `section` = 'Information'";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/viewEditInformation", (req, res) => {
  const sql = "CALL GetInformationDescription();";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/saveInformation", (req, res) => {
  const sql = "CALL SaveInformationDescription(?, ?);";
  const values = [req.body.selectedInformation, req.body.inputValue];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/pushInformation", (req, res) => {
  const sql = "CALL PushInformationDescription(?, ?)";
  const values = [req.body.selectedStore, req.body.selectedInformation];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/partDiagrams", (req, res) => {
  const sql =
    "Select `subsection`, `path` from subsections WHERE `section` = 'Part Diagrams'";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/manufacturers", (req, res) => {
  const sql =
    "Select `subsection`, `path` from subsections WHERE `section` = 'Manufacturers'";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/pushManufacturer", (req, res) => {
  const sql = "CALL PushManufacturerToStore(?, ?)";
  const values = [req.body.selectedStore, req.body.manufacturerID];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/viewEditManufacturers", (req, res) => {
  const sql = "CALL GetManufacturers();";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/addNewManufacturer", (req, res) => {
  const sql = "CALL AddManufacturer(?)";
  const values = [req.body.manufacturerName];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/updateManufacturerName", (req, res) => {
  const sql = "CALL UpdateManufacturerName(?, ?);";
  const values = [req.body.manufacturerID, req.body.editedName];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/pushPartDiagrams", (req, res) => {
  const sql = "CALL PushPartDiagrams(?)";
  const values = [req.body.selectedStore];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/orderStatus", (req, res) => {
  const sql =
    "Select `subsection`, `path` from subsections WHERE `section` = 'Order Status'";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/viewEditOrderStatusName", (req, res) => {
  const sql = "CALL GetOrderStatuses();";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/updateOrderStatusName", (req, res) => {
  const sql = "CALL UpdateOrderStatusName(?, ?);";
  const values = [req.body.order_status_id, req.body.editedName];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/addNewOrderStatus", (req, res) => {
  const sql = "CALL AddOrderStatus(?)";
  const values = [req.body.orderStatusName];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/pushOrderStatus", (req, res) => {
  const sql = "CALL PushOrderStatusToStore(?, ?)";
  const values = [req.body.selectedStore, req.body.orderStatusID];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/stockstatus", (req, res) => {
  const sql =
    "Select `subsection`, `path` from subsections WHERE `section` = 'Stock Status'";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/addNewStockStatus", (req, res) => {
  const sql = "CALL AddStockStatus(?)";
  const values = [req.body.stockStatusName];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/viewEditStockStatusName", (req, res) => {
  const sql = "CALL GetStockStatuses();";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/pushStockStatus", (req, res) => {
  const sql = "CALL PushStockStatusToStore(?, ?)";
  const values = [req.body.selectedStore, req.body.stockStatusID];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/addNewSalesAgent", (req, res) => {
  const sql = "CALL AddNewSalesAgent(?)";
  const values = [req.body.salesAgentName];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/ImportSalesAgents", (req, res) => {
  const sql = "CALL ImportSalesAgents(?)";
  const values = [req.body.selectedStore];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/getSalesAgents", (req, res) => {
  const sql = "CALL GetSalesAgents()";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/EditSalesAgent", (req, res) => {
  const sql = "CALL EditSalesAgent(?, ?, ?, ?)";
  const values = [
    req.body.selectedID,
    req.body.selectedFName,
    req.body.selectedLName,
    req.body.selectedStatus,
  ];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/customergroups", (req, res) => {
  const sql =
    "Select `subsection`, `path` from subsections WHERE `section` = 'Customer Groups'";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/addNewCustomerGroup", (req, res) => {
  const sql = "CALL AddNewCustomerGroup(?)";
  const values = [req.body.customerGroupName];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/viewEditCustomerGroupName", (req, res) => {
  const sql = "CALL GetCustomerGroups();";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/editCustomerGroupName", (req, res) => {
  const sql = "CALL UpdateCustomerGroupName(?, ?);";
  const values = [req.body.customerGroupID, req.body.name];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/pushCustomerGroups", (req, res) => {
  const sql = "CALL PushCustomerGroupToStore(?, ?)";
  const values = [req.body.selectedStore, req.body.customerGroupID];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/salesagent", (req, res) => {
  const sql =
    "Select `subsection`, `path` from subsections WHERE `section` = 'Sales Agent'";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/fetchAgents", (req, res) => {
  const sql = "Select `Agent`, `AgentID` from CouponAgentList WHERE Status = 1";
  federated.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/createCoupon", (req, res) => {
  const sql = "CALL CreateCoupon(?, ?, ?, ?);";
  const values = [
    req.body.selectedAgent,
    req.body.selectedStore,
    req.body.amount,
    req.body.couponCode,
  ];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data);
  });
});

app.post("/selectCoupons", (req, res) => {
  const sql = "CALL SelectCoupons(?);";
  const values = [req.body.selectedStore];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/updateCoupon", (req, res) => {
  const sql = "CALL UpdateCoupon(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
  const values = [
    req.body.selectedStore,
    req.body.coupon_id,
    req.body.name,
    req.body.code,
    req.body.type,
    req.body.discount,
    req.body.date_start,
    req.body.date_end,
    req.body.uses_total,
    req.body.status,
  ];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/deleteCoupon", (req, res) => {
  const sql = "CALL DeleteCoupon(?, ?, ?);";
  const values = [req.body.selectedStore, req.body.coupon_id, req.body.code];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/countries", (req, res) => {
  const sql =
    "Select `subsection`, `path` from subsections WHERE `section` = 'Countries'";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/getCountries", (req, res) => {
  const sql = "Call GetCountries()";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/editCountryOnStore", (req, res) => {
  const sql = "Call EditCountryOnStore(?, ?, ?)";
  const values = [
    req.body.selectedStore,
    req.body.countryID,
    req.body.selectedStatus,
  ];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/disableCountry", (req, res) => {
  const sql = "Call DisableCountryOnAllStores(?)";
  const values = [req.body.selectedCountryID];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/viewEnabledCountries", (req, res) => {
  const sql = "Call ViewEnabledCountries();";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/zones", (req, res) => {
  const sql =
    "Select `subsection`, `path` from subsections WHERE `section` = 'Zones'";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/getZones", (req, res) => {
  const sql = "Call GetZones()";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/editZonesOnStore", (req, res) => {
  const sql = "Call EditZonesOnStore(?, ?, ?)";
  const values = [
    req.body.selectedStore,
    req.body.zoneID,
    req.body.selectedStatus,
  ];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/disableZone", (req, res) => {
  const sql = "Call DisableZoneOnAllStores(?)";
  const values = [req.body.selectedZoneID];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/viewEnabledZones", (req, res) => {
  const sql = "Call ViewEnabledZones();";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/attributes", (req, res) => {
  const sql =
    "SELECT `subsection`, `path` FROM subsections WHERE `section` = 'Attributes'";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);

    return res.json(data);
  });
});

app.get("/GetAttributes", (req, res) => {
  const sql = "Call GetAttributes()";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/GetProductsForAttributeCopy", (req, res) => {
  const sql = "Call GetProductsForAttributeCopy(?);";
  const values = [req.body.selectedAttribute];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/PreviewProductsForAttributeCopy", (req, res) => {
  const sql = "Call PreviewProductsForAttributeCopy(?, ?);";
  const values = [req.body.selectedStore, req.body.selectedAttribute];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/GetAttributeGroups", (req, res) => {
  const sql = "Select * from `attribute_group_description`";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/addNewAttributeGroup", (req, res) => {
  const sql = "Call AddNewAttributeGroup(?);";
  const values = [req.body.attributeGroupName];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/products", (req, res) => {
  const sql =
    "Select `subsection`, `path` from subsections WHERE `section` = 'products'";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/productdescription", (req, res) => {
  const sql =
    "Select `subsection`, `path` from subsections WHERE `section` = 'Product Description'";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/viewEditProductDescription", (req, res) => {
  const sql = "CALL GetProduct_summary_dif_table;";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/getProductsForRelease", (req, res) => {
  const sql = "CALL GetProductForRelease(?)";
  const values = [req.body.selectedStore];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/releaseProductOnStore", (req, res) => {
  const sql = "CALL ReleaseProductOnStore(?, ?, ?, ?)";
  const values = [
    req.body.selectedStore,
    req.body.releaseQuantity,
    req.body.productID,
    req.body.selectedMPN,
  ];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/searchProducts", (req, res) => {
  const sql = "CALL SearchForProducts(?, ?, ?)";
  const values = [
    req.body.searchMPN,
    req.body.searchName,
    req.body.searchStatus,
  ];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/getProductDescDifferences", (req, res) => {
  const sql = "CALL GetProduct_description_differences(?);";
  const values = [req.body.difID];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/saveProductDescription", (req, res) => {
  const sql = "CALL PushProductDescriptionToStores(?, ?, ?, ?);";
  const values = [
    req.body.storeId,
    req.body.selectedMPN,
    req.body.selectedModel,
    req.body.descriptionToSave,
  ];
  unify.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/refetchProductDescriptions", (req, res) => {
  const sql = "CALL GetProductSummaryTables()";
  unify.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/RefetchOCMasterTables", (req, res) => {
  const sql = "CALL uspStep1_GetMasterTablesCopy()";
  copyProducts.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/getProductsToCopy", (req, res) => {
  const sql = "CALL GetProductsForUnify()";
  copyProducts.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/getProductsForViewingCopy", (req, res) => {
  const sql = "CALL GetProductsForViewingCopy(?)";
  const values = [req.body.tempProductIdsString];
  copyProducts.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/insertIntoSelectedProductsToCopy", (req, res) => {
  const sql = "CALL InsertIntoSelectedProductsToCopy(?, ?, ?, ?)";
  const values = [
    req.body.pID,
    req.body.model,
    req.body.mpn,
    req.body.force_copy,
  ];
  copyProducts.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/truncateSelectedProductsToCopyTable", (req, res) => {
  const sql = "CALL TruncateSelectedProductsToCopyTable()";
  copyProducts.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/CopyProducts_GetTargetData", (req, res) => {
  const sql = "CALL uspStep2_GetTargetData(?)";
  const values = [req.body.selectedStore];
  copyProducts.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/CopyProducts_GetProductsToCopy", (req, res) => {
  const sql = "CALL uspStep3_GetProductsToCopy()";
  copyProducts.query(sql, (err, data) => {
    if (err) {
      console.log("Error:", err);
      return res.json(err);
    }
    return res.json(data);
  });
});

app.post("/CopyProducts_CopyProductsToStore", (req, res) => {
  const sql = "CALL uspStep4_CopyProductsTo(?)";
  const values = [req.body.selectedStore];
  copyProducts.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/CopyProducts_CopyImagesToStore", (req, res) => {
  const sql = "CALL uspStep5_CopyImagesToStore()";
  copyProducts.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// copying images to store
app.post("/CopyProducts_CopyImagesToStore_Action", async (req, res) => {
  const { selectedStore, imagePath } = req.body;
  if (!selectedStore || !imagePath) {
    return res.status(400).send("Store and image path are required");
  }

  //there is a bug with simple-ftp that doesn't allow you to mess with directories and then transfer images.
  //so, i am splitting it into two steps. this works and doesn't have any issues
  try {
    const firstStepResult = await moveImages(selectedStore, imagePath, 1);

    console.log("First step result:", firstStepResult);

    const secondStepResult = await moveImages(selectedStore, imagePath, 2);

    console.log("Second step result:", secondStepResult);

    res.status(200).send("Images moved successfully in both steps");
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Failed to move images");
  }
});

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



// maintaining login state
const jwt = require("jsonwebtoken");
const SECRET_KEY = "1RGS3CR3T";

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM users WHERE username = ? AND pw = ?";
  const values = [req.body.username, req.body.password];
  unify.query(sql, values, (err, data) => {
    if (err) return res.status(500).json({ message: "Login Failed" });
    if (data.length > 0) {
      const token = jwt.sign({ id: data[0].id }, SECRET_KEY, {
        expiresIn: "6h",
      });
      return res.json({ message: "Login successful", token });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  });
});

app.listen(8081, () => {
  console.log("Server running on port 8081");
});
