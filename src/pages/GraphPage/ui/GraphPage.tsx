/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bar } from "@/widgets/Bar";
import styled from "styled-components";
import Graph from "@/entities/graph/ui/Graph";
import { Button } from "primereact/button";
import { HeatMap } from "@/widgets/HeatMap";
import { Dropdown } from "primereact/dropdown";
import { useTranslation } from "react-i18next";
import { Checkbox } from "primereact/checkbox";
import { Menu } from "primereact/menu";
import { useRef } from "react";
import { MenuItem } from "primereact/menuitem";
import { Mark } from "@/shared/ui/Mark";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsDead,
  setSelectedHostId,
} from "@/entities/hosts/model/hostsSlice";
import { fetchPlantUML } from "@/entities/hosts/api/fetchPUML";
import { fetchJSON } from "@/entities/hosts/api/fetchJSON";
import { fetchPNG } from "@/entities/hosts/api/fetchPNG";

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
  display: flex;
  align-items: center;
`;

const Legend = styled.div`
  position: absolute;
  bottom: 25px;
  right: 25px;
  display: flex;
  gap: 20px;
  align-items: center;
  z-index: 100;
`;

export const GraphPage = () => {
  const { t } = useTranslation();
  const menuRef = useRef<Menu>(null);
  const dispatch = useDispatch();
  const isDead = useSelector((state: any) => state.hosts.is_dead);

  // Получаем selectedHostId из Redux
  const selectedHostId = useSelector(
    (state: any) => state.hosts.selectedHostId
  );

  const priorityOptions = [
    { name: t("content.load_h"), value: "high" },
    { name: t("content.load_l"), value: "low" },
  ];

  const exportOptions: MenuItem[] = [
    {
      label: "PNG",
      icon: "pi pi-image",
      command: () => handleExportPNG(),
    },
    {
      label: "JSON",
      icon: "pi pi-list",
      command: () => handleExportJSON(),
    },
    {
      label: "PlantUML",
      icon: "pi pi-receipt",
      command: () => handleExportPlantUML(),
    },
  ];

  // Обработчик для кнопки "Очистить"
  const handleClear = () => {
    dispatch(setSelectedHostId(null)); // Устанавливаем selectedHostId в null
  };

  const handleExportPlantUML = async () => {
    try {
      await fetchPlantUML(selectedHostId || undefined); // Если selectedHostId отсутствует, передаем undefined
    } catch (error) {
      console.error("Failed to export PlantUML:", error);
    }
  };
  const handleExportJSON = async () => {
    try {
      await fetchJSON(selectedHostId || undefined); // Если selectedHostId отсутствует, передаем undefined
    } catch (error) {
      console.error("Failed to export JSON:", error);
    }
  };

  const handleExportPNG = async () => {
    try {
      await fetchPNG(selectedHostId || undefined); // Если selectedHostId отсутствует, передаем undefined
    } catch (error) {
      console.error("Failed to export PNG:", error);
    }
  };

  return (
    <Container>
      <Bar />
      <Content>
        {/* Заголовок */}
        <Title>{t("content.title")}</Title>

        {/* Группа кнопок */}
        <ButtonGroup>
          <Checkbox
            inputId="deadCheckbox"
            name="is_dead"
            value="is_dead"
            checked={isDead === true}
            onChange={(e) => {
              const newValue = e.checked ? true : null;
              dispatch(setIsDead(newValue));
            }}
          />
          <label style={{ marginRight: "15px" }} htmlFor="ingredient1">
            {t("content.dead_notes")}
          </label>
          <Dropdown
            options={priorityOptions}
            optionLabel="name"
            showClear
            placeholder={t("content.load")}
          />
          {/* Кнопка "Очистить" */}
          <Button
            label={t("content.clear")}
            icon="pi pi-filter-slash"
            onClick={handleClear} // Добавляем обработчик
            style={{
              backgroundColor: "#fff",
              border: "1px solid #ced4da",
              color: "#6c757d",
              borderRadius: "5px",
              height: "40px",
            }}
          />

          {/* Кнопка с выпадающим меню экспорта */}
          <Menu model={exportOptions} popup ref={menuRef} />
          <Button
            label={t("content.export")}
            icon="pi pi-upload"
            onClick={(e) => menuRef.current?.toggle(e)}
            style={{
              backgroundColor: "#f27638",
              color: "#fff",
              borderRadius: "5px",
              height: "40px",
            }}
          />
        </ButtonGroup>

        {/* Легенда */}
        <Legend>
          <Mark title={t("content.host")} color="#000000" />
          <Mark title={t("content.network")} color="#00AA00" />
          <Mark title={t("content.container")} color="#72b8ff" />
        </Legend>

        {/* Тепловая карта и граф */}
        <HeatMap />
        <Graph />
      </Content>
    </Container>
  );
};
