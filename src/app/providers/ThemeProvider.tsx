import { FC, ReactNode } from "react";
import { useSelector } from "react-redux";
import { lightTheme, darkTheme } from "@/shared/config/theme/theme";
import { selectTheme } from "@/entities/theme/model/selectors";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const theme = useSelector(selectTheme);
  const selectedTheme = theme === "light" ? lightTheme : darkTheme;

  return (
    <StyledThemeProvider theme={selectedTheme}>{children}</StyledThemeProvider>
  );
};

export default ThemeProvider;
