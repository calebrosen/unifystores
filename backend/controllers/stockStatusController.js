const connectToDB = require("../model/db");

// Getting all sections
exports.getStockstatusSubsections = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "Select `subsection`, `path` from subsections WHERE `section` = 'Stock Status'";
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

// Adding new to local
exports.addNewStockStatus = async (req, res) => {
    try {
      const db = await connectToDB();
      const sql = "CALL usp_add_stock_status(?)";
      const values = [req.body.stockStatusName];
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

// Getting all
exports.updateStockStatusName = async (req, res) => {
    try {
      const db = await connectToDB();
      const sql = "";
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

exports.viewEditStockStatusName = async (req, res) => {
    try {
      const db = await connectToDB();
      const sql = "CALL usp_get_stock_statuses();";
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

exports.pushStockStatus = async (req, res) => {
    try {
      const db = await connectToDB();
      const sql = "CALL PushStockStatusToStore(?, ?)";
      const values = [req.body.selectedStore, req.body.stockStatusID];
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


