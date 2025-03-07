const connectToDB = require("../model/db");

// Loading all subsections
exports.getSubsections = async (req, res) => {
    try {
      const db = await connectToDB();
      const sql =
        "SELECT `subsection`, `path` FROM subsections WHERE `section` = 'Documents'";
  
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


// pulling out file paths for the documents
exports.getFilePaths = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL unify.usp_get_document_paths()";
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

// pulling out filtered file paths for the documents
exports.getFilteredFilePaths = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL unify.usp_get_filtered_document_paths(?, ?, ?, ?)";
    const values = [req.body.selectedBrand, req.body.selectedCategory, req.body.selectedYear, req.body.selectedFileType];
    console.log(values);
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