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
    const sql = "Call usp_get_ocmaster_categories()";
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


// COPY CATEGORIES
// COPY CATEGORIES
// COPY CATEGORIES

exports.InsertCategoryIDsToCopy = async (req, res) => {
  try {
    const ids = req.body.categoryIDsToCopy.toString();
    const db = await connectToDB();
    // this is on unify db, everything involving copying afterwards will be on copyProductsToStore db
    const sql = "Call usp_insert_category_ids_to_copy(?)";
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
    const sql = "Call copyProductsToStore.usp_copy_category_step_1_get_category_structure_for_copy()";
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

exports.CopyCategoriesAction = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "Call copyProductsToStore.usp_copy_category_step_2_copy_source_to_target()";
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

// END COPY CATEGORIES
// END COPY CATEGORIES
// END COPY CATEGORIES