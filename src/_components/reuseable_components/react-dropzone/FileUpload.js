import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './FileUploader.css'; // Import the CSS file for styling
import { saveDocumentDetails } from '../../../services/approver-dashboard/merchantReferralOnboard.service';
import { useDropzone } from 'react-dropzone';
import { kycDocumentUploadList } from "../../../slices/kycSlice";
import toastConfig from "../../../utilities/toastTypes";


const FileUploader = ({setCurrentTab}) => {

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [submitLoader, setSubmitLoader] = useState(false);
    const [documentUploadResponse,setDocumentuploadResponse]=useState({})
    console.log("documentUploadResponse",documentUploadResponse)

 

    const { auth, merchantReferralOnboardReducer, kyc } = useSelector(state => state)
    const merchantLoginId = merchantReferralOnboardReducer?.merchantOnboardingProcess?.merchantLoginId

    const dispatch = useDispatch()
    const { KycDocUpload } = kyc;

    const fetchDocList = () => {
        dispatch(kycDocumentUploadList({ login_id: merchantLoginId }))
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
        setSubmitLoader(true)
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
            console.log(response,"this is rcomplete response")
            setDocumentuploadResponse(response?.data?.status)
            fetchDocList(merchantLoginId)
            toastConfig.successToast(response.data?.message)
            setSubmitLoader(false)
            // console.log('Files uploaded successfully:', response.data?.message);
        } catch (error) {
            // toastConfig.errorToast(response.data?.message)
            toastConfig.errorToast('Error uploading files');
            setSubmitLoader(false)
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: '.pdf',
        onDrop,
    });

    return (
        <div>
            <div className="file-uploader">
                {uploadedFiles[0]?.name ?
                    <p>{uploadedFiles[0]?.name} <span className='ml-5 cursor_pointer' onClick={() => {
                        setUploadedFiles([])
                    }}>X</span></p> : null
                }
                <div {...getRootProps()} className="dropzone">
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some PDF files here, or click to select files 5MB</p>
                </div>
                {uploadedFiles?.length > 0 &&
                    <button onClick={uploadFiles} className="upload-button btn cob-btn-primary btn-sm mt-2">
                        {submitLoader && <>
                            <span className="spinner-border spinner-border-sm" role="status"
                                aria-hidden="true" />
                            <span className="sr-only">Loading...</span>
                        </>} Upload Files
                    </button>  } {documentUploadResponse === true &&
                                    <a className="btn active-secondary btn-sm m-2" onClick={()=>setCurrentTab(5)}>Next</a>
                                }

                    

            </div>

            {KycDocUpload?.length > 0 && <div className="row p-2">
                <h6>Uploaded Document</h6>
                <ul>
                    {KycDocUpload?.map((d, i) => (
                        <li><a href={d.filePath} target="_blank">View Document - {d.name}</a></li>
                    ))}
                </ul>
            </div>}
        </div>
    );
};

export default FileUploader;
