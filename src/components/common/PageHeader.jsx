import React from "react";
import "./pageHeader.css";
import Button from "../ui/Button/Button";

const PageHeader = ({ title, subtitle, actions, onClick, textButton = "Crear"}) => {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <span className="page-subtitle">{subtitle}</span>}
      </div>

      {actions && <div className="page-actions">{actions}</div>}

      {onClick && <Button children={textButton} onClick={onClick}/>}

    </div>
  );
};

export default PageHeader;