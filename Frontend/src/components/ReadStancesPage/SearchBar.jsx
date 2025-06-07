import "./SearchBar.css";
import { useState } from 'react';

export default function SearchBar({
    setSearch
}) {

    return (
        <div className="search-container">
            <label htmlFor="search">Search</label>
            <input 
                type="text"
                name="search"
                placeholder="Enter a search term..."
                onChange={e => setSearch(e.target.value.toLowerCase())}
            />
        </div>
    );
}

