const connectToDB = require("../model/db");

// Loading all subsections
exports.getCustomerGroupSubsections = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql =
      "Select `subsection`, `path` from subsections WHERE `section` = 'Customer Groups'";
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

exports.addNewCustomerGroup = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL AddNewCustomerGroup(?)";
    const values = [req.body.customerGroupName];
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

exports.viewEditCustomerGroupName = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL GetCustomerGroups();";
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

exports.editCustomerGroupName = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL UpdateCustomerGroupName(?, ?);";
    const values = [req.body.customerGroupID, req.body.name];
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

exports.pushCustomerGroups = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL PushCustomerGroupToStore(?, ?)";
    const values = [req.body.selectedStore, req.body.customerGroupID];
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