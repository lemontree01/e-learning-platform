import React from "react";

interface InlineButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => any;
}

const InlineButton: React.FC<InlineButtonProps> = ({ children, onClick }) => {
  return (
    <div
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        }
      }}
      className="inline-btn"
    >
      {children}
    </div>
  );
};

export default InlineButton;
