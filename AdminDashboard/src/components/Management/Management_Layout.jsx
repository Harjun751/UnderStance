import Layout from "../general/Layout"
import "./Management_Layout.css"
import { useState, useMemo } from "react"
import AddItem from "./AddItem";
import UpdateItemPanel from "./UpdateItemPanel";
import { FaCheck, FaTimes } from "react-icons/fa";

const Management_Layout = ({title, data}) => {
    // For Table Filters
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({});

    // For AddItem Model
    const [showForm, setShowForm] = useState(false);

    // For Side Panel
    const [selectedRow, setSelectedRow] = useState(null);

    const headers = useMemo(() => (data.length > 0 ? Object.keys(data[0]) : []), [data]);

    // Unique values for each column for filter dropdowns
    const uniqueValues = useMemo(() => {
        const values = {};
        headers.forEach((header) => {
            values[header] = [...new Set(data.map((row) => row[header]))];
        });
        return values;
    }, [data, headers]);

    // Filter and search logic
    const filteredData = useMemo(() => {
        return data.filter((row) => {
            // Apply search
            const matchesSearch = Object.values(row).some((val) =>
                val?.toString().toLowerCase().includes(search.toLowerCase())
            );

            // Apply dropdown filters
            const matchesFilters = Object.entries(filters).every(([key, val]) => {
                return val === "" || String(row[key]) === val;
            });

            return matchesSearch && matchesFilters;
        });
    }, [data, search, filters]);

    const handleFilterChange = (header, value) => {
        setFilters((prev) => ({ ...prev, [header]: value }));
    };

    const renderTable = () => {
        if (!Array.isArray(data) || data.length === 0) {
            return (
                <div className="table-empty">
                    No data found in table.
                </div>
            );
        }

        const headers = Object.keys(data[0]);

        return (
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            {headers.map((header) => (
                                <th key={header} className="table-header">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((row, idx) => (
                            <tr 
                                key={idx} 
                                className={`table-row ${selectedRow === row ? "table-row-selected" : ""}`}
                                onClick={() => setSelectedRow(row)}    
                            >
                                {headers.map((header) => (
                                    <td key={header} className="table-cell">
                                        {typeof row[header] === "boolean"
                                            ? row[header] ? (
                                                    <FaCheck className="boolean-true" />
                                                ): (
                                                    <FaTimes className="boolean-false" />
                                                )
                                            : row[header]
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
    return (
        <Layout title={title}>
            {/* Implement Dynamic Table Design */}
            <div className="management">
                <div className="management-header">
                    {/* pass value */} 
                    {title} List
                    <div className="management-header-right">
                        <button
                            type="button"
                            className="button-management-add"
                            onClick={() => setShowForm(true)}
                        >
                            Add {title}
                        </button>
                    </div>
                </div>
                <div className="management-sub">
                    <div className="search-bar">
                        {/* Create Simple Search Bar to filter table */}
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="table-filters">
                        {/* Create various drop down filters for the table */}
                        {headers.map((header) => (
                            <select
                                key={header}
                                value={filters[header] || ""}
                                onChange={(e) => handleFilterChange(header, e.target.value)}
                                className="filter-dropdown"
                            >
                                <option value="">All {header}</option>
                                {uniqueValues[header].map((val) => (
                                    <option key={val} value={val}>
                                        {val.toString()}
                                    </option>
                                ))}
                            </select>
                        ))}
                    </div>
                </div>
                {renderTable()}
                <div className="table-filtered-count">
                    ({filteredData.length} items)
                </div>
                {showForm && (
                    <AddItem
                        title={title}
                        headers={headers}
                        onClose={() => setShowForm(false)}
                        onSubmit={(item) => {
                            console.log("Added item:", item); //for debugging
                            // Add logic here to submit updated
                            setShowForm(false);
                        }}
                        sampleItem={data[0]} //sample data used to detect variable types
                    />
                )}
                {selectedRow && (
                    <UpdateItemPanel
                        item={selectedRow}
                        onClose={() => setSelectedRow(null)}
                        onSubmit={(item) => {
                            console.log("Updated item:", item); //for debugging
                            // Add logic here to submit updated
                            setShowForm(false);
                        }}
                    />
                )}
            </div>
        </Layout>
    )
}

export default Management_Layout;