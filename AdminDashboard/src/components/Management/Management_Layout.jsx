import Layout from "../general/Layout";
import "./Management_Layout.css";
import { useState, useMemo } from "react";
import AddItem from "./AddItem";
import UpdateItemPanel from "./UpdateItemPanel";
import { FaCheck, FaTimes } from "react-icons/fa";
import { FaAnglesRight , FaAnglesLeft  } from "react-icons/fa6";
import Loader from "../general/Loader";

const Management_Layout = ({ title, data, isLoading, schema }) => {
    // For Table Filters
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({});

    // For AddItem Model
    const [showForm, setShowForm] = useState(false);

    // For Side Panel
    const [selectedRow, setSelectedRow] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleClosePanel = () => {
        setSelectedRow(null);
        setIsExpanded(false);
    };

    const toggleExpand = () => {
        setIsExpanded((prev) => !prev);
    };

    // Unique values for each filterable column for filter dropdowns
    const uniqueValues = useMemo(() => {
        const values = {};
        schema.filter((obj) => obj.filterable === true).forEach((field) => {
            values[field.name] = [...new Set(data.map((row) => row[field.name]))];
        });
        return values;
    }, [data, schema]);
    
    // Filter and search logic
    const filteredData = useMemo(() => {
        return data.filter((row) => {
            // Apply search
            const matchesSearch = Object.values(row).some((val) =>
                val?.toString().toLowerCase().includes(search.toLowerCase()),
            );

            // Apply dropdown filters
            const matchesFilters = Object.entries(filters).every(
                ([key, val]) => {
                    return val === "" || String(row[key]) === val;
                },
            );

            return matchesSearch && matchesFilters;
        });
    }, [data, search, filters]);

    const handleFilterChange = (header, value) => {
        setFilters((prev) => ({ ...prev, [header]: value }));
    };

    const renderTable = () => {
        if (isLoading) {
            return <Loader message="Loading data..." style={{ marginTop:"50px" }}/>
        }
        if (!Array.isArray(data) || data.length === 0) {
            return <div className="table-empty">No data found in table.</div>;
        }

        return (
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            {schema.map((field) => (
                                <th key={field.name} className="table-header">
                                    {field.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((row, index) => (
                            <tr
                                key={index}
                                className={`table-row ${selectedRow === row ? "table-row-selected" : ""}`}
                                onClick={() => setSelectedRow(row)}
                            >
                                {schema.map((field) => (
                                    <td key={field.name} className="table-cell">
                                        {field.type === "boolean" ? (
                                            row[field.name] ? (
                                                <FaCheck className="boolean-true" />
                                            ) : (
                                                <FaTimes className="boolean-false" />
                                            )
                                        ) : field.type === "image" ? (
                                            row[field.name] ? (
                                                <img
                                                    src={row[field.name]}
                                                    alt="thumbnail"
                                                    style={{ width: "30px", height: "30px", objectFit: "cover" }}
                                                />
                                            ) : (
                                                <div style={{ width: "20px", height: "20px", background: "#eee" }} />
                                            )
                                        ) : (
                                            row[field.name]
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };
    return (
        <Layout title={title}>
            {/* Dynamic Table Design */}
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
                        {schema.filter((obj) => obj.filterable === true).map((field) => (
                            <select
                                key={field.name}
                                value={filters[field.name] || ""}
                                onChange={(e) =>
                                    handleFilterChange(field.name, e.target.value)
                                }
                                className="filter-dropdown"
                            >
                                <option value="">Any {field.name}</option>
                                {uniqueValues[field.name].map((val) => (
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
                        onClose={() => setShowForm(false)}
                        onSubmit={(item) => {
                            console.log("Added item:", item); //for debugging
                            // Add logic here to submit updated
                            setShowForm(false);
                        }}
                        schema={schema}
                    />
                )}
            </div>
            <div className={`panel-wrapper ${selectedRow ? "open" : ""} ${isExpanded ? "expanded" : ""}`}>
                {selectedRow && (
                    <>
                        <button
                            type="button"
                            className="close-btn"
                            onClick={handleClosePanel}
                            title="Close Panel"
                        >
                            <FaTimes />
                        </button>
                        <button
                            type="button"
                            className="expand-btn"
                            onClick={toggleExpand}
                            title={isExpanded ? "Collapse Panel" : "Expand Panel"}
                        >
                            {isExpanded ? <FaAnglesRight /> : <FaAnglesLeft />}
                        </button>
                        <UpdateItemPanel
                            item={selectedRow}
                            onClose={handleClosePanel}
                            onSubmit={(item) => {
                                console.log("Updated item:", item); //for debugging
                                // Add logic here to submit updated
                                setShowForm(false);
                            }}
                            onDelete={(item) => {
                                console.log("Deleted item:", item); //for debugging
                                // Add logic here to submit updated
                                setShowForm(false);
                            }}
                            schema={schema}
                            isExpanded={isExpanded}
                        />
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Management_Layout;
