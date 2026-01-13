const connectToDB = require("../model/db");

// Loading all subsections
exports.getSubsections = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql =
      "Select `subsection`, `path` from subsections WHERE `section` = 'Coupons'";
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

// Getting all attributes
exports.fetchAgents = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql =
      "Select `agent_name` as 'Agent', agent_id as 'AgentID' from work_area_db.coupon_agent_list WHERE Status = 1";
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

// creating coupon on selected store. Agent may be ADMIN or a real sales agent
exports.createCoupon = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL usp_create_coupon(?, ?, ?, ?);";
    const values = [
      req.body.selectedAgent,
      req.body.selectedStore,
      req.body.amount,
      req.body.couponCode,
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

// Getting all coupons on the selected store
exports.selectCoupons = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL usp_select_coupons(?);";
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

// Updating coupon
exports.updateCoupon = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL usp_update_coupon(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    const values = [
      req.body.selectedStore,
      req.body.coupon_id,
      req.body.name,
      req.body.code,
      req.body.type,
      req.body.discount,
      req.body.date_start,
      req.body.date_end,
      req.body.uses_total,
      req.body.status,
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

exports.deleteCoupon = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL usp_delete_coupon(?, ?, ?);";
    const values = [req.body.selectedStore, req.body.coupon_id, req.body.code];
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

exports.createCampaignCoupon = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL usp_create_campaign_coupon(?, ?, ?, ?, ?);";
    const values = [req.body.selectedStore, req.body.amount, req.body.minimumOrderAmount, req.body.dateStart, req.body.dateEnd];
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
