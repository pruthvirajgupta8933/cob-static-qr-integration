import React, { useState } from 'react'
import {
    kycDocumentUploadList,
} from "../../slices/kycSlice";
import { useDispatch, useSelector } from "react-redux";

const ViewStatusModal = (props) => {
    console.log(typeof(props),"========================>new Pending props")

    const dispatch = useDispatch();
    const { auth } = useSelector((state) => state);
    const { user } = auth;

    const { loginId } = user;



    let merchantloginMasterId = loginId;

    const [uploadData, setUploadData] = useState([])
    const [show, setShow] = useState(false)



    const handleClick = () => {
        dispatch(
            kycDocumentUploadList({
                login_id: props.tabData.login_id,
            })
        ).then((res) => {

            setUploadData(res.payload)
            setShow(true)
        });

    }

    return (
        <div>
 <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title bolding text-black" id="exampleModalLongTitle">Kyc Status</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={() => setShow(false)}>
                                <span aria-hidden="true">&times;
                                </span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Merchant Contact Info</th>
                                        <th>Business Overview</th>
                                        <th>Business Details</th>
                                        <th>Bank Details</th>
                                        <th>Upload Document</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{props.tabData.general_info_status}</td>
                                        <td>{props.tabData.general_info_status}</td>
                                        <td>{props.tabData.merchant_info_status}</td>
                                        <td>{props.tabData.settlement_info_status}</td>
                                        <td>

                                            <button type="button" class="btn btn-primary" onClick={() => handleClick()}>View Details</button>
                                        </td>
                                    </tr>

                                </tbody>
                                 </table>
                                 {show === true ?
                                <table class="table" width={"100%"}>
                                    <thead>
                                        <tr>
                                            <th>Document Name</th>
                                            <th>Document Status</th>
 </tr>
                                    </thead>
                                    {uploadData.length === 0 ?
                                        <tr>
                                            <td>Not Found</td>
                                            <td>Not Found</td>

                                        </tr>
                                        : uploadData?.map((merchantData) => {

                                            return (


                                                <tr>

                                                    <a href={merchantData?.filePath} rel="noreferrer" target="_blank" > <td>{merchantData?.name}</td></a>
                                                    <td>{merchantData?.status}</td>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-secondary text-white" onClick={() => setShow(false)} data-dismiss="modal">Close</button>

                                                    </div>
                                                </tr>
                                            )
                                        })}


                                </table>
                                : <></>}

                        </div>
                        {/* <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewStatusModal
