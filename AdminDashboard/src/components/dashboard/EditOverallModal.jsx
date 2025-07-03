import { useState, useEffect } from "react";
import "./EditOverallModal.css";
import { FaTimes } from "react-icons/fa";

const EditOverallModal = ({ onClose, onSave, data, cards, onUpdate, onDelete }) => {
    const [dataType, setDataType] = useState("questions");
    const [field, setField] = useState("");
    const [action, setAction] = useState("count");
    const [color, setColor] = useState("blue");
    const [title, setTitle] = useState("");

    const [mode, setMode] = useState("add");

    const [fields, setFields] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        if (data[dataType] && data[dataType].length > 0) {
            setFields(Object.keys(data[dataType][0]));
            if (!field) {
                setField(Object.keys(data[dataType][0])[0]);
            }
        } else {
            setFields([]);
            setField("");
        }
    }, [dataType, data]);

    const resetForm = () => {
        setDataType("questions");
        setField("");
        setAction("count");
        setColor("blue");
        setTitle("");
        setEditIndex(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        //ensures that all fields are selected.
        if (!title) return;

        const card = {
            dataType,
            field,
            action,
            color,
            title,
        };

        if (mode === "add") {
            onSave(card);
        } else if (mode === "edit" && editIndex !== null) {
            onUpdate(editIndex, card);
        }
        resetForm();
    };

    const handleEditClick = (card, index) => {
        setDataType(card.dataType);
        setField(card.field);
        setAction(card.action);
        setColor(card.color);
        setTitle(card.title);
        setEditIndex(index);
        setMode("edit");
    };

    return (
        <div className="display-modal-background">
            <div className="display-modal-content">
                <div className="header-row">
                    <h2>Customize Overall Section</h2>
                    <div className="header-row-right">
                        <button
                            type="button"
                            onClick={onClose}
                            className="close-button"
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>
                <div className="toggle-button-group">
                    <button
                        type="button"
                        className={mode === "add" ? "active" : ""}
                        onClick={() => {
                            setMode("add");
                            resetForm();
                        }}    
                    >
                        Add New Card
                    </button>
                    <button
                        type="button"
                        className={mode === "edit" ? "active" : ""}
                        onClick={() => {
                            setMode("edit");
                            resetForm();
                        }}
                    >
                        Edit Card
                    </button>
                </div>

                {mode === "edit" && editIndex === null && (
                    <div className="edit-list">
                        {cards.length === 0 && <p>No cards to edit.</p>}
                        {cards.map((card, idx) => (
                            <div key={card} className="edit-item">
                                <strong>{card.title}</strong>
                                <div className="edit-actions">
                                    <button type="button" onClick={() => handleEditClick(card, idx)}>Edit</button>
                                    <button type="button" onClick={() => onDelete(idx)} className="delete-button">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* For Adding */}
                {(mode === "add" || (mode === "edit" && editIndex !== null)) && (
                    <form onSubmit={handleSubmit} className="display-modal-form">
                        <h3>
                            Currently {" "}
                            {mode === "add"
                                ? "Adding a new Card"
                                : `Editing "${title}" Card`}
                        </h3>
                        {/* Data Type */}
                        <label>Table selection:</label>
                        <select value={dataType} onChange={(e) => setDataType(e.target.value)}>
                            <option value="questions">Questions</option>
                            <option value="categories">Categories</option>
                            <option value="parties">Parties</option>
                            <option value="stances">Stances</option>
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
                )}
            </div>
        </div>
    );
};

export default EditOverallModal;