import React, { useState } from "react";
import { createHelia } from "@helia/core";
import { unixfs } from "@helia/unixfs";

const ImageUploadToIPFS = () => {
  const [file, setFile] = useState(null);
  const [cid, setCid] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setCid("");
  };

  // Upload the file to IPFS
  const uploadToIPFS = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    try {
      setIsUploading(true);

      // Initialize Helia
      const helia = await createHelia();
      const fs = unixfs(helia);

      // Read file content
      const fileContent = await file.arrayBuffer();
      const fileName = file.name;

      // Add the file to IPFS
      const cid = await fs.addBytes(new Uint8Array(fileContent), {
        metadata: { filename: fileName },
      });

      setCid(cid.toString());
      console.log(`File uploaded with CID: ${cid}`);
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      alert("Failed to upload the file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Upload Image to IPFS
        </h1>
        <div className="mb-4">
          <label
            htmlFor="fileInput"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select an Image
          </label>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </div>
        <button
          onClick={uploadToIPFS}
          disabled={!file || isUploading}
          className={`w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            isUploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isUploading ? "Uploading..." : "Upload to IPFS"}
        </button>
        {cid && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
            <p className="text-sm font-medium">File uploaded successfully!</p>
            <a
              href={`https://ipfs.io/ipfs/${cid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              View File on IPFS
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadToIPFS;
