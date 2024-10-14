const connectToDB = require("../model/db");

// Getting all sections
exports.getZonesSubsections = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "Select `subsection`, `path` from subsections WHERE `section` = 'Zones'";
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

exports.getZones = async (req, res) => {
    try {
      const db = await connectToDB();
      const sql = "Call GetZones()";
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

exports.viewEnabledZones = async (req, res) => {
    try {
      const db = await connectToDB();
      const sql = "Call ViewEnabledZones();";
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

exports.editZonesOnStore = async (req, res) => {
    try {
      const db = await connectToDB();
      const sql = "Call EditZonesOnStore(?, ?, ?)";
      const values = [
        req.body.selectedStore,
        req.body.zoneID,
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

// disabling zoneID on all stores
exports.disableZone = async (req, res) => {
    try {
      const db = await connectToDB();
      const sql = "Call DisableZoneOnAllStores(?)";
      const values = [req.body.selectedZoneID];
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


