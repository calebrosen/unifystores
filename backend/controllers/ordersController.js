const connectToDB = require("../model/db");

// Getting all sections
exports.getOrderStatusSubsections = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "Select `subsection`, `path` from subsections WHERE `section` = 'Order Status'";
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

// ADding new
exports.addNewOrderStatus = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL usp_add_order_status(?)";
    const values = [req.body.orderStatusName];
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

// Loading all
exports.viewEditOrderStatusName = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL usp_get_order_statuses();";
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

// Changing name on local table
exports.updateOrderStatusName = async (req, res) => {
    try {
      const db = await connectToDB();
      const sql = "CALL usp_update_order_status_name(?, ?);";
      const values = [req.body.order_status_id, req.body.editedName];
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

  exports.pushOrderStatus = async (req, res) => {
    try {
      const db = await connectToDB();
      const sql = "CALL usp_push_order_status_to_store(?, ?)";
      const values = [req.body.selectedStore, req.body.orderStatusID];
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


