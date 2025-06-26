import "./UpdateItemPanel.css";
import { useEffect, useState } from "react";
import { IoMdArrowDropright, IoMdArrowDropleft } from "react-icons/io";
import { FaTimes } from "react-icons/fa";

const UpdateItemPanel = ({ item, onClose, onSubmit, onDelete }) => {
    const [formData, setFormData] = useState({});
    const [isExpanded, setIsExpanded] = useState(false);

    // Initialize formData when item is provided
    useEffect(() => {
        if (item) {
            setFormData(item);
        }
    }, [item]);

    const handleChange = (field, value) => {
        // For booleans, convert string "True"/"False" back to boolean
        if (typeof formData[field] === "boolean") {
            value = value === "True";
        }
        
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    const handleDelete = (e) => {
        e.preventDefault();
        onDelete(formData);
        onClose();
    };

    if (!item) return null;

    return (
        <div 
            className={`side-panel ${isExpanded ? "expanded" : ""}`}
        >
            <button 
                type="button"
                className="close-btn" 
                onClick={onClose}
            >
                <FaTimes />
            </button>
            <button
                type="button"
                className="expand-btn"
                onClick={() => setIsExpanded(prev => !prev)}
                title={isExpanded ? "Collapse Panel" : "Expand Panel"}
            >
                {isExpanded ? <IoMdArrowDropright /> : <IoMdArrowDropleft />}
            </button>
            <h3>Quick View/Edit</h3>
            <h4>Select & Edit whichever parts you need</h4>
            <form onSubmit={handleSubmit} className="panel-form">
                {Object.entries(formData).map(([key, value]) => (
                    <div key={key} className="form-group">
                        <label htmlFor={key}>{key}</label>

                        {typeof value === "boolean" ? (
                            <select
                                id={key}
                                value={value ? "True" : "False"}
                                onChange={(e) => handleChange(key, e.target.value)}
                            >
                                <option value="True">Agree</option>
                                <option value="False">Disagree</option>
                            </select>
                        ) : (
                            <textarea
                                id={key}
                                value={value}
                                onChange={(e) => handleChange(key, e.target.value)}
                                disabled={key.toLowerCase() === "id"}
                                rows={2}
                            />
                        )}
                    </div>
                ))}
                <div className="panel-buttons">
                    <button type="submit" className="panel-submit">
                        Update Entry
                    </button>
                    <button type="button" onClick={handleDelete} className="panel-delete">
                        Delete Entry
                    </button>
                    <button type="button" onClick={onClose} className="panel-cancel">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
        
    );
};

export default UpdateItemPanel;