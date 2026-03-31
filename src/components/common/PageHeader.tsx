import React from "react";
import "./pageHeader.css";
import Button from "../ui/Button/Button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  onClick?: () => void;
  textButton?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  actions, 
  onClick, 
  textButton = "Crear" 
}) => {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <span className="page-subtitle">{subtitle}</span>}
      </div>

      {actions && <div className="page-actions">{actions}</div>}

      {onClick && (
        <Button onClick={onClick}>
          {textButton}
        </Button>
      )}
    </div>
  );
};

export default PageHeader;