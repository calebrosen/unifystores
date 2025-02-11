const connectToDB = require("../model/db");

// Getting all sections
exports.getSalesagentSubsections = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "Select `subsection`, `path` from subsections WHERE `section` = 'Sales Agent'";
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
exports.addNewSalesAgent = async (req, res) => {
    try {
      const db = await connectToDB();
      const sql = "CALL usp_add_new_sales_agent(?)";
      const values = [req.body.salesAgentName];
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
exports.getSalesAgents = async (req, res) => {
    try {
      const db = await connectToDB();
      const sql = "CALL usp_get_sales_agents()";
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

exports.EditSalesAgent = async (req, res) => {
    try {
      const db = await connectToDB();
        const sql = "CALL usp_edit_sales_agent(?, ?, ?, ?)";
        const values = [
        req.body.selectedID,
        req.body.selectedFName,
        req.body.selectedLName,
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

exports.ImportSalesAgents = async (req, res) => {
    try {
      const db = await connectToDB();
      const sql = "CALL usp_import_sales_agents(?)";
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


