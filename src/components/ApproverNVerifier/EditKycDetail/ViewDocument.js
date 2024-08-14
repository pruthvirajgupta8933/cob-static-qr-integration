import React, { useEffect, useState,Suspense } from 'react'
import { useDispatch } from 'react-redux';
import { kycDocumentUploadList } from '../../../slices/kycSlice';


const ViewDocument = (props) => {
    const [viewDocument, setViewDocument] = useState([])
    const dispatch = useDispatch()
    const selectedId = props.selectedId
    useEffect(() => {
        dispatch(kycDocumentUploadList({ login_id: selectedId })).then((res) => {
            setViewDocument(res?.payload)
        }).catch(() => {

        });
    }, []);
    return (
        <div className="table-responsive">
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">View</th>
                    </tr>
                </thead>
                <tbody>
                    <Suspense fallback={<div>Loading...</div>}>
                        {viewDocument?.map((data) => (
                            <tr key={data?.id}>
                                <td>{data?.doc_type_name}</td>
                                <td>{data?.name}</td>
                                <td>{data?.description || "NA"}</td>
                                <td>
                                    <a href={data?.filePath} className="text-primary" target="_blank" rel="noopener noreferrer">
                                        View Document
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </Suspense>
                </tbody>
            </table>
        </div>


    )
}

export default ViewDocument
