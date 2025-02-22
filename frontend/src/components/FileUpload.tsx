import { useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setMessage(result.message || "Upload successful!");
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Failed to upload file.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Upload Test Case (ZIP)</h2>
      <input type="file" accept=".zip" onChange={handleFileChange} className="mt-4" />
      <button onClick={handleUpload} className="bg-blue-500 text-white p-2 mt-2">
        Upload
      </button>
      {message && <p className="mt-2 text-red-500">{message}</p>}
    </div>
  );
};

export default FileUpload;
