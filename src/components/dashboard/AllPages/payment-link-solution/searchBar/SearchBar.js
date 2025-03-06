import { useState } from "react";

const SearchBar = ({
    searchTerm,
    setSearchTerm,
    onSearch,
    placeholder = "Search...",
    loadData
}) => {
    const [error, setError] = useState("");



    const handleClear = async () => {
        await setSearchTerm("");
        setError(""); // Clear any existing error
        loadData({ clearSearchState: true });
    };

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setError("Please enter a search term.");
            return;
        }
        setError(""); // Clear error when valid input is given
        onSearch();

    };

    return (
        <div>
            <div className="input-group">
                <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />

                {searchTerm && (
                    <button className="btn btn-outline-secondary" onClick={handleClear}>
                        <i className="fa fa-times"></i>
                    </button>
                )}

                <span className="input-group-text" onClick={handleSearch}>
                    <i className="fa fa-search"></i>
                </span>
            </div>


            {error && <p className="text-danger mt-1">{error}</p>}
        </div>
    );
};

export default SearchBar;
