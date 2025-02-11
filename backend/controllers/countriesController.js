const connectToDB = require("../model/db");

// Loading all subsections
exports.getSubsections = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "Select `subsection`, `path` from subsections WHERE `section` = 'Countries'";
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

// Getting enabled countries (other than USA)
exports.viewEnabledCountries = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "Call usp_view_enabled_countries();";
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

// Disabling selected country on ALL stores
exports.disableCountry = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "Call usp_disable_country_on_all_stores(?)";
    const values = [req.body.selectedCountryID];
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

  exports.editCountryOnStore = async (req, res) => {
    try {
      const db = await connectToDB();
      const sql = "Call usp_edit_country_on_store(?, ?, ?)";
      const values = [
        req.body.selectedStore,
        req.body.countryID,
        req.body.selectedStatus,
      ];
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

  exports.getCountries = async (req, res) => {
    try {
      const db = await connectToDB();
      const sql = "Call usp_get_countries()";
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



