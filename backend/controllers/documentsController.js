const connectToDB = require("../model/db");
const path = require("path");
require("dotenv").config({ path: "../env/.env" });
const multer = require("multer");
const fs = require("fs");
const ftp = require("basic-ftp");


exports.uploadDocument = (req, res) => {
  const tempUploadDir = path.join(__dirname, "../temp");
  fs.mkdirSync(tempUploadDir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, tempUploadDir),
    filename: (_, file, cb) => cb(null, file.originalname),
  });

  const upload = multer({ storage });

  upload.single("file")(req, res, async function (err) {
    if (err) return res.status(500).json({ error: "Multer failed" });

    const file = req.file;
    const folderPath = req.body.folderPath || "";
    const localFilePath = file.path;
    const remotePath = path.posix.join("/unify/pdfs/", folderPath, file.originalname);

    const client = new ftp.Client();

    try {
      await client.access({
        host: process.env.OCMASTERHOST,
        user: process.env.OCMASTERUSER,
        password: process.env.OCMASTERPASSWORD,
      });

      await client.ensureDir(path.posix.join("/unify/pdfs/", folderPath));
      await client.uploadFrom(localFilePath, remotePath);
      await client.close();

      // federated uploads to other servers
      const failedReplications = await replicateToOtherFtpServers(localFilePath, folderPath, file.originalname);

      if (failedReplications.length > 0) {
        return res.status(207).json({
          message: "Uploaded to main FTP, but some replications failed.",
          ftpPath: path.posix.join(folderPath, file.originalname),
          failed: failedReplications
        });
      }

      // delete local copy after all uploads
      fs.unlinkSync(localFilePath);

      res.json({
        message: "Uploaded to all FTP servers.",
        ftpPath: path.posix.join(folderPath, file.originalname),
      });
    } catch (err) {
      console.error("FTP upload error:", err.message);
      res.status(500).json({ error: "Upload to FTP failed" });
    }
  });
};


const replicateToOtherFtpServers = async (localFilePath, folderPath, filename) => {
  const servers = [
    {
      host: process.env.MFSHOSTPDF,
      user: process.env.MFSUSERPDF,
      password: process.env.MFSPASSWORDPDF
    },
    {
      host: process.env.BMSHOSTPDF,
      user: process.env.BMSUSERPDF,
      password: process.env.BMSPASSWORDPDF
    },
    {
      host: process.env.DIMHOSTPDF,
      user: process.env.DIMUSERPDF,
      password: process.env.DIMPASSWORDPDF
    },
    {
      host: process.env.FMSHOSTPDF,
      user: process.env.FMSUSERPDF,
      password: process.env.FMSPASSWORDPDF
    },
    {
      host: process.env.FMPHOSTPDF,
      user: process.env.FMPUSERPDF,
      password: process.env.FMPPASSWORDPDF
    },
    {
      host: process.env.RFSHOSTPDF,
      user: process.env.RFSUSERPDF,
      password: process.env.RFSPASSWORDPDF
    },
    {
      host: process.env.FPGHOSTPDF,
      user: process.env.FPGUSERPDF,
      password: process.env.FPGPASSWORDPDF
    },
    {
      host: process.env.GNPHOSTPDF,
      user: process.env.GNPUSERPDF,
      password: process.env.GNPPASSWORDPDF
    }
  ];

  const failed = [];

  for (const server of servers) {
    const client = new ftp.Client();
    client.ftp.verbose = false;

    try {
      await client.access({
        host: server.host,
        user: server.user,
        password: server.password,
      });

      const pathSegments = folderPath.split("/").filter(Boolean);
      for (const segment of pathSegments) {
        try {
          await client.cd(segment);
        } catch {
          await client.send("MKD " + segment);
          await client.cd(segment);
        }
      }

      await client.uploadFrom(localFilePath, filename);
      await client.close();

      console.log(`✅ Replicated to ${server.user}`);
    } catch (err) {
      console.error(`❌ Error replicating to ${server.user}:`, err.message);
      failed.push({ host: server.user, error: err.message });
    }
  }

  return failed;
};


exports.list = async (req, res) => {
  const folder = req.body.folder || "";
  const client = new ftp.Client();

  try {
    await client.access({
      host: process.env.OCMASTERHOST,
      user: process.env.OCMASTERUSER,
      password: process.env.OCMASTERPASSWORD,
    });

    const targetPath = path.posix.join("/unify/pdfs/", folder);
    await client.cd(targetPath);

    const list = await client.list();

    const formatted = list.map((entry) => ({
      name: entry.name,
      isDirectory:
        entry.type === 1 || entry.type === "directory" || entry.isDirectory,
    }));

    await client.close();
    res.json(formatted);
  } catch (err) {
    console.error("FTP list error:", err.message);
    res.status(500).json({ error: "Unable to list FTP directory" });
  }
};


exports.createFolder = async (req, res) => {
  const folderPath = req.body.folderPath || "";

  const client = new ftp.Client();

  try {
    await client.access({
      host: process.env.OCMASTERHOST,
      user: process.env.OCMASTERUSER,
      password: process.env.OCMASTERPASSWORD,
    });

    const remotePath = path.posix.join("/unify/pdfs/", folderPath);
    await client.ensureDir(remotePath);
    await client.close();

    res.json({ message: "Folder created on FTP." });
  } catch (err) {
    console.error("FTP folder error:", err.message);
    res.status(500).json({ error: "Folder creation failed on FTP." });
  }
};

// loading all subsections
exports.getSubsections = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql =
      "SELECT `subsection`, `path` FROM subsections WHERE `section` = 'Documents'";

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

// adding new document
exports.addNewDocument = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql =
      "CALL unify.usp_add_document_path(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    let values = [
      req.body.brand,
      req.body.path,
      req.body.top_level_category,
      req.body.second_level_category,
      req.body.third_level_category,
      req.body.fourth_level_category,
      req.body.fifth_level_category,
      req.body.sixth_level_category,
      req.body.product_display_name,
      req.body.document_type,
      req.body.year,
      req.body.mpn,
    ];

    // setting empty strings to null
    values = values.map((v) => (v === "" ? null : v));

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


// pulling out file paths for the documents
exports.getDocuments = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL unify.usp_get_document_paths()";
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

// getting brands
exports.getBrands = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL unify.usp_get_documents_brands()";
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


// getting brands
exports.getFileTypes = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL unify.usp_get_documents_types()";
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

// getting data for documents
exports.getDataForDocumentsDropdown = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL unify.usp_get_data_documents_dropdown(?,?,?,?,?,?,?)";
    const values = [
      req.body.brand,
      req.body.top_level_category,
      req.body.second_level_category,
      req.body.third_level_category,
      req.body.fourth_level_category,
      req.body.fifth_level_category,
      req.body.sixth_level_category
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

// getting data for documents
exports.getProductDisplayNames = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL unify.usp_get_documents_product_display_names(?,?,?,?,?,?,?)";
    const values = [
      req.body.brand,
      req.body.top_level_category,
      req.body.second_level_category,
      req.body.third_level_category,
      req.body.fourth_level_category,
      req.body.fifth_level_category,
      req.body.sixth_level_category
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


// getting data for documents
exports.getProductMPNs = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL unify.usp_get_documents_mpns(?,?,?,?,?,?,?,?)";
    const values = [
      req.body.brand,
      req.body.top_level_category,
      req.body.second_level_category,
      req.body.third_level_category,
      req.body.fourth_level_category,
      req.body.fifth_level_category,
      req.body.sixth_level_category,
      req.body.product_display_name
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

// pulling out filtered file paths for the documents
exports.getFilteredDocuments = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL unify.usp_get_filtered_document_paths(?)";
    const values = [req.body.searchInput];
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


// delete document
exports.deleteDocument = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql = "CALL unify.usp_delete_document(?)";
    const values = [req.body.file_id];
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

// updating document
exports.updateDocument = async (req, res) => {
  try {
    const db = await connectToDB();
    const sql =
      "CALL unify.usp_update_document_path(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    let values = [
      req.body.file_id,
      req.body.brand,
      req.body.path,
      req.body.top_level_category,
      req.body.second_level_category,
      req.body.third_level_category,
      req.body.fourth_level_category,
      req.body.fifth_level_category,
      req.body.sixth_level_category,
      req.body.product_display_name,
      req.body.document_type,
      req.body.year,
      req.body.mpn,
    ];
    // setting empty strings to null
    values = values.map((v) => (v === "" ? null : v));

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
