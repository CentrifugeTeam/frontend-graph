import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const Button = styled.button`
  position: fixed;
  right: 30px;
  bottom: 90px; /* Размещаем выше кнопки темы */
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background-color: #000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #ffffff;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.95);
    background-color: #ffffff;
    color: #000;
  }
`;

const LangToggle: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "en" ? "ru" : "en";
    i18n.changeLanguage(newLanguage);
  };

  return (
    <Button onClick={toggleLanguage}>
      {/* Отображаем текущий язык */}
      {i18n.language === "en" ? "EN" : "RU"}
    </Button>
  );
};

export default LangToggle;
