import React, { useState } from "react";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";

const getCodeString = (bookId: string) => `
async function postData(url = "", data = {}) {
  try {
    // Sending the POST request
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Parse the JSON response
    const jsonResponse = await response.json();
    console.log(jsonResponse);
    return jsonResponse;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

postData("https://ridibooks.com/api/web-viewer/generate", {
  book_id: "${bookId}",
}).then((jsonResponse) => {
  if (jsonResponse) {
    // Handle the JSON response data
    console.log("Received JSON:", jsonResponse);
  }
});
`;

type PageProps = {
  // Define the structure of pages as per your API response
  src: string;
  height: number;
  width: number;
};

async function postData(url = "", data = {}) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const pages = await response.json();
    console.log(pages);
    return pages;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

const RidiImageGenerater: React.FC = () => {
  const [bookId, setBookId] = useState("");
  const [pages, setPages] = useState<PageProps[]>([]);
  const [showCode, setShowCode] = useState(false); // To toggle code view
  const [pageInput, setPageInput] = useState<string>("");
  const [zipFolderName, setZipFolderName] = useState<string>("");
  const [isDownloading, setDownloading] = useState(false);
  const handleGenerate = async () => {
    const data = { book_id: bookId };
    const response = await postData(
      "https://ridibooks.com/api/web-viewer/generate",
      data
    );
    if (response) {
      setPages(response?.data?.pages || []);
    }
  };

  const handleDownloadAll = async () => {
    if (pages?.length) {
      let imageIndex = 1;
      for (const page of pages) {
        try {
          // Fetch the image as a blob
          const imageBlob = await fetch(page.src).then((res) => res.blob());
          // Save the image using file-saver
          saveAs(imageBlob, `${String(imageIndex).padStart(4, "0")}.jpg`);
          imageIndex++;
        } catch (error) {
          console.error(`Error downloading image: ${page.src}`, error);
        }
      }
    }
  };

  const handleDownloadZip = async () => {
    if (pages?.length) {
      setDownloading(true);
      const zip = new JSZip();
      const folder = zip.folder("images");
      let imageIndex = 1;
      for (const page of pages) {
        try {
          const imageBlob = await fetch(page.src).then((res) => res.blob());
          const fileName = `${String(imageIndex).padStart(4, "0")}.jpg`;
          folder?.file(fileName, imageBlob); // Add image to zip folder
          imageIndex++;
        } catch (error) {
          console.error(`Error downloading image: ${page.src}`, error);
        }
      }

      // Generate the zip file and trigger download
      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, zipFolderName !== "" ? zipFolderName : "images.zip");
        setDownloading(false);
      });
    }
  };

  const handlePagesInput = () => {
    try {
      const pagesArray: PageProps[] = JSON.parse(pageInput);
      setPages(pagesArray); // Fetch images based on user input
    } catch (error) {
      console.error("Invalid JSON input", error);
    }
  };

  return (
    <div className="container">
      <h1>Ridi Image Generater</h1>
      <input
        type="text"
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
        placeholder="Enter Book ID"
      />
      <button onClick={handleGenerate}>Generate By Book ID</button>
      <textarea
        value={pageInput}
        onChange={(e) => setPageInput(e.target.value)}
        placeholder="Enter pages array (JSON format)"
        rows={10}
        style={{ width: "100%" }}
      />
      <button onClick={handlePagesInput}>Generate Images</button>

      {/* View Code Button */}
      <button onClick={() => setShowCode(!showCode)} disabled={bookId === ""}>
        {showCode ? "Hide Code" : "View Code"}
      </button>

      {/* Code Viewer */}
      {showCode && (
        <SyntaxHighlighter language="typescript" style={solarizedlight}>
          {getCodeString(bookId)}
        </SyntaxHighlighter>
      )}

      <input
        type="text"
        value={zipFolderName}
        onChange={(e) => setZipFolderName(e.target.value)}
        placeholder="Enter Folder Name"
      />
      {pages?.length > 0 && (
        <div>
          <button onClick={handleDownloadAll}>Download All</button>
          <button onClick={handleDownloadZip}>
            {isDownloading ? "Downloading" : "Download Zip"}
          </button>
        </div>
      )}

      {pages && (
        <div>
          <h3>Generated Images</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {pages.map((page, index) => (
              <img
                key={index}
                src={page.src}
                alt={`${index + 1}`}
                width={page.width}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RidiImageGenerater;
