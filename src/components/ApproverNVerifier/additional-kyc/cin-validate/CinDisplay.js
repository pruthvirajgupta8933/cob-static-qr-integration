import React from 'react'

function CinDisplay({ cinData }) {
    return (
        <div className={`container mt-5 cin_table`}>
            <h5 className="p-0">CIN Validation Details</h5>
            <div className="row border border-dark">
                {cinData &&
                    Object.keys(cinData).map((key) =>
                        typeof cinData[key] !== "object" ? (
                            <div className="col-md-6 p-2 text-uppercase border border-dark" key={key}>
                                <span className="font-weight-bold mb-1">
                                    {key.replaceAll("_", " ")}:
                                </span>
                                <span>&nbsp; {cinData[key]?.toString()}</span>
                            </div>
                        ) : (
                            <div className="col-md-12 p-2 text-uppercase" key={key}>
                                <span className="font-weight-bold mb-1">
                                    {key.replaceAll("_", " ")}:
                                </span>
                                {Array.isArray(cinData[key]) ? (
                                    cinData[key].map((data) => (
                                        <div className="row border rounded p-1 m-1">
                                            {Object.keys(data).map(
                                                (subkey) =>
                                                    typeof data[subkey] !== "object" && (
                                                        <div className="col-md-4">
                                                            <span className="font-weight-bold mb-1">
                                                                {subkey.replace(/([a-z])([A-Z])/g, "$1 $2")}
                                                                :
                                                            </span>
                                                            <span>&nbsp; {data[subkey]?.toString()}</span>
                                                        </div>
                                                    )
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <></>
                                )}
                            </div>
                        )
                    )}
            </div>
        </div>
    )
}

export default CinDisplay