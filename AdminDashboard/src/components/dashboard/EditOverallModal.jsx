import { useState, useEffect } from "react";
import "./EditOverallModal.css";
import { FaTimes } from "react-icons/fa";

const EditOverallModal = ({ onClose, onSave, data, cards, onUpdate, onDelete }) => {
    //Form field states for creating/updating a card
    const [dataType, setDataType] = useState("questions");
    const [field, setField] = useState("");
    const [action, setAction] = useState("count");
    const [color, setColor] = useState("blue");
    const [title, setTitle] = useState("");

    //Adding or editing a card state
    const [mode, setMode] = useState("add");

    const [fields, setFields] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    //Updates the selectable fields when dataType changes
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

    //For handling modal draggability state
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    //Begins dragging the modal
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    //Move modal to follow mouse moves
    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - offset.x,
                y: e.clientY - offset.y,
            });
        }
    };

    //Stop dragging when mouse is released
    const handleMouseUp = () => {
        setIsDragging(false);
    };

    //Sets the modal's inital position to be center of the screen
    useEffect(() => {
        const modalWidth = 600;
        const modalHeight = 600;
        const centerX = window.innerWidth / 2 - modalWidth / 2;
        const centerY = window.innerHeight / 2 - modalHeight / 2;

        setPosition({ x: centerX, y: centerY });
    }, []);

    //Tack drag position by using mouse's events.
    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        } else {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging]);


    //Resets form fields to initial values
    const resetForm = () => {
        setDataType("questions");
        setField("");
        setAction("count");
        setColor("blue");
        setTitle("");
        setEditIndex(null);
    };

    //Submits form to save or update a card
    const handleSubmit = (e) => {
        e.preventDefault();
        //ensures that title fields is not empty.
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

    //Populates form with existing card info for editing
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
            <div 
                className="display-modal-content"
                onMouseDown={handleMouseDown}
                style={{
                    position : "absolute",
                    top: `${position.y}px`,
                    left: `${position.x}px`,
                    cursor: isDragging ? "grabbing" : "grab",
                }}
            >
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