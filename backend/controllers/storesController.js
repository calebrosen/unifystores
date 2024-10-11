const connectToDB = require("../model/db");

// Getting all stores
exports.getAllStores = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "Select * from managed_stores WHERE ms_status = 1";
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
