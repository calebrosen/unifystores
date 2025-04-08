// FtpFileManager.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";

const API = `${process.env.REACT_APP_API_URL}/node/documents`;

export default function FtpFileManager() {
  const [currentPath, setCurrentPath] = useState("");
  const [folderContents, setFolderContents] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedPath, setUploadedPath] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFolderContents();
  }, [currentPath]);

  const fetchFolderContents = async () => {
    try {
      const res = await axios.post(`${API}/list`, { folder: currentPath });
      setFolderContents(res.data);
    } catch (err) {
      console.error("Failed to load folder contents:", err);
    }
  };

  const goBack = () => {
    const parts = currentPath.split("/").filter(Boolean);
    parts.pop();
    setCurrentPath(parts.join("/"));
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    const newPath = currentPath
      ? `${currentPath}/${newFolderName}`
      : newFolderName;
    try {
      await axios.post(`${API}/createFolder`, { folderPath: newPath });
      setNewFolderName("");
      fetchFolderContents();
    } catch (err) {
      console.error("Failed to create folder:", err);
    }
  };

  const uploadFile = async () => {
    setLoading(true);
    if (!selectedFile) return alert("No file selected");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("folderPath", currentPath);

    try {
      const res = await axios.post(`${API}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        validateStatus: status => status >= 200 && status < 300 || status === 207
      });
    
      const { ftpPath, failed } = res.data;
    
      alert(`Upload finished!\nPath: ${ftpPath}`);
      if (failed && failed.length > 0) {
        alert(`⚠️ Some servers failed:\n${failed.map(f => `${f.host}: ${f.error}`).join("\n")}`);
      }
    
      setUploadedPath(ftpPath);
      fetchFolderContents();
    } catch (err) {
      console.error("Full error:", err);
      alert("Upload failed completely.");
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-8xl mx-auto mt-8 p-4 bg-slate-800 text-white rounded-xl">
      <h2 className="text-3xl font-bold mb-4">FTP File Manager</h2>

      {uploadedPath ? (<h3 className="my-8 font-semibold text-2xl">Uploaded File Path:&nbsp;&nbsp;&nbsp;&nbsp;{uploadedPath}</h3>) : null}

      <div className="mb-4">
        <div className="mb-2">Current Path: /{currentPath || ""}</div>
        {currentPath && (
          <button
            onClick={goBack}
            className="bg-gray-700 px-2 py-1 rounded mr-2"
          >
            ⬅️ Back
          </button>
        )}

        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="New folder name"
          className="bg-gray-600 text-white px-2 py-1 rounded mr-2"
        />
        <button
          onClick={createFolder}
          className="bg-blue-700 px-3 py-1 rounded"
        >
          Create Folder
        </button>
      </div>

      <ul className="mb-6 space-y-1">
        {folderContents.map((item) => (
          <li
            key={`${currentPath}/${item.name}`}
            className={item.isDirectory ? "cursor-pointer hover:underline" : ""}
            onClick={() => {
              if (item.isDirectory && !item.name.toLowerCase().endsWith(".pdf")) {
                const newPath = [currentPath, item.name].filter(Boolean).join("/");
                setCurrentPath(newPath);
              }
            }}
          >
            {item.isDirectory && !item.name.toLowerCase().endsWith(".pdf")
              ? `📁 ${item.name}`
              : item.name.toLowerCase().endsWith("pdf")
              ? `📄 ${item.name}`
              : `📦 ${item.name}`}
          </li>

        ))}
      </ul>

      <div>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="mb-2 block"
        />
        <button onClick={uploadFile} className="bg-green-600 px-4 py-2 rounded">
          Upload PDF to Stores
        </button>
          {loading ? (<div className="w-16 h-16 mt-10 border-4 border-gray-300  border-t-slate-600 rounded-full animate-spin"></div> ) : null}
      </div>
    </div>
  );
}
