const connectToDB = require("../model/db");

// Loading all subsections
exports.getAttributeSections = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql =
      "SELECT `subsection`, `path` FROM subsections WHERE `section` = 'Attributes'";

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

// Getting all attributes
exports.getAttributes = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "Call GetAttributes()";
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

// Getting all products on OCMaster with selected attribute
exports.getProductsForAttributeCopy = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "Call GetProductsForAttributeCopy(?)";
    const values = [req.body.selectedAttribute];
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

// Getting all products on OCMaster with selected attribute
exports.copyAttributesFromOCMasterToStore = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "Call CopyAttributesFromOCMasterToStore(?, ?, ?);";
    const values = [req.body.selectedStore, req.body.selectedAttribute, req.body.productIdsString];
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


// Copying attributes from OCMaster to the selected store
exports.previewProductsForAttributeCopy = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "Call PreviewProductsForAttributeCopy(?, ?);";
    const values = [req.body.selectedStore, req.body.selectedAttribute];
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
