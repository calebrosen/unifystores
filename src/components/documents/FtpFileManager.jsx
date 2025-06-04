import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { PDFPathContext } from '../../contexts/PDFPathContext';
import MediumButton from "../buttons/MediumButton";
import SmallInput from "../inputs/SmallInput";

const API = `${process.env.REACT_APP_API_URL}/node/documents`;

export default function FtpFileManager() {
  const [currentPath, setCurrentPath] = useState("");
  const [folderContents, setFolderContents] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const { docPath, setDocPath } = useContext(PDFPathContext);
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
    if (!selectedFile) return alert("No file selected");

    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("folderPath", currentPath);

    try {
      const res = await axios.post(`${API}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        validateStatus: status => status >= 200 && status < 300 || status === 207
      });
    
      const { ftpPath, failed } = res.data;
          
      if (failed && failed.length > 0) {
        alert(`⚠️ Some servers failed:\n${failed.map(f => `${f.host}: ${f.error}`).join("\n")}`);
      }
    
      setDocPath(ftpPath);
      fetchFolderContents();
    } catch (err) {
      console.error("Full error:", err);
      alert("Upload failed completely.");
    }
    
    setLoading(false);
  };

  return (
    <div className="mx-auto mt-8 p-4 bg-slate-800 text-white rounded-xl">
      <h2 className="text-3xl font-bold mb-4">FTP File Manager</h2>

      {docPath ? (<h3 className="mb-8 mt-2 text-2xl">Uploaded File Path: {docPath}</h3>) : null}

      <div className="mb-4">
        <div className="my-6 text-2xl">Current Path: /{currentPath || ""}</div>


        <div className="flex gap-3">
        {currentPath && (
          <button
            onClick={goBack}
            className="bg-gray-700 px-3 text-2xl rounded"
          >
            ⬅️ Back
          </button>
        )}

        <SmallInput
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="New folder name"
        />

        <MediumButton
          text={"Create Folder"}
          action={createFolder}
          size={"text-2xl !font-medium"}
        />
      </div>
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

      <div className="flex flex-col gap-3 w-min">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="mb-2 block"
        />
        <MediumButton
          text={"Upload PDF"}
          action={uploadFile}
        />
          {loading ? (<div className="w-16 h-16 mt-10 border-4 border-gray-300 border-t-slate-600 rounded-full animate-spin"></div> ) : null}
      </div>
    </div>
  );
}
