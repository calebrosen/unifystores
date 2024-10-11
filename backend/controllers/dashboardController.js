
const connectToDB = require("../model/db");

// Loading all sections on the dashboard
exports.mainDashboard = async (req, res) => {
    try {
      const db = await connectToDB();
      const sql = "SELECT `section`, `path` FROM sections";
      
      db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
      });
    } catch (error) {
      return res.status(500).json({ message: "Database connection failed", error });
    }
  };