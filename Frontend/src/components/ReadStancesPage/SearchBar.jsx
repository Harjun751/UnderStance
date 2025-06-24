import "./SearchBar.css";
import { useId } from "react";

export default function SearchBar({ setSearch }) {
    const id = useId();
    return (
        <div className="search-container">
            <label htmlFor="search">Search</label>
            <input
                id={`search-${id}`}
                type="text"
                name="search"
                placeholder="Enter a search term..."
                onChange={(e) => setSearch(e.target.value.toLowerCase())}
            />
        </div>
    );
}
