import React, { useState } from 'react';
import Navbar from './Nav';
import Wait from './Wait';
import '../styles/style.css';

function UploadForm() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState("");
  const [language, setLanguage] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0); // State to store audio duration

  const handleUpload = async () => {
    setWaiting(true);
    setResponse("");
    if (!file) {
      setWaiting(false);
      alert("Please select a file before submitting!");
      return;
    }

    if (file) {
        const audio = new Audio(URL.createObjectURL(file));
        audio.addEventListener("loadedmetadata", function() {
            setAudioDuration(audio.duration);
        });
    }


    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);

    try {
      const res = await fetch("http://localhost:8000/transcribe/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        console.log(data);
        setResponse(data.response);
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("An error occurred while uploading the file.");
    }
    setWaiting(false);
  };

  // Function to generate the VTT content (adjust timestamps as needed)
  const generateVTTContent = () => {
    let vttContent = response["vtt"];
    return vttContent;
  };



  // Function to handle VTT file download
  const handleVTTDownload = () => {
    const vttBlob = new Blob([generateVTTContent()], { type: "text/vtt" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(vttBlob);
    link.download = "transcription.vtt";
    link.click();
  };

  // Function to handle JSON file download
  const handleJSONDownload = () => {
    const blob = new Blob([JSON.stringify(response, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transcription.json";
    link.click();
  };

  return (<>
    {/* <Navbar /> */}
    <div className="page-container">
      <div className="input-section">
        <div className="upload-form-container">
          <h2>Upload Audio File</h2>

          {/* File input */}
          <div className="input-container">
            <label htmlFor="file-input" className="input-label">Choose Audio File</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="file-input"
                onChange={(e) => setFile(e.target.files[0])}
                accept="audio/*"
                className="file-input"
              />
              <span className="file-input-placeholder">
                {file ? file.name : "Drag and drop your audio file here or click to browse"}
              </span>
            </div>
          </div>

          {/* Language select */}
          <div className="input-container">
            <label htmlFor="language-select" className="input-label">Select Language</label>
            <select
              id="language-select"
              onChange={(e) => setLanguage(e.target.value)}
              value={language}
              className="language-select"
            >
              <option value="">Select Language</option>
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
            </select>
          </div>


          {/* Upload button */}
          <div className="button-container">
            <button onClick={handleUpload} className="upload-button" disabled={waiting || !file}>
              {waiting ? "Processing..." : "Transcribe"}
            </button>
          </div>

          {/* Wait component */}
          <Wait bool_val={waiting} language={language} audioDuration={audioDuration}/>
        </div>
      </div>
      <div className="output-section" style={{ alignItems: response === "" ? "center" : undefined }} >
        <div className="response-container">
          <h2>Transcription</h2>
          {response ? (
            <>
              <h3>Subtitle (VTT Format)</h3>
              
              <div className="download-button-container">
                <button onClick={handleVTTDownload} className="download-button">
                  Download VTT
                </button>
                <button onClick={handleJSONDownload} className="download-button">
                  Download JSON
                </button>
              </div>
              <pre className="response-text">
                {Object.entries(response).map(([key, value], index) => (
                    <div key={index}>
                    <strong>{key}:</strong> {value.toString()}
                    </div>
                ))}
                </pre>

            </>
          ) : (
            <div className="empty-response">
              <p>Once you upload an audio file and transcribe, the results will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default UploadForm;