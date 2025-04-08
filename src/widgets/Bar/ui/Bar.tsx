import { useState } from "react";
import Logo from "@/shared/assets/Logo";
import { Button } from "primereact/button";
import styled from "styled-components";
import { Hosts } from "@/entities/hosts/ui/Hosts";

const Container = styled.div<{ $collapsed: boolean }>`
  z-index: 1000;
  display: flex;
  flex-direction: column;
  width: ${({ $collapsed }) => ($collapsed ? "80px" : "18vw")};
  min-width: ${({ $collapsed }) => ($collapsed ? "70px" : "18vw")};
  max-width: ${({ $collapsed }) => ($collapsed ? "80px" : "18vw")};
  border-radius: 20px;
  background-color: #ffffff;
  border: 1px solid #e6e6e7;
  align-items: flex-start;
  box-sizing: border-box;
  padding: 25px;
  transition: all 0.2s ease;
  overflow: hidden;
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  min-width: 100%;
  gap: 10px;
`;

const ButtonContainer = styled.div<{ $collapsed: boolean }>`
  margin-top: 30px;
  display: flex;
  flex-direction: ${({ $collapsed }) => ($collapsed ? "column" : "row")};
  gap: 12px;
  width: 100%;
  align-items: flex-start;
  flex-wrap: nowrap;
`;

const StyledButton = styled(Button)<{ $isSelected?: boolean }>`
  min-width: 30px;
  width: 30px;
  height: 28px;
  background-color: ${({ $isSelected }) => ($isSelected ? "#f27638" : "#fff")};
  color: ${({ $isSelected }) => ($isSelected ? "#fff" : "#E6E6E7")};
  border: ${({ $isSelected }) =>
    $isSelected ? "none" : "1.5px solid #E6E6E7"};
  border-radius: 5px;
  flex-shrink: 0;
  & .p-button-icon {
    font-size: 14px;
  }
`;

export const Bar = () => {
  const [selectedButton, setSelectedButton] = useState<string | null>("bars");
  const [collapsed, setCollapsed] = useState(false);

  const handleButtonClick = (buttonName: string) => {
    setSelectedButton(buttonName);
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Container $collapsed={collapsed}>
      <LogoWrapper>
        {!collapsed && <Logo />}
        <Button
          icon="pi pi-bars"
          onClick={toggleCollapse}
          style={{
            width: "30px",
            height: "28px",
            backgroundColor: "#f27638",
            color: "#fff",
            borderRadius: "5px",
            border: 0,
            fontSize: "14px",
            flexShrink: 0,
          }}
        />
      </LogoWrapper>
      <ButtonContainer $collapsed={collapsed}>
        {(!collapsed || selectedButton === "bars") && (
          <StyledButton
            icon="pi pi-th-large"
            $isSelected={selectedButton === "bars"}
            onClick={() => handleButtonClick("bars")}
          />
        )}
        {(!collapsed || selectedButton === "folder") && (
          <StyledButton
            icon="pi pi-folder"
            $isSelected={selectedButton === "folder"}
            onClick={() => handleButtonClick("folder")}
          />
        )}
        {(!collapsed || selectedButton === "search") && (
          <StyledButton
            icon="pi pi-search"
            $isSelected={selectedButton === "search"}
            onClick={() => handleButtonClick("search")}
          />
        )}
      </ButtonContainer>
      <Hosts />
    </Container>
  );
};
