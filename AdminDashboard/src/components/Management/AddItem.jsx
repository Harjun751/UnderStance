import "./AddItem.css";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { FaTimes } from "react-icons/fa";

const AddItem = ({ title = "Item", onClose, onSubmit, schema = [] }) => {
    const initialState = {};
    schema.forEach((field) => {
        if (field.type === "dropdown") {
            // track value as well for display later
            initialState[`${field.name}ID`] = "";
            initialState[`${field.name}`] = "";
        } else if (field.type !== "id") {
            initialState[field.name] = "";
        }
    });

    const [formData, setFormData] = useState(initialState);

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); // Callback to parent
        onClose(); // Close modal
    };

    //Check if form is valid before proceeding for submission
    const formValid = Object.values(formData).every(
        (val) => val !== "" && val !== null && val !== undefined,
    );

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header-row">
                    <h2>Add New {title}</h2>
                    <div className="modal-header-row-right">
                        <button
                            type="button"
                            onClick={onClose}
                            className="modal-close-button"
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit} className="modal-form">
                        {schema
                            .filter((field) => field.type !== "id")
                            .map((field) => (
                                <div key={field.name} className="form-group">
                                    <label htmlFor={`additem-${field.name}`}>
                                        {field.name}
                                    </label>
                                    {field.type === "boolean" ? (
                                        <select
                                            id={`additem-${field.name}`}
                                            value={formData[field.name]}
                                            onChange={(e) =>
                                                handleChange(
                                                    field.name,
                                                    e.target.value === "true",
                                                    field.type,
                                                )
                                            }
                                        >
                                            <option value="" disabled>
                                                Select a value
                                            </option>
                                            <option value="true">
                                                {field.booleanData?.trueLabel ||
                                                    "True"}
                                            </option>
                                            <option value="false">
                                                {field.booleanData
                                                    ?.falseLabel || "False"}
                                            </option>
                                        </select>
                                    ) : field.type === "string" ? (
                                        <textarea
                                            id={`additem-${field.name}`}
                                            value={formData[field.name]}
                                            onChange={(e) =>
                                                handleChange(
                                                    field.name,
                                                    e.target.value,
                                                    field.type,
                                                )
                                            }
                                            maxLength={field.maxLen || 255}
                                        />
                                    ) : field.type === "dropdown" ? (
                                        <select
                                            id={`additem-${field.name}ID`}
                                            value={formData[`${field.name}ID`]}
                                            onChange={(e) => {
                                                handleChange(
                                                    `${field.name}ID`,
                                                    e.target.value,
                                                    field.type,
                                                );
                                                handleChange(
                                                    field.name,
                                                    e.target.options[
                                                        e.target.selectedIndex
                                                    ].text,
                                                    "text",
                                                );
                                            }}
                                        >
                                            <option value="" disabled>
                                                Select {field.name}
                                            </option>
                                            {field.dropdownData.data.map(
                                                (item) => (
                                                    <option
                                                        key={
                                                            item[
                                                                field
                                                                    .dropdownData
                                                                    .key
                                                            ]
                                                        }
                                                        value={
                                                            item[
                                                                field
                                                                    .dropdownData
                                                                    .key
                                                            ]
                                                        }
                                                    >
                                                        {
                                                            item[
                                                                field
                                                                    .dropdownData
                                                                    .value
                                                            ]
                                                        }
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    ) : field.type === "image" ? (
                                        <>
                                            <input
                                                type="text"
                                                id={`additem-${field.name}`}
                                                value={formData[field.name]}
                                                placeholder="Enter image URL"
                                                onChange={(e) =>
                                                    handleChange(
                                                        field.name,
                                                        e.target.value,
                                                        field.type,
                                                    )
                                                }
                                            />
                                            {formData[field.name] ? (
                                                <img
                                                    src={formData[field.name]}
                                                    alt="Preview"
                                                    className="standalone-image"
                                                    onError={(e) => {
                                                        e.currentTarget.style.opacity = 0.5; // optional fade effect
                                                    }}
                                                />
                                            ) : (
                                                <div className="image-preview-box">
                                                    <div className="image-placeholder">
                                                        No image
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : field.type === "color" ? (
                                        <>
                                            <input
                                                type="text"
                                                value={formData[field.name]}
                                                onChange={(e) =>
                                                    handleChange(
                                                        field.name,
                                                        e.target.value,
                                                        field.type,
                                                    )
                                                }
                                                placeholder="#000000"
                                            />
                                            <HexColorPicker
                                                color={formData[field.name]}
                                                onChange={(newColor) =>
                                                    handleChange(
                                                        field.name,
                                                        newColor,
                                                        field.type,
                                                    )
                                                }
                                            />
                                        </>
                                    ) : null}
                                </div>
                            ))}

                        <div className="modal-buttons">
                            <button
                                type="button"
                                onClick={onClose}
                                className="modal-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="modal-submit"
                                disabled={!formValid}
                            >
                                Save {title}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddItem;
