
require("dotenv").config({ path: "./env/.env" });
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

const attributeRoutes = require('./routes/attributes');
const authRoutes = require('./routes/auth');
const countriesRoutes = require('./routes/countries');
const couponRoutes = require('./routes/coupons');
const customerRoutes = require('./routes/customers');
const dashboardRoutes = require('./routes/dashboard');
const filterRoutes = require('./routes/filters');
const informationRoutes = require('./routes/information');
const manufacturerRoutes = require('./routes/manufacturers');
const orderRoutes = require('./routes/orders');
const partDiagramRoutes = require('./routes/partdiagrams');
const productRoutes = require('./routes/products');
const salesAgentRoutes = require('./routes/salesagents');
const stockStatusRoutes = require('./routes/stockstatus');
const storeRoutes = require('./routes/stores');
const zoneRoutes = require('./routes/zones');

app.use('/node/auth', authRoutes);
app.use('/node/attributes', attributeRoutes);
app.use('/node/countries', countriesRoutes);
app.use('/node/coupons', couponRoutes);
app.use('/node/customers', customerRoutes);
app.use('/node/dashboard', dashboardRoutes);
app.use('/node/filters', filterRoutes);
app.use('/node/information', informationRoutes);
app.use('/node/manufacturers', manufacturerRoutes);
app.use('/node/orders', orderRoutes);
app.use('/node/partdiagrams', partDiagramRoutes);
app.use('/node/products', productRoutes);
app.use('/node/salesagents', salesAgentRoutes);
app.use('/node/stockstatus', stockStatusRoutes);
app.use('/node/stores', storeRoutes);
app.use('/node/zones', zoneRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});