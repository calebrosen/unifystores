
// maintaining login state
const jwt = require("jsonwebtoken");
const connectToDB = require("../model/db");
const SECRET_KEY = "1RGS3CR3T";

exports.login = async (req, res) => {
  const values = [req.body.username, req.body.password];
  const db = await connectToDB();
  const sql = "SELECT * FROM users WHERE username = ? AND pw = ?";
  db.query(sql, values, (err, data) => {
    console.log(err, data);
    if (err) return res.status(500).json({ message: "Login Failed" });
    if (data.length > 0) {
      const token = jwt.sign({ id: data[0].id }, SECRET_KEY, {
        expiresIn: "6h",
      });
      return res.json({ message: "Login successful", token });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  });
};