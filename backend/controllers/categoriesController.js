const connectToDB = require("../model/db");

// Getting all sections
exports.getCategoriesSubsections = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql =
      "Select `subsection`, `path` from subsections WHERE `section` = 'Categories'";
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

exports.fetchOCMasterCategories = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "Call GetOCMasterCategories()";
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

exports.InsertCategoryIDsToCopy = async (req, res) => {
  try {
    const ids = req.body.categoryIDsToPush.toString();
    const db = await connectToDB();
    const sql = "Call InsertCategoryIDsToCopy(?)";
    const values = [ids];
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

exports.GenerateCategoriesForPreviews = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "Call copyProductsToStore.GetCategoryStructureForCopy()";
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
