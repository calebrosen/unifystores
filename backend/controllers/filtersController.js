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