const connectToDB = require("../model/db");

// Loading all subsections
exports.getFiltersSections = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql =
      "SELECT `subsection`, `path` FROM subsections WHERE `section` = 'Filters'";

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


exports.getCategoryFilterLogicTable = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql =
      "SELECT * FROM oc_master.category_filter_logic ORDER BY 3 ASC";

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

exports.updateCategoryFilterLogicTable = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql =
      "CALL oc_master.usp_update_category_filter_logic_table()";

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

exports.getFilterGroupNamesForCategory = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL unify.usp_get_filter_names(?);";
    const values = [req.body.filter_group_ids];
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

exports.getAllFilterGroups = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "SELECT * FROM oc_master.filter_group_description;";
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

exports.getFilterGroupsByCategoryID = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL unify.get_filter_groups_by_category_id(?);";
    const vcalues = [req.body.category_id];
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

exports.getAllCategoriesWithFilterGroups = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL unify.usp_get_all_categories_with_filter_groups();";
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

exports.saveCategoryFilter = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL unify.usp_save_category_filter(?, ?);";
    const values = [req.body.category_id, req.body.filter_group_ids];
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
