import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import './FileUploader.css'; // Import the CSS file for styling
import {saveDocumentDetails} from '../../../services/approver-dashboard/merchantReferralOnboard.service';
import {useDropzone} from 'react-dropzone';
import {kycDocumentUploadList} from "../../../slices/kycSlice";


const FileUploader = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const {auth, merchantReferralOnboardReducer, kyc} = useSelector(state => state)
    const merchantLoginId = merchantReferralOnboardReducer?.merchantOnboardingProcess?.merchantLoginId

    const dispatch = useDispatch()
    const {  KycDocUpload } = kyc;

    const fetchDocList = ()=>{
        dispatch(kycDocumentUploadList({login_id: merchantLoginId}))
    }

    useEffect(() => {
        fetchDocList(merchantLoginId)
    }, []);

    console.log(KycDocUpload)

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
            fetchDocList(merchantLoginId)
            console.log('Files uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    const {getRootProps, getInputProps} = useDropzone({
        accept: '.pdf',
        onDrop,
    });

    console.log(uploadedFiles[0]?.name ?? "")
    return (
        <div>
        <div className="file-uploader">
            {uploadedFiles[0]?.name ?
                <p>{uploadedFiles[0]?.name} <span className='ml-5' onClick={() => {
                    setUploadedFiles([])
                }}>X</span></p> : null
            }
            <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <p>Drag 'n' drop some PDF files here, or click to select files</p>
            </div>
            <button onClick={uploadFiles} className="upload-button btn cob-btn-primary btn-sm">
                Upload Files
            </button>
        </div>

            <div className="row">
                Uploaded Document
                <ul>
                    {KycDocUpload?.map((d,i)=>(
                        <li><a href={d.filePath} target="_blank">View Document - {d.name}</a> </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FileUploader;
