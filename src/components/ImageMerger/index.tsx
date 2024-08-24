import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

import { accept, mergeImages, MergeOptions } from '../../utils/imageProcessor';

import './style.css';

const ImageMerger: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [output, setOutput] = useState<string | null>(null);
  const [format, setFormat] = useState<MergeOptions['format']>('image/jpeg');
  const [quality, setQuality] = useState<number>(1); // Set default quality to 1
  const [direction, setDirection] =
    useState<MergeOptions['direction']>('vertical');

  useEffect(() => {
    if (images.length > 0) {
      const fileType = images[0].type;
      if (fileType.includes('jpeg')) {
        setFormat('image/jpeg');
      } else if (fileType.includes('png')) {
        setFormat('image/png');
      } else if (fileType.includes('webp')) {
        setFormat('image/webp');
      }
    }
  }, [images]);

  const handleMerge = async () => {
    const imgElements = await Promise.all(
      images.map((file) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const img = new Image();
            img.src = reader.result as string;
            img.onload = () => resolve(img);
            img.onerror = reject;
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    );

    const options: MergeOptions = {
      format,
      quality,
      direction,
    };
    const mergedImage = await mergeImages(imgElements, options);
    setOutput(mergedImage);
  };

  const handleReset = () => {
    setImages([]);
    setOutput(null);
    setFormat('image/jpeg');
    setQuality(1);
    setDirection('vertical');
  };

  // Set up react-dropzone for drag and drop functionality
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length <= 10) {
        setImages(acceptedFiles);
      } else {
        alert('You can upload up to 10 images at a time.');
      }
    },
  });

  return (
    <div className="container">
      <h1>Image Merger</h1>

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        <p>
          {isDragActive
            ? 'Drop the images here...'
            : 'Drag & drop images here, or click to select images'}
        </p>
        <p className="helper-text">You can upload up to 10 images at a time.</p>
      </div>

      {images.length > 0 && (
        <div className="file-list">
          <h2>Uploaded Images</h2>
          <ul>
            {images.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="output-settings">
        <h2>Options</h2>

        <label>
          Direction:
          <select
            value={direction}
            onChange={(e) =>
              setDirection(e.target.value as MergeOptions['direction'])
            }
          >
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </select>
        </label>
        <label>
          Format:
          <select
            value={format}
            onChange={(e) =>
              setFormat(e.target.value as MergeOptions['format'])
            }
          >
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
          </select>
        </label>

        <label>
          Quality:
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
            className="w-full mt-1"
          />
          <span className="quality-value">{quality}</span>
        </label>

        <div className="buttons">
          <button
            onClick={handleMerge}
            className="merge-btn"
            disabled={images.length === 0}
          >
            Merge Images
          </button>
          <button
            onClick={handleReset}
            className="reset-btn"
            disabled={images.length === 0}
          >
            Reset
          </button>
          {output && (
            <a
              href={output}
              download={`merged-image.${format.split('/')[1]}`}
              className="download-btn"
            >
              Download Image
            </a>
          )}
        </div>
      </div>

      {output && (
        <div className="merged-image">
          <h2>Preview</h2>
          <img src={output} alt="Merged" />
        </div>
      )}
    </div>
  );
};

export default ImageMerger;
