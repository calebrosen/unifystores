const express = require('express');
const mysql = require('mysql')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

const unify = mysql.createConnection({
    host: "10.1.10.186",
    user: "caleb",
    password: ")GVGKqESUtr+",
    database: "unify",
    port: "3306"
})

const federated = mysql.createConnection({
    host: "10.1.10.186",
    user: "caleb",
    password: ")GVGKqESUtr+",
    database: "federatedb",
    port: "3306"
})

app.get('/', (re,res)=> {
    return res.json("from backend");
})

app.get('/sections', (req, res)=> {
    const sql = "Select `section`, `path` from sections";
    unify.query(sql, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
})

app.get('/fetchStores', (req, res)=> {
    const sql = "Select `ms_short_name` from managed_stores WHERE ms_status = 1";
    unify.query(sql, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
})

app.get('/coupons', (req, res)=> { 
    const sql = "Select `subsection`, `path` from subsections WHERE `section` = 'Coupons'";
    unify.query(sql, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
})

app.get('/information', (req, res)=> { 
    const sql = "Select `subsection`, `path` from subsections WHERE `section` = 'Information'";
    unify.query(sql, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
})

app.get('/viewEditInformation', (req, res)=> {
    const sql = "CALL GetInformationDescription();";
    unify.query(sql, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
})

app.post('/saveInformation', (req, res)=> {
    const sql = "CALL SaveInformationDescription(?, ?);";
    const values = [req.body.selectedInformation, req.body.inputValue];
    unify.query(sql, values, (err,data) => {
        if(err) return res.json (err);
        return res.json(data);
    })
})

app.post('/pushInformation', (req, res) => {
    const sql = "CALL PushInformationDescription(?, ?)";
    const values = [req.body.selectedStore, req.body.selectedInformation];
    unify.query(sql, values, (err,data) => {
        if(err) return res.json (err);
        return res.json(data);
    })
})


app.get('/partDiagrams', (req, res)=> { 
    const sql = "Select `subsection`, `path` from subsections WHERE `section` = 'Part Diagrams'";
    unify.query(sql, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
})

app.get('/manufacturers', (req, res)=> { 
    const sql = "Select `subsection`, `path` from subsections WHERE `section` = 'Manufacturers'";
    unify.query(sql, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
})

app.post('/pushManufacturer', (req, res)=> { 
    const sql = "CALL PushManufacturerToStore(?, ?)";
    const values = [req.body.selectedStore, req.body.manufacturerID]
    unify.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.get('/viewEditManufacturers', (req, res)=> {
    const sql = "CALL GetManufacturers();";
    unify.query(sql, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
})

app.post('/addNewManufacturer', (req, res)=> { 
    const sql = "CALL AddManufacturer(?)";
    const values = [req.body.manufacturerName]
    unify.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})


app.post('/pushPartDiagrams', (req, res)=> { 
    const sql = "CALL PushPartDiagrams(?)";
    const values = [req.body.selectedStore]
    unify.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})


app.get('/fetchAgents', (req, res)=> { 
    const sql = "Select `Agent`, `AgentID` from CouponAgentList WHERE Status = 1";
    federated.query(sql, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
})

app.post('/createCoupon', (req, res) => {
    const sql = "CALL CreateCoupon(?, ?, ?, ?);";
    const values = [req.body.selectedAgent, req.body.selectedStore, req.body.amount, req.body.couponCode];
    unify.query(sql, values, (err, data) => {
      if (err) return res.json(err);
      return res.status(200).json(data);
    });
  });

  app.post('/selectCoupons', (req, res) => {
    const sql = "CALL SelectCoupons(?);";
    const values = [req.body.selectedStore];
    unify.query(sql, values, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });

  app.post('/updateCoupon', (req, res) => {
    const sql = "CALL UpdateCoupon(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    const values = [req.body.selectedStore, req.body.coupon_id, req.body.name, req.body.code, req.body.type, req.body.discount, req.body.date_start, req.body.date_end, req.body.uses_total, req.body.status];
    unify.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
      });
  });

  app.post('/deleteCoupon', (req, res) => {
    const sql = "CALL DeleteCoupon(?, ?, ?);";
    const values = [req.body.selectedStore, req.body.coupon_id, req.body.code];
    unify.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
      });
  });


//maintaining login state
const jwt = require('jsonwebtoken');
const SECRET_KEY = '1RGS3CR3T';

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE username = ? AND pw = ?";
    const values = [req.body.username, req.body.password];
    unify.query(sql, values, (err, data) => {
        if (err) return res.status(500).json({ message: "Login Failed" });
        if (data.length > 0) {
            const token = jwt.sign({ id: data[0].id }, SECRET_KEY, { expiresIn: '90m' });
            return res.json({ message: "Login successful", token });
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    });
});


app.listen(8081, () => {
    console.log('Server running on port 8081');
});