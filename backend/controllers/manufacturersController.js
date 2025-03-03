const connectToDB = require("../model/db");

// Getting all sections
exports.getManufacturersSubsections = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql =
    "Select `subsection`, `path` from subsections WHERE `section` = 'Manufacturers'";
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

//Adding new
exports.addNewManufacturer = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL usp_add_manufacturer(?)";
    const values = [req.body.manufacturerName];
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

//Loading all
exports.viewEditManufacturers = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL usp_get_manufacturers();";
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

// Pushing information description to store
exports.pushManufacturer = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL usp_push_manufacturer_to_store(?, ?)";
    const values = [req.body.selectedStore, req.body.manufacturerID];
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


// Changing manufacturer name on local table. this can be pushed to stores with pushManufacturer
exports.updateManufacturerName = async (req, res) => {
    try {
      const db = await connectToDB();
      const sql = "CALL usp_update_manufacturer_name(?, ?);";
      const values = [req.body.manufacturerID, req.body.editedName];
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