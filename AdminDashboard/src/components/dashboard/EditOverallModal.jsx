import { useState, useEffect, useCallback } from "react";
import "./EditOverallModal.css";
import { FaTimes } from "react-icons/fa";

const EditOverallModal = ({
    onClose,
    onSave,
    data,
    cards,
    onUpdate,
    onDelete,
    onReorder,
}) => {
    //Form field states for creating/updating a card
    const [dataType, setDataType] = useState("questions");
    const [field, setField] = useState("");
    const [action, setAction] = useState("count");
    const [color, setColor] = useState("blue");
    const [title, setTitle] = useState("");
    const [filters, setFilters] = useState([]);

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
    }, [dataType, data, field]);

    const getUniqueValues = (field) => {
        if (!data[dataType] || !field) return [];
        const values = data[dataType].map((item) => item[field]);
        return [...new Set(values)].filter(
            (v) => v !== undefined && v !== null,
        );
    };

    //For handling modal draggability state
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    //Begins dragging the modal
    const handleMouseDown = useCallback(
        (e) => {
            setIsDragging(true);
            setOffset({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            });
        },
        [position],
    );

    //Move modal to follow mouse moves
    const handleMouseMove = useCallback(
        (e) => {
            if (isDragging) {
                const modalWidth = 600;
                const modalHeight = 600;

                let newX = e.clientX - offset.x;
                let newY = e.clientY - offset.y;

                // Clamp values to stay within window bounds
                newX = Math.max(
                    0,
                    Math.min(window.innerWidth - modalWidth, newX),
                );
                newY = Math.max(
                    0,
                    Math.min(window.innerHeight - modalHeight, newY),
                );

                setPosition({ x: newX, y: newY });
            }
        },
        [isDragging, offset],
    );

    //Stop dragging when mouse is released
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    //Sets the modal's inital position to be center of the screen
    useEffect(() => {
        const modalWidth = 600;
        const modalHeight = 600;
        const centerX = window.innerWidth / 2 - modalWidth / 2;
        const centerY = window.innerHeight / 2 - modalHeight / 1.5;

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
    }, [isDragging, handleMouseMove, handleMouseUp]);

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
            filter: filters.filter((f) => f.filterField && f.filterValue),
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
                style={{
                    position: "absolute",
                    top: `${position.y}px`,
                    left: `${position.x}px`,
                    cursor: isDragging ? "grabbing" : "grab",
                }}
            >
                <button
                    type="button"
                    className="header-row"
                    onMouseDown={handleMouseDown} //this will make sure it only drags when moving the header.
                >
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
                </button>
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
                <div className="content-wrapper">
                    {mode === "edit" && editIndex === null && (
                        <div className="edit-list">
                            {cards.length === 0 && <p>No cards to edit.</p>}
                            {cards.map((card, idx) => (
                                <div key={card} className="edit-item">
                                    <strong>{card.title}</strong>
                                    <div className="edit-actions">
                                        <button
                                            type="button"
                                            className="edit-button"
                                            onClick={() =>
                                                handleEditClick(card, idx)
                                            }
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="delete-button"
                                            onClick={() => onDelete(idx)}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            type="button"
                                            className="up-button"
                                            disabled={idx === 0}
                                            onClick={() => {
                                                const updated = [...cards];
                                                [
                                                    updated[idx - 1],
                                                    updated[idx],
                                                ] = [
                                                    updated[idx],
                                                    updated[idx - 1],
                                                ];
                                                onReorder(updated);
                                            }}
                                        >
                                            ↑
                                        </button>
                                        <button
                                            type="button"
                                            className="down-button"
                                            disabled={idx === cards.length - 1}
                                            onClick={() => {
                                                const updated = [...cards];
                                                [
                                                    updated[idx],
                                                    updated[idx + 1],
                                                ] = [
                                                    updated[idx + 1],
                                                    updated[idx],
                                                ];
                                                onReorder(updated);
                                            }}
                                        >
                                            ↓
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* For Adding */}
                    {(mode === "add" ||
                        (mode === "edit" && editIndex !== null)) && (
                        <form
                            onSubmit={handleSubmit}
                            className="display-modal-form"
                        >
                            <h3>
                                Currently{" "}
                                {mode === "add"
                                    ? "Adding a new Card"
                                    : `Editing "${title}" Card`}
                            </h3>
                            {/* Data Type */}
                            <label htmlFor="field-select">
                                Table selection:
                            </label>
                            <select
                                value={dataType}
                                onChange={(e) => setDataType(e.target.value)}
                            >
                                <option value="questions">Questions</option>
                                <option value="categories">Categories</option>
                                <option value="parties">Parties</option>
                                <option value="stances">Stances</option>
                            </select>

                            {/* Field */}
                            <label htmlFor="field-select">Target Field:</label>
                            <select
                                value={field}
                                onChange={(e) => setField(e.target.value)}
                                disabled={fields.length === 0}
                            >
                                {fields.map((f) => (
                                    <option value={f} key={f}>
                                        {f}
                                    </option>
                                ))}
                            </select>

                            {/* Action */}
                            <label htmlFor="field-select">Action:</label>
                            <select
                                value={action}
                                onChange={(e) => setAction(e.target.value)}
                            >
                                <option value="count">Count All</option>
                                <option value="countUnique">
                                    Count Unique
                                </option>
                            </select>

                            {/* Filter for Valuue */}
                            <label htmlFor="field-select">Filter for:</label>
                            <div className="filter-titles">
                                <h4>Filter Field</h4>
                                <h4>Filter Value</h4>
                            </div>
                            {/* <select
                                value={filterValue}
                                onChange={(e) => setFilterValue(e.target.value)}
                                disabled={filterOptions.length === 0}
                            >
                                <option value="">-- No Filter --</option>
                                {filterOptions.map((value) => (
                                    <option key={value} value={value}>
                                        {String(value)}
                                    </option>
                                ))}
                            </select> */}
                            {filters.map((f, index) => (
                                <div key={f} className="filter-row">
                                    <select
                                        value={f.filterField}
                                        onChange={(e) => {
                                            const updated = [...filters];
                                            updated[index].filterField =
                                                e.target.value;
                                            updated[index].filterValue = "";
                                            setFilters(updated);
                                        }}
                                    >
                                        <option value="">
                                            -- Select Field --
                                        </option>
                                        {fields.map((fieldOpt) => (
                                            <option
                                                key={fieldOpt}
                                                value={fieldOpt}
                                            >
                                                {fieldOpt}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        value={f.filterValue}
                                        onChange={(e) => {
                                            const updated = [...filters];
                                            updated[index].filterValue =
                                                e.target.value;
                                            setFilters(updated);
                                        }}
                                        disabled={!f.filterField}
                                    >
                                        <option value="">
                                            -- Select Value --
                                        </option>
                                        {getUniqueValues(f.filterField).map(
                                            (val) => (
                                                <option key={val} value={val}>
                                                    {String(val)}
                                                </option>
                                            ),
                                        )}
                                    </select>

                                    <button
                                        type="button"
                                        className="remove-button"
                                        onClick={() => {
                                            const updated = filters.filter(
                                                (_, i) => i !== index,
                                            );
                                            setFilters(updated);
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="add-filter-button"
                                onClick={() =>
                                    setFilters([
                                        ...filters,
                                        { filterField: "", filterValue: "" },
                                    ])
                                }
                            >
                                + Add Filter
                            </button>

                            {/* Color */}
                            <label htmlFor="field-select">Card Color:</label>
                            <select
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                            >
                                <option value="blue">Blue</option>
                                <option value="green">Green</option>
                                <option value="yellow">Yellow</option>
                                <option value="red">Red</option>
                            </select>

                            {/* Title */}
                            <label htmlFor="field-input">Card Title:</label>
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
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="cancel-btn"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditOverallModal;
