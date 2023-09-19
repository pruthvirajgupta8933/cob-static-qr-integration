import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import './FileUploader.css'; // Import the CSS file for styling
import { saveDocumentDetails } from '../../../services/approver-dashboard/merchantReferralOnboard.service';
import { useSelector } from 'react-redux';

const FileUploader = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const { auth, merchantReferralOnboardReducer } = useSelector(state => state)
    const merchantLoginId = merchantReferralOnboardReducer?.merchantOnboardingProcess?.merchantLoginId

    const onDrop = (acceptedFiles) => {
        // Add the uploaded files to the state
        setUploadedFiles(acceptedFiles);
    };

    const uploadFiles = async () => {
        const formData = new FormData();
        // setUploadedFiles()
        // Append each uploaded file to the FormData object
        uploadedFiles.forEach((file) => {
            formData.append('files', file);
        });

        formData.append('login_id', merchantLoginId);
        formData.append('modified_by', auth?.user?.loginId);
        try {
            // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint for uploading files
            const response = await saveDocumentDetails(formData)

            console.log('Files uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: '.pdf',
        onDrop,
    });

    console.log(uploadedFiles[0]?.name ?? "")
    return (
        <div className="file-uploader">
            {uploadedFiles[0]?.name ?
                <p>{uploadedFiles[0]?.name} <span className='ml-5' onClick={() => { setUploadedFiles([]) }}>X</span></p> : null
            }
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
