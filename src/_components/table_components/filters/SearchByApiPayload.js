import React, { useState, useEffect } from "react";
import * as bootstrap from 'bootstrap';

const SearchByApiPayload = ({ onSubmitSearch, clearFilter, value }) => {
    const [searchQueryText, setSearchQueryText] = useState(value);
    const [errorMessage, setErrorMessage] = useState("");
    const [showClearButton, setShowClearButton] = useState(false);

    useEffect(() => {
        setSearchQueryText(value);

        if (value && value !== "") {
            setShowClearButton(true);
        } else {
            setShowClearButton(false);
        }
    }, [value]);

    useEffect(() => {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        })
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQueryText.trim() === "") {
            setErrorMessage("Search query cannot be empty.");
            setShowClearButton(false);
        } else if (searchQueryText.length < 3) {
            setErrorMessage("Please enter at least 3 characters.");
            setShowClearButton(false);
        } else {
            setErrorMessage("");
            setShowClearButton(true);
            onSubmitSearch(searchQueryText);
        }
    };

    const handleClearFilter = () => {
        setSearchQueryText("");
        setErrorMessage("");
        setShowClearButton(false);
        clearFilter();
    };

    return (
        <React.Fragment>
            <label htmlFor="searchPayload" className="form-label">
                Search
            </label>
            <form onSubmit={handleSearchSubmit}>
                <div className="input-group mb-0">
                    <input
                        id="searchPayload"
                        className="form-control"
                        onChange={(e) => setSearchQueryText(e.target.value)}
                        type="text"
                        value={searchQueryText}
                        placeholder="Type your search query"
                        data-bs-toggle="tooltip"
                        data-bs-html="true"
                        title="<div class='text-start'>
                        Search by :- </br>
                        Transaction ID </br>
                        Client Transaction ID</br>
                        RRN/UTR</br>
                        Payer Email</br>
                        Payee Mobile<br/>Payee First Name </div>"
                    />
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="submit" title="search">
                            <i className="fa fa-search" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
                {errorMessage && (
                    <div className="text-danger mt-1">
                        {errorMessage}
                    </div>
                )}

                {showClearButton && (
                    <div
                        onClick={handleClearFilter}
                        className="d-inline-flex align-items-center btn btn-link p-0 mt-1"
                        style={{ textDecoration: 'none' }}
                    >
                        <i className="fa fa-times me-1" aria-hidden="true"></i>
                        {" Clear Filter"}
                    </div>
                )}
            </form>
        </React.Fragment>
    );
};

export default SearchByApiPayload;
