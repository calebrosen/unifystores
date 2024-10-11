
require("dotenv").config({ path: "./env/.env" });
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const mysql = require("mysql");
const fs = require("fs");
const { Client } = require("basic-ftp");
const path = require("path");
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
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

app.get("/salesagent", (req, res) => {
  const sql =
    "Select `subsection`, `path` from subsections WHERE `section` = 'Sales Agent'";
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

const attributeRoutes = require('./routes/attributes');
const authRoutes = require('./routes/auth');
const countriesRoutes = require('./routes/countries');
const couponRoutes = require('./routes/coupons');
const customerRoutes = require('./routes/customers');
const dashboardRoutes = require('./routes/dashboard');
// const filterRoutes = require('./routes/filters');
// const informationRoutes = require('./routes/information');
// const loginRoutes = require('./routes/login');
// const manufacturerRoutes = require('./routes/manufacturers');
// const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');
// const salesAgentRoutes = require('./routes/salesagents');
// const sectionRoutes = require('./routes/sections');
// const stockStatusRoutes = require('./routes/stockstatus');
const storeRoutes = require('./routes/stores');
// const zoneRoutes = require('./routes/zone');


app.use('/node/auth', authRoutes);
app.use('/node/attributes', attributeRoutes);
app.use('/node/countries', countriesRoutes);
app.use('/node/coupons', couponRoutes);
app.use('/node/customers', customerRoutes);
app.use('/node/dashboard', dashboardRoutes);
// app.use('/node/filters', filterRoutes);
// app.use('/node/information', informationRoutes);
// app.use('/node/login', loginRoutes);
// app.use('/node/manufacturers', manufacturerRoutes);
// app.use('/node/orders', orderRoutes);
app.use('/node/products', productRoutes);
// app.use('/node/salesagents', salesAgentRoutes);
// app.use('/node/sections', sectionRoutes);
// app.use('/node/stockstatus', stockStatusRoutes);
app.use('/node/stores', storeRoutes);
// app.use('/node/zones', zoneRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

