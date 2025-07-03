import { useState, useEffect } from "react";
import "./EditOverallModal.css";

const EditOverallModal = ({ onClose, onSave, data }) => {
    const [dataType, setDataType] = useState("questions");
    const [field, setField] = useState("");
    const [action, setAction] = useState("count");
    const [color, setColor] = useState("blue");
    const [title, setTitle] = useState("");

    const [fields, setFields] = useState([]);

    useEffect(() => {
        if (data[dataType] && data[dataType].length > 0) {
            setFields(Object.keys(data[dataType][0]));
            setField(Object.keys(data[dataType][0])[0]);
        } else {
            setFields([]);
            setField("");
        }
    }, [dataType, data]);

    const handleSubmit = (e) => {
        e.preventDefault();
        //ensures that all fields are selected.
        if (!field || !title) return;

        const newCard = {
            dataType,
            field,
            action,
            color,
            title,
        };

        onSave(newCard);
    };

    return (
        <div className="display-modal-background">
            <div className="display-modal-content">
                <h2>Customize Overall Section</h2>
                <div className="toggle-button-group">
                    <button>
                        Add New Card
                    </button>
                    <button>
                        Edit Card
                    </button>
                </div>
                {/* For Adding */}
                <form onSubmit={handleSubmit} className="display-modal-form">
                    {/* Data Type */}
                    <label>Data Type:</label>
                    <select value={dataType} onChange={(e) => setDataType(e.target.value)}>
                        <option value="questions">Questions</option>
                        <option value="categories">Categories</option>
                        <option value="parties">Parties</option>
                    </select>

                    {/* Field */}
                    <label>Field:</label>
                    <select value={field} onChange={(e) => setField(e.target.value)} disabled={fields.length === 0}>
                        {fields.map((f) => (
                            <option value={f} key={f}>
                                {f}
                            </option>
                        ))}
                    </select>

                    {/* Action */}
                    <label>Action:</label>
                    <select value={action} onChange={(e) => setAction(e.target.value)}>
                        <option value="count">Count All</option>
                        <option value="countUnique">Count Unique</option>
                    </select>

                    {/* Color */}
                    <label>Card Color:</label>
                    <select value={color} onChange={(e) => setColor(e.target.value)}>
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                        <option value="yellow">Yellow</option>
                        <option value="red">Red</option>
                    </select>

                    {/* Title */}
                    <label>Card Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter card title"
                        required
                    />

                    {/* Buttons */}
                    <div className="display-modal-buttons">
                        <button type="submit">Save</button>
                        <button type="button" onClick={onClose} className="cancel-btn">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditOverallModal;