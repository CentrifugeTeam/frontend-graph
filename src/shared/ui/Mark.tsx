import React from "react";

interface MarkProps {
  title: string;
  color: string;
}

export const Mark: React.FC<MarkProps> = ({ title, color }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      {/* Круглый div с цветом из пропсов */}
      <div
        style={{
          width: "13.33px",
          height: "13.33px",
          borderRadius: "50%",
          backgroundColor: color,
        }}
      />
      <span
        style={{ fontSize: "14px", fontWeight: "400", marginBottom: "2px" }}
      >
        {title}
      </span>
    </div>
  );
};
