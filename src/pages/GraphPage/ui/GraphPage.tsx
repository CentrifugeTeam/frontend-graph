import { Bar } from "@/widgets/Bar";
import styled from "styled-components";
import Graph from "@/entities/graph/ui/Graph";
import { Button } from "primereact/button";
import { HeatMap } from "@/widgets/HeatMap";
import { Dropdown } from "primereact/dropdown";

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  padding: 15px;
  gap: 15px;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  position: relative;
  border-radius: 20px;
  background-color: #ffffff;
  border: 1px solid #e6e6e7;
  overflow: hidden;
`;

const Title = styled.h1`
  margin: 25px 0 0 25px;
  z-index: 100;
  position: absolute;
  font-size: 20px;
  font-weight: 700;
`;

const ButtonGroup = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  gap: 10px;
  z-index: 100;
`;

export const GraphPage = () => {
  const priorityOptions = [
    { name: "High", value: "high" },
    { name: "Low", value: "low" },
  ];
  return (
    <Container>
      <Bar />
      <Content>
        <Title>Containers</Title>
        <ButtonGroup>
          <Dropdown
            options={priorityOptions}
            optionLabel="name"
            showClear
            placeholder="Workload"
          />
          <Button
            label="Clear"
            icon="pi pi-filter-slash"
            style={{
              backgroundColor: "#fff",
              border: "1px solid #E6E6E7",
              color: "#C5C5C5",
              borderRadius: "5px",
              height: "40px",
            }}
          />
          <Button
            label="Export"
            icon="pi pi-upload"
            style={{
              backgroundColor: "#f27638",
              color: "#fff",
              borderRadius: "5px",
              height: "40px",
            }}
          />
        </ButtonGroup>

        <HeatMap />
        <Graph />
      </Content>
    </Container>
  );
};
