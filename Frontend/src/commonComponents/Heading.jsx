import React from "react";
import "./Heading.css";
import Button from "@mui/material/Button";
import SearchField from "./SearchField";

const Heading = ({ title, buttonArray, handleButtonAction, showSearch,searchTerm, setSearchTerm, onSearch }) => {
  return (
    <div className="heading-container">
      <h2 className="heading-title">{title}</h2>
      {showSearch && (
        <SearchField
          value={searchTerm}
          onChange={setSearchTerm}
          onDebouncedChange={onSearch}
          placeholder="Search..."
        />
      )}
      <div className="heading-actions">
        {buttonArray?.length > 0 &&
          buttonArray.map(({ name, key, icon }) => (
            <Button
              key={key}
              variant={name ? "contained" : "outlined"}
              size="medium"
              className={name ? "action-btn-primary" : "action-btn-icon"}
              onClick={() => handleButtonAction(key)}
              startIcon={icon}
            >
              {name}
            </Button>
          ))}
      </div>
    </div>
  );
};

export default Heading;
