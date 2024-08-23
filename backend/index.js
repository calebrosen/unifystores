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

/* fully internal databases so login information doesn't matter */

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

app.post('/updateManufacturerName', (req, res) => {
    const sql = "CALL UpdateManufacturerName(?, ?);";
    const values = [req.body.manufacturerID, req.body.editedName];
    unify.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
      });
  });


app.post('/pushPartDiagrams', (req, res)=> { 
    const sql = "CALL PushPartDiagrams(?)";
    const values = [req.body.selectedStore]
    unify.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.get('/orderStatus', (req, res)=> { 
    const sql = "Select `subsection`, `path` from subsections WHERE `section` = 'Order Status'";
    unify.query(sql, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
})

app.get('/viewEditOrderStatusName', (req, res)=> {
    const sql = "CALL GetOrderStatuses();";
    unify.query(sql, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
})

app.post('/updateOrderStatusName', (req, res) => {
    const sql = "CALL UpdateOrderStatusName(?, ?);";
    const values = [req.body.order_status_id, req.body.editedName];
    unify.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
      });
  });

app.post('/addNewOrderStatus', (req, res)=> { 
    const sql = "CALL AddOrderStatus(?)";
    const values = [req.body.orderStatusName]
    unify.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.post('/pushOrderStatus', (req, res)=> { 
    const sql = "CALL PushOrderStatusToStore(?, ?)";
    const values = [req.body.selectedStore, req.body.orderStatusID]
    unify.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.get('/stockstatus', (req, res)=> { 
    const sql = "Select `subsection`, `path` from subsections WHERE `section` = 'Stock Status'";
    unify.query(sql, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
})

app.post('/addNewStockStatus', (req, res)=> { 
    const sql = "CALL AddStockStatus(?)";
    const values = [req.body.stockStatusName]
    unify.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.get('/viewEditStockStatusName', (req, res)=> {
    const sql = "CALL GetStockStatuses();";
    unify.query(sql, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
})

app.post('/pushStockStatus', (req, res)=> { 
    const sql = "CALL PushStockStatusToStore(?, ?)";
    const values = [req.body.selectedStore, req.body.stockStatusID]
    unify.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.post('/addNewSalesAgent', (req, res)=> { 
    const sql = "CALL AddNewSalesAgent(?)";
    const values = [req.body.salesAgentName]
    unify.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.get('/getSalesAgents', (req, res)=> { 
    const sql = "CALL GetSalesAgents()";
    unify.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.post('/EditSalesAgent', (req, res)=> { 
    const sql = "CALL EditSalesAgent(?, ?, ?, ?)";
    const values = [req.body.selectedID, req.body.selectedFName, req.body.selectedLName, req.body.selectedStatus]
    unify.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})


app.get('/customergroups', (req, res)=> {
    const sql = "Select `subsection`, `path` from subsections WHERE `section` = 'Customer Groups'";
    unify.query(sql, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
})

app.post('/addNewCustomerGroup', (req, res)=> { 
    const sql = "CALL AddNewCustomerGroup(?)";
    const values = [req.body.customerGroupName]
    unify.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.get('/viewEditCustomerGroupName', (req, res)=> {
    const sql = "CALL GetCustomerGroups();";
    unify.query(sql, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
})

app.post('/editCustomerGroupName', (req, res)=> {
    const sql = "CALL UpdateCustomerGroupName(?, ?);";
    const values = [req.body.customerGroupID, req.body.name];
    unify.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.post('/pushCustomerGroups', (req, res)=> { 
    const sql = "CALL PushCustomerGroupToStore(?, ?)";
    const values = [req.body.selectedStore, req.body.customerGroupID]
    unify.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.get('/salesagent', (req, res)=> {
    const sql = "Select `subsection`, `path` from subsections WHERE `section` = 'Sales Agent'";
    unify.query(sql, (err,data)=> {
        if(err) return res.json (err);
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

  app.get('/countries', (req, res)=> { 
    const sql = "Select `subsection`, `path` from subsections WHERE `section` = 'Countries'";
    unify.query(sql, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
  })

  app.get('/getCountries', (req, res)=> { 
    const sql = "Call GetCountries()";
    unify.query(sql, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
  })

  app.post('/editCountryOnStore', (req, res)=> { 
    const sql = "Call EditCountryOnStore(?, ?, ?)";
    const values = [req.body.selectedStore, req.body.countryID, req.body.selectedStatus];
    unify.query(sql, values, (err, data) => {
        if(err) return res.json (err);
        return res.json(data);
    })
  })

  app.post('/disableCountry', (req, res)=> { 
    const sql = "Call DisableCountryOnAllStores(?)";
    const values = [req.body.selectedCountryID];
    unify.query(sql, values, (err, data) => {
        if(err) return res.json (err);
        return res.json(data);
    })
  })

  app.get('/viewEnabledCountries', (req, res)=> { 
    const sql = "Call ViewEnabledCountries();";
    unify.query(sql, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
  })

  app.get('/zones', (req, res)=> { 
    const sql = "Select `subsection`, `path` from subsections WHERE `section` = 'Zones'";
    unify.query(sql, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
  })

  app.get('/getZones', (req, res)=> { 
    const sql = "Call GetZones()";
    unify.query(sql, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
  })

  app.post('/editZonesOnStore', (req, res)=> { 
    const sql = "Call EditZonesOnStore(?, ?, ?)";
    const values = [req.body.selectedStore, req.body.zoneID, req.body.selectedStatus];
    unify.query(sql, values, (err, data) => {
        if(err) return res.json (err);
        return res.json(data);
    })
  })

  app.post('/disableZone', (req, res)=> { 
    const sql = "Call DisableZoneOnAllStores(?)";
    const values = [req.body.selectedZoneID];
    unify.query(sql, values, (err, data) => {
        if(err) return res.json (err);
        return res.json(data);
    })
  })

  app.get('/viewEnabledZones', (req, res)=> { 
    const sql = "Call ViewEnabledZones();";
    unify.query(sql, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
  })

  app.get('/products', (req, res)=> { 
    const sql = "Select `subsection`, `path` from subsections WHERE `section` = 'products'";
    unify.query(sql, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
})
  app.get('/productdescription', (req, res)=> { 
    const sql = "Select `subsection`, `path` from subsections WHERE `section` = 'Product Description'";
    unify.query(sql, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
  })

  app.get('/viewEditProductDescription', (req, res)=> { 
    const sql = "CALL GetProduct_summary_dif_table;";
    unify.query(sql, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
  })

  app.post('/getProductsForRelease', (req, res)=> {
    const sql = "CALL GetProductForRelease(?)";
    const values = [req.body.selectedStore];
    unify.query(sql, values, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
  })

  app.post('/releaseProductOnStore', (req, res)=> {
    const sql = "CALL ReleaseProductOnStore(?, ?, ?, ?)";
    const values = [req.body.selectedStore, req.body.releaseQuantity, req.body.productID, req.body.selectedMPN];
    unify.query(sql, values, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
  })

  app.post('/searchProducts', (req, res)=> {
    const sql = "CALL SearchForProducts(?, ?, ?)";
    const values = [req.body.searchMPN, req.body.searchName, req.body.searchStatus];
    unify.query(sql, values, (err,data)=> {
        if(err) return res.json (err);
        return res.json(data);
    })
  })

  app.post('/getProductDescDifferences', (req, res)=> { 
    const sql = "CALL GetProduct_description_differences(?);";
    const values = [req.body.difID];
    unify.query(sql, values, (err, data) => {
        if(err) return res.json (err);
        return res.json(data);
    })
  })
  
  app.post('/saveProductDescription', (req, res)=> { 
    const sql = "CALL PushProductDescriptionToStores(?, ?, ?, ?);";
    const values = [req.body.storeId, req.body.selectedMPN, req.body.selectedModel, req.body.descriptionToSave];
    unify.query(sql, values, (err, data) => {
        if(err) return res.json (err);
        return res.json(data);
    })
  })

  app.post('/refetchProductDescriptions', (req, res) => {
    const sql = "CALL GetProductSummaryTables()";
    unify.query(sql, (err, data) => {
        if(err) return res.json (err);
        return res.json(data);
    })
  })






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