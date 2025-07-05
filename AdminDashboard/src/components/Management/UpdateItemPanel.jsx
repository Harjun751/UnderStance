import "./UpdateItemPanel.css";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";

const UpdateItemPanel = ({
    item,
    onClose,
    onSubmit,
    onDelete,
    schema,
    isExpanded,
}) => {
    const [formData, setFormData] = useState({});

    // Initialize formData when item is provided
    useEffect(() => {
        if (item && schema) {
            const normalized = {};
            schema.forEach((field) => {
                if (field.noupdate === true) {
                    return;
                }
                if (field.type === "boolean") {
                    normalized[field.name] = item[field.name];
                } else if (field.type === "dropdown") {
                    // convert from object (e.g. name) to id
                    const matching = field.dropdownData.data.find(
                        (entry) =>
                            entry[field.dropdownData.key] ===
                                item[field.name] || // already ID
                            entry[field.dropdownData.value] ===
                                item[field.name], // name → ID
                    );
                    // Store both dropdown ID and value
                    normalized[`${field.name}ID`] = matching
                        ? matching[field.dropdownData.key]
                        : "";
                    normalized[field.name] = matching
                        ? matching[field.dropdownData.value]
                        : "";
                } else {
                    normalized[field.name] = item[field.name];
                }
            });
            setFormData(normalized);
        }
    }, [item, schema]);

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
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

    // Disable Update button if no values updated
    const hasChanges = schema
        .filter((field) => field.type !== "id" && field.noupdate !== true)
        .some((field) => {
            const current = formData[field.name];
            const original = item[field.name];

            if (field.type === "boolean") {
                return Boolean(current) !== Boolean(original);
            } else if (field.type === "dropdown") {
                // Convert items stored as value name to id before comparing
                const dropdownList = field.dropdownData?.data || [];
                const getIdFromItem = (value) => {
                    const entry = dropdownList.find(
                        (d) =>
                            d[field.dropdownData.key] === value ||
                            d[field.dropdownData.value] === value,
                    );
                    return entry?.[field.dropdownData.key] ?? "";
                };

                return String(current) !== String(getIdFromItem(original));
            } else {
                return current !== original;
            }
        });

    //Disable Update button if an empty field is present
    const allFieldsFilled = schema
        .filter((field) => field.type !== "id" && field.noupdate !== true)
        .every((field) => {
            const value = formData[field.name];
            return value !== "" && value !== null && value !== undefined;
        });

    const formValid = hasChanges && allFieldsFilled;

    if (!item) return null;

    return (
        <div className={`side-panel-content ${isExpanded ? "expanded" : ""}`}>
            {/* <button type="button" className="close-btn" onClick={onClose}>
                <FaTimes />
            </button>
            <button
                type="button"
                className="expand-btn"
                onClick={() => setIsExpanded((prev) => !prev)}
                title={isExpanded ? "Collapse Panel" : "Expand Panel"}
            >
                {isExpanded ? <FaAnglesRight /> : <FaAnglesLeft />}
            </button> */}
            <div className="panel-scrollable">
                <h3>Quick View/Edit</h3>
                <h4>Select & Edit whichever parts you need</h4>
                <form onSubmit={handleSubmit} className="panel-form">
                    {schema
                        .filter((x) => x.noupdate !== true)
                        .map((field) => {
                            const value = formData[field.name];
                            if (field.type === "id") {
                                return (
                                    <div
                                        key={field.name}
                                        className="form-group"
                                    >
                                        <label htmlFor={field.name}>
                                            {field.name}
                                        </label>
                                        <input
                                            type="text"
                                            id={field.name}
                                            value={value}
                                            readOnly={true}
                                            disabled={true}
                                        />
                                    </div>
                                );
                            }

                            return (
                                <div key={field.name} className="form-group">
                                    <label htmlFor={field.name}>
                                        {field.name}
                                    </label>

                                    {field.type === "boolean" ? (
                                        <select
                                            id={field.name}
                                            value={value}
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
                                            id={field.name}
                                            value={value}
                                            onChange={(e) =>
                                                handleChange(
                                                    field.name,
                                                    e.target.value,
                                                    field.type,
                                                )
                                            }
                                            maxLength={field.maxLen || 255}
                                            rows={2}
                                        />
                                    ) : field.type === "dropdown" ? (
                                        <select
                                            id={field.name}
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
                                                id={field.name}
                                                value={value || ""}
                                                placeholder="Enter image URL"
                                                onChange={(e) =>
                                                    handleChange(
                                                        field.name,
                                                        e.target.value,
                                                        field.type,
                                                    )
                                                }
                                            />
                                            {value ? (
                                                <img
                                                    src={value}
                                                    alt="Preview"
                                                    className="standalone-image"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src =
                                                            "https://via.placeholder.com/150?text=Invalid+Image";
                                                    }}
                                                />
                                            ) : (
                                                <div className="image-preview-box">
                                                    <span className="image-placeholder">
                                                        No image
                                                    </span>
                                                </div>
                                            )}
                                        </>
                                    ) : field.type === "color" ? (
                                        <>
                                            <input
                                                type="text"
                                                value={value}
                                                className="color-hex-code"
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
                                                color={value || "#000000"}
                                                onChange={(color) =>
                                                    handleChange(
                                                        field.name,
                                                        color,
                                                        field.type,
                                                    )
                                                }
                                            />
                                        </>
                                    ) : null}
                                </div>
                            );
                        })}
                    <div className="panel-buttons">
                        <button
                            type="submit"
                            className="panel-submit"
                            disabled={!formValid}
                        >
                            Update Entry
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="panel-delete"
                        >
                            Delete Entry
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="panel-cancel"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateItemPanel;
