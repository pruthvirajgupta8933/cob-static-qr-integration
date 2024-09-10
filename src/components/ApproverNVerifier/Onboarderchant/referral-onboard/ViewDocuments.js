import React, { useEffect, useState, Suspense } from "react";

const ViewDocuments = () => {
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
          <Suspense fallback={<div>Loading...</div>}></Suspense>
        </tbody>
      </table>
    </div>
  );
};

export default ViewDocuments;
