import React, { useEffect, useState, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  kycDocumentUploadList,
  removeDocument,
} from "../../../../slices/kycSlice";
import DocViewerComponent from "../../../../utilities/DocViewerComponent";
import toastConfig from "../../../../utilities/toastTypes";

const ViewDocuments = () => {
  const [docViewer, setDocViewer] = useState();
  const basicDetailsResponse = useSelector(
    (state) => state.referralOnboard.basicDetailsResponse
  );
  const kycData = useSelector((state) => state.kyc?.kycUserList);
  const { KycDocUpload } = useSelector((state) => state.kyc);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      kycDocumentUploadList({
        login_id:
          kycData?.loginMasterId ?? basicDetailsResponse.data?.loginMasterId,
      })
    );
  }, []);

  const getKycDocList = () => {
    const merchantloginMasterId =
      kycData?.loginMasterId ?? basicDetailsResponse.data?.loginMasterId;
    if (merchantloginMasterId != undefined && merchantloginMasterId !== "") {
      const postData = {
        login_id: merchantloginMasterId,
      };

      dispatch(kycDocumentUploadList(postData));
    }
  };
  const removeDoc = (doc_id, doc_type) => {
    const isConfirm = window.confirm(
      "Are you sure you want to remove this document"
    );
    if (isConfirm) {
      const rejectDetails = {
        document_id: doc_id,
        removed_by:
          kycData?.loginMasterId ?? basicDetailsResponse.data?.loginMasterId,
      };
      dispatch(removeDocument(rejectDetails))
        .then((resp) => {
          setTimeout(() => {
            getKycDocList();
          }, 1300);

          resp?.payload?.status
            ? toastConfig.successToast(resp?.payload?.message)
            : toastConfig.errorToast(resp?.payload?.message);
        })
        .catch((e) => {
          toastConfig.errorToast("Try Again Network Error");
        });
    }
  };
  return (
    <div
      className="table-responsive overflow-auto"
      style={{ maxHeight: "250px" }}
    >
      {docViewer && (
        <DocViewerComponent
          modalToggle={docViewer}
          fnSetModalToggle={setDocViewer}
          selectViewDoc={{
            documentUrl: docViewer?.filePath,
            documentName: docViewer?.doc_type_name,
          }}
        />
      )}
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Type</th>
            <th scope="col">Name</th>
            {/* <th scope="col">Description</th> */}
            <th scope="col">View</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          <Suspense fallback={<div>Loading...</div>}></Suspense>
          {KycDocUpload.map((doc) => (
            <tr>
              <td>{doc.doc_type_name}</td>
              <td>{doc.name}</td>
              {/* <td>{doc.description}</td> */}
              <td
                className="text-primary cursor_pointer text-decoration-underline"
                onClick={() => setDocViewer(doc)}
              >
                View Document
              </td>
              <td>
                {doc.status !== "Approved" && doc.status !== "Verified" && (
                  <td>
                    <button
                      aria-label="remove-doc"
                      type="button"
                      onClick={() => {
                        removeDoc(doc?.documentId, doc?.type);
                      }}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewDocuments;
