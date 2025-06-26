import "./AddItem.css";
import { useState } from "react";

const AddItem = ({
    headers = [],
    title = "Item",
    onClose,
    onSubmit,
    sampleItem = {}
}) => {
    const initForm = {};
    headers.forEach((header) => {
        if (header !== "id") {
            initForm[header] = "";
        }
    });

    const [formData, setFormData] = useState(initForm);

    const handleChange = (field, value) => {
        if (typeof sampleItem[field] === "boolean") {
            value = value === "True";
        }
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); // Callback to parent
        onClose();          // Close modal
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Add New {title}</h3>
                <form onSubmit={handleSubmit} className="modal-form">
                    {headers.filter(h => h !== "id").map((header) => (
                        <div key={header} className="form-group">
                            <label htmlFor={`additem-${header}`}>{header}</label>
                            {typeof sampleItem[header] === "boolean" ? (
                            <select
                                id={`additem-${header}`}
                                value={formData[header] === true ? "True" : "False"}
                                onChange={(e) => handleChange(header, e.target.value)}
                            >
                                <option value="True">Agree</option>
                                <option value="False">Disagree</option>
                            </select>
                            ) : (
                            <textarea
                                id={`additem-${header}`}
                                value={formData[header]}
                                onChange={(e) => handleChange(header, e.target.value)}
                            />
                            )}
                        </div>
                    ))}
                    <div className="modal-buttons">
                        <button type="button" onClick={onClose} className="modal-cancel">Cancel</button>
                        <button type="submit" className="modal-submit">Save Question</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddItem;