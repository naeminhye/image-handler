import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { accept, splitImage, SplitOptions } from '../../utils/imageProcessor';

import './style.css';

const ImageSplitter: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [splits, setSplits] = useState<string[]>([]);
  const [splitDirection, setSplitDirection] = useState<
    'vertical' | 'horizontal'
  >('vertical');
  const [splitBy, setSplitBy] = useState<'quantity' | 'dimension'>('quantity');
  const [quantity, setQuantity] = useState<number>(2);
  const [dimension, setDimension] = useState<number>(100);
  const [format, setFormat] = useState<string>('image/jpeg');
  const [quality, setQuality] = useState<number>(1);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    onDrop: (acceptedFiles) => {
      setImage(acceptedFiles[0]);
    },
  });

  const handleSplit = async () => {
    if (!image) return;

    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.src = reader.result as string;
      img.onload = async () => {
        const options: SplitOptions = {
          splitDirection,
          splitBy,
          quantity,
          dimension,
        };
        const newSplits = await splitImage(img, options);
        const splitImages = newSplits.map((canvas) =>
          canvas.toDataURL(format, quality)
        );
        setSplits(splitImages);
      };
    };
    reader.readAsDataURL(image);
  };

  const handleDownloadAll = () => {
    splits.forEach((src, index) => {
      const link = document.createElement('a');
      link.href = src;
      link.download = `split-image-${index + 1}.${format.split('/')[1]}`;
      link.click();
    });
  };

  return (
    <div className="container">
      <h1>Image Splitter</h1>

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        <p>
          {isDragActive
            ? 'Drop the image here...'
            : 'Drag & drop an image here, or click to select an image'}
        </p>
      </div>

      <div className="mb">
        <h2>Options</h2>
        <div className="flex">
          <button
            onClick={() => setSplitDirection('vertical')}
            className={`${
              splitDirection === 'vertical' ? 'bg-primary' : 'bg-secondary'
            }`}
          >
            Vertically
          </button>
          <button
            onClick={() => setSplitDirection('horizontal')}
            className={`${
              splitDirection === 'horizontal' ? 'bg-primary' : 'bg-secondary'
            }`}
          >
            Horizontally
          </button>
        </div>
      </div>

      <div className="mb">
        <h2 className="capitalize">{splitDirection}</h2>
        <div className="flex">
          <button
            onClick={() => setSplitBy('quantity')}
            className={`${
              splitBy === 'quantity' ? 'bg-primary' : 'bg-secondary'
            }`}
          >
            Quantity of blocks (equal{' '}
            {splitDirection === 'vertical' ? 'height' : 'width'})
          </button>
          <button
            onClick={() => setSplitBy('dimension')}
            className={`${
              splitBy === 'dimension' ? 'bg-primary' : 'bg-secondary'
            }`}
          >
            {splitDirection === 'vertical' ? 'Height' : 'Width'} of blocks
          </button>
        </div>
      </div>

      {splitBy === 'quantity' && (
        <div className="mb">
          <label>Quantity of blocks</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full text-sm border rounded-lg bg-gray-50 focus:outline-none"
          />
        </div>
      )}

      {splitBy === 'dimension' && (
        <div className="mb">
          <label>
            {splitDirection === 'vertical' ? 'Height' : 'Width'} of blocks (px)
          </label>
          <input
            type="number"
            min="1"
            value={dimension}
            onChange={(e) => setDimension(Number(e.target.value))}
            className="w-full text-sm border rounded-lg bg-gray-50 focus:outline-none"
          />
        </div>
      )}

      <div className="mb">
        <label>Format:</label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="w-full text-sm border rounded-lg bg-gray-50 focus:outline-none"
        >
          <option value="image/jpeg">JPEG</option>
          <option value="image/png">PNG</option>
          <option value="image/webp">WebP</option>
        </select>
      </div>

      <div className="mb">
        <label>Quality:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={quality}
          onChange={(e) => setQuality(parseFloat(e.target.value))}
          className="w-full cursor-pointer"
        />
        <span className="text-sm">{quality}</span>
      </div>

      <div className="buttons">
        <button
          onClick={handleSplit}
          className="bg-primary hover:bg-primary-dark text-white rounded"
        >
          Split Image
        </button>

        {splits.length > 0 && (
          <button
            onClick={handleDownloadAll}
            className="bg-success hover:bg-success-dark text-white rounded"
          >
            Download All
          </button>
        )}
      </div>

      {splits.length > 0 && (
        <div className="preview">
          {splits.map((src, index) => (
            <div key={index} className="split-image">
              <img src={src} alt={`Split part ${index + 1}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSplitter;
