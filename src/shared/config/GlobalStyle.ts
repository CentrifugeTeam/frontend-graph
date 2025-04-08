import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

  html {
    background-color: ${(props) => props.theme.colors.background};
    transition: all 0.3s ease-in-out;
  }
`;

export default GlobalStyle;
