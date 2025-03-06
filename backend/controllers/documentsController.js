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
    const sql = "CALL unify.usp_generate_documents_html()";
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