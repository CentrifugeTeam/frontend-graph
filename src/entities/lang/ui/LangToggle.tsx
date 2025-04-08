import { Button } from "primereact/button";
import React from "react";
import { useTranslation } from "react-i18next";

const LangToggle: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "en" ? "ru" : "en";
    i18n.changeLanguage(newLanguage);
  };

  return (
    <Button
      onClick={toggleLanguage}
      style={{
        width: "30px",
        height: "28px",
        backgroundColor: "#000000",
        color: "#fff",
        borderRadius: "5px",
        border: 0,
        fontSize: "14px",
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Отображаем текущий язык */}
      {i18n.language === "en" ? "en" : "ru"}
    </Button>
  );
};

export default LangToggle;
