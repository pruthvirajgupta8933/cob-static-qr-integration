import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import './FileUploader.css'; // Import the CSS file for styling

const FileUploader = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const onDrop = (acceptedFiles) => {
        // Add the uploaded files to the state
        setUploadedFiles(acceptedFiles);
    };

    const uploadFiles = async () => {
        const formData = new FormData();

        // Append each uploaded file to the FormData object
        uploadedFiles.forEach((file) => {
            formData.append('pdfFiles', file);
        });

        try {
            // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint for uploading files
            const response = await axios.post('YOUR_API_ENDPOINT', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Files uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: '.pdf',
        onDrop,
    });

    return (
        <div className="file-uploader">
            <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <p>Drag 'n' drop some PDF files here, or click to select files</p>
            </div>
            <button onClick={uploadFiles} className="upload-button btn cob-btn-primary btn-sm">
                Upload Files
            </button>
        </div>
    );
};

export default FileUploader;
