import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../model/themeSlice";
import { selectTheme } from "../model/selectors";
import styled from "styled-components";

const Button = styled.button`
  position: fixed;
  right: 30px;
  bottom: 30px;
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
  font-size: 20px;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.95);
    background-color: #ffffff;
  }
`;

const ThemeToggle: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  return (
    <Button onClick={() => dispatch(toggleTheme())}>
      {theme === "light" ? "🌙" : "☀️"}
    </Button>
  );
};

export default ThemeToggle;
