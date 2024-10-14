const connectToDB = require("../model/db");

// Getting all sections
exports.getInformationSubsections = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql =
      "Select `subsection`, `path` from subsections WHERE `section` = 'Information'";
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

// Loading all
exports.viewEditInformation = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL GetInformationDescription();";
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

// Saving
exports.saveInformation = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL SaveInformationDescription(?, ?);";
    const values = [req.body.selectedInformation, req.body.inputValue];
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

// Pushing information description to store
exports.pushInformation = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL PushInformationDescription(?, ?)";
    const values = [req.body.selectedStore, req.body.selectedInformation];
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
