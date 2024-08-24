# Image Splitter

Image Splitter is a React TypeScript application that allows users to upload an image, split it into multiple smaller images based on various configurations, and download the split images. The application supports vertical, horizontal, and grid (both directions) splitting and allows users to control the number of blocks or block dimensions. Users can also choose the output format and quality for the split images.

## Features

- **Drag & Drop**: Easily upload images by dragging and dropping them into the application.
- **Splitting Options**: Choose to split images vertically, horizontally, or in a grid format.
- **Custom Splitting**: Split by a specific number of blocks or define the exact height/width of blocks.
- **Format and Quality**: Select the output image format (JPEG, PNG, WebP) and adjust the quality.
- **Preview and Download**: Preview split images before downloading and download all images with a single click.

## Technologies Used

- **React**: Front-end library for building user interfaces.
- **TypeScript**: Typed superset of JavaScript that enhances code quality and maintainability.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **react-dropzone**: Library for handling drag-and-drop file uploads.
- **HTML5 Canvas**: For rendering and manipulating the split images.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/image-splitter.git
   cd image-splitter
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm start
   ```

   This will start the application in development mode on `http://localhost:3000`.

## Usage

1. **Upload an Image**: Drag and drop an image into the dropzone or click to select an image from your file system.

2. **Configure Splitting**:

   - Choose the splitting direction (vertical, horizontal, or both).
   - Define the splitting method: by quantity of blocks or by block dimension (height/width).
   - Set the number of blocks or the specific dimension for splitting.

3. **Select Format and Quality**:

   - Choose the output format (JPEG, PNG, WebP).
   - Adjust the quality of the output images.

4. **Preview and Download**:
   - Click "Split Image" to preview the split images.
   - Click "Download All" to download the split images in the specified format and quality.

## Project Structure

- **src/components**: Contains the main React components, including `ImageSplitter.tsx`.
- **src/utils**: Contains utility functions, such as `imageProcessor.ts` for handling image splitting logic.
- **src/style.css**: Contains the global styles for the application.

## Contributing

Contributions are welcome! If you have any ideas or suggestions, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
- [TypeScript](https://www.typescriptlang.org/) - A strongly typed programming language that builds on JavaScript.
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework.
- [react-dropzone](https://react-dropzone.js.org/) - Simple React hook to create a HTML5-compliant drag-and-drop zone.
