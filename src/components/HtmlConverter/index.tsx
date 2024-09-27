import React, { useState } from "react";

// Helper function to convert HTML to Markdown
const htmlToMarkdown = (htmlString: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const articleElement = doc.body;

  const nodeToMarkdown = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || "";
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();

      switch (tagName) {
        case "h1":
          return `# ${element.textContent}\n\n`;
        case "h2":
          return `## ${element.textContent}\n\n`;
        case "h3":
          return `### ${element.textContent}\n\n`;
        case "h4":
          return `#### ${element.textContent}\n\n`;
        case "h5":
          return `##### ${element.textContent}\n\n`;
        case "h6":
          return `###### ${element.textContent}\n\n`;
        case "p":
          return `${element.textContent}\n\n`;
        case "strong":
        case "b":
          return `**${element.textContent}**`;
        case "em":
        case "i":
          return `_${element.textContent}_`;
        case "ul": {
          const items = Array.from(element.children)
            .map((item) => `- ${nodeToMarkdown(item)}`)
            .join("\n");
          return `${items}\n\n`;
        }
        case "ol": {
          const items = Array.from(element.children)
            .map((item, index) => `${index + 1}. ${nodeToMarkdown(item)}`)
            .join("\n");
          return `${items}\n\n`;
        }
        case "li":
          return `${element.textContent}`;
        case "a":
          return `[${element.textContent}](${element.getAttribute("href")})`;
        case "img":
          return `![${
            element.getAttribute("alt") || ""
          }](${element.getAttribute("src")})`;
        case "blockquote":
          return `> ${element.textContent}\n\n`;
        case "code":
          return `\`${element.textContent}\``;
        case "pre":
          return `\`\`\`\n${element.textContent}\n\`\`\`\n`;
        default:
          return element.innerHTML;
      }
    }
    return "";
  };

  return Array.from(articleElement.childNodes)
    .map(nodeToMarkdown)
    .join("")
    .trim();
};

// Helper function to convert HTML to Plain Text
const htmlToPlainText = (htmlString: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const articleElement = doc.body;

  const nodeToText = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || "";
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();

      switch (tagName) {
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          return `\n${element.textContent}\n`;
        case "p":
        case "div":
        case "section":
        case "article":
        case "blockquote":
          return `\n${Array.from(element.childNodes)
            .map(nodeToText)
            .join("")}\n`;
        case "ul":
        case "ol": {
          return Array.from(element.children)
            .map((child, index) => {
              if (tagName === "ul") {
                return `- ${nodeToText(child)}`;
              } else {
                return `${index + 1}. ${nodeToText(child)}`;
              }
            })
            .join("\n");
        }
        case "li":
          return `${element.textContent}`;
        case "a":
          return `${element.textContent} (${element.getAttribute("href")})`;
        case "br":
          return "\n";
        default:
          return Array.from(element.childNodes).map(nodeToText).join("");
      }
    }
    return "";
  };

  return Array.from(articleElement.childNodes).map(nodeToText).join("").trim();
};

// React component
const HtmlConverter: React.FC = () => {
  const [htmlInput, setHtmlInput] = useState<string>("");
  const [convertedText, setConvertedText] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<string>("");

  const handleHtmlInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setHtmlInput(event.target.value);
  };

  const convertToMarkdown = () => {
    const markdown = htmlToMarkdown(htmlInput);
    setConvertedText(markdown);
    setCopySuccess(""); // Clear any previous copy status
  };

  const convertToPlainText = () => {
    let plainText = htmlToPlainText(htmlInput);
    plainText = plainText.replaceAll("’", "'");
    plainText = plainText.replaceAll("‘", "'");
    plainText = plainText.replaceAll("”", '"');
    plainText = plainText.replaceAll("“", '"');
    plainText = plainText.replaceAll("\n\n", "");
    setConvertedText(plainText);
    setCopySuccess(""); // Clear any previous copy status
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(convertedText).then(
      () => setCopySuccess("Copied to clipboard!"),
      () => setCopySuccess("Failed to copy!")
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>HTML to Markdown / Plain Text Converter</h2>
      <textarea
        placeholder="Paste your HTML here"
        value={htmlInput}
        onChange={handleHtmlInputChange}
        style={{ width: "100%", height: "150px", marginBottom: "10px" }}
      />
      <div>
        <button onClick={convertToMarkdown} style={{ marginRight: "10px" }}>
          Convert to Markdown
        </button>
        <button onClick={convertToPlainText}>Convert to Plain Text</button>
        <button onClick={copyToClipboard} disabled={!convertedText}>
          Copy to Clipboard
        </button>
        {copySuccess && <p style={{ color: "green" }}>{copySuccess}</p>}
      </div>
      <h3>Converted Output:</h3>
      <pre
        style={{
          backgroundColor: "#f0f0f0",
          padding: "10px",
          whiteSpace: "pre-wrap",
        }}
      >
        {convertedText || "The converted text will appear here."}
      </pre>
    </div>
  );
};

export default HtmlConverter;
