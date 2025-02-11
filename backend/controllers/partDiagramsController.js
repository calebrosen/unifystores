const connectToDB = require("../model/db");

// Getting all sections
exports.getPartDiagramsSubsections = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "Select `subsection`, `path` from subsections WHERE `section` = 'Part Diagrams'";
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

  exports.pushPartDiagrams = async (req, res) => {
    try {
      const db = await connectToDB();
      const sql = "CALL usp_push_part_diagrams(?)";
      const values = [req.body.selectedStore];
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


