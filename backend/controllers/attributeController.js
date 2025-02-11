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
    const sql = "Call usp_get_attributes()";
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
    const sql = "Call usp_get_products_for_attribute_copy(?)";
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
    const sql = "Call usp_copy_attributes_from_ocmaster_to_store(?, ?, ?);";
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
    const sql = "Call usp_preview_products_for_attribute_copy(?, ?);";
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
