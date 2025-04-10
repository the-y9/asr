import React from 'react';
import '../styles/style.css'; 

const getLanguageInfo = (language, audioDuration) => {
  switch (language) {
    case "english":
      return {
        label: "English",
        info: (67/120 * audioDuration).toFixed(2) + " seconds for",
      };
    case "hindi":
      return {
        label: "Hindi",
        info: (16/60 * audioDuration).toFixed(2) + " seconds for",
      };
    default:
      return {
        label: "Chosen Language",
        info: (16/60 * audioDuration).toFixed(2) + " seconds for",
      };
  }
};

const Wait = ({ bool_val, language, audioDuration }) => {
  const langData = getLanguageInfo(language, audioDuration);

  return (
    <>
      {bool_val && (
        <div className="wait-container">
          <h3 className="wait-heading">⏳ Waiting for response...</h3>
          <div className="wait-card">
            <p className="wait-title">May take</p>
            <p className="wait-time">{langData.info}</p>
            <h4 className="wait-language">{langData.label}</h4>
          </div>
        </div>
      )}
    </>
  );
};

export default Wait;