import React, { useState } from "react";
import {
  toLowerCase,
  toUpperCase,
  toCamelCase,
  toCapitalCase,
  toConstantCase,
  toDotCase,
  toHeaderCase,
  toParamCase,
  toPascalCase,
  toPathCase,
  toSentenceCase,
  toSnakeCase,
  toSwapCase,
  toTitleCase,
} from "../../utils/caseConverter";

const CaseConverter: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [convertedText, setConvertedText] = useState<string>("");

  const handleConversion = (
    convertFunction: (input: string) => string
  ): void => {
    setConvertedText(convertFunction(inputText));
  };

  const handleCopyToClipboard = (): void => {
    if (convertedText) {
      navigator.clipboard.writeText(convertedText);
    }
  };

  const handleClear = (): void => {
    setInputText("");
    setConvertedText("");
  };

  return (
    <div className="container">
      <h2>Case Converter</h2>
      <textarea
        rows={5}
        cols={50}
        placeholder="Enter your text here"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <br />
      <button onClick={() => handleConversion(toLowerCase)}>lowercase</button>
      <button onClick={() => handleConversion(toUpperCase)}>UPPERCASE</button>
      <button onClick={() => handleConversion(toCamelCase)}>camelCase</button>
      <button onClick={() => handleConversion(toCapitalCase)}>
        Capital Case
      </button>
      <button onClick={() => handleConversion(toConstantCase)}>
        CONSTANT_CASE
      </button>
      <button onClick={() => handleConversion(toDotCase)}>dot.case</button>
      <button onClick={() => handleConversion(toHeaderCase)}>
        Header-Case
      </button>
      <button onClick={() => handleConversion(toParamCase)}>param-case</button>
      <button onClick={() => handleConversion(toPascalCase)}>PascalCase</button>
      <button onClick={() => handleConversion(toPathCase)}>path/case</button>
      <button onClick={() => handleConversion(toSentenceCase)}>
        Sentence case
      </button>
      <button onClick={() => handleConversion(toSnakeCase)}>snake_case</button>
      <button onClick={() => handleConversion(toSwapCase)}>sWAP cASE</button>
      <button onClick={() => handleConversion(toTitleCase)}>Title Case</button>
      <br />
      <textarea
        rows={5}
        cols={50}
        placeholder="Converted text will appear here"
        value={convertedText}
        readOnly
      />
      <br />
      <button onClick={handleCopyToClipboard}>Copy to Clipboard</button>
      <button onClick={handleClear}>Clear</button>
    </div>
  );
};

export default CaseConverter;
