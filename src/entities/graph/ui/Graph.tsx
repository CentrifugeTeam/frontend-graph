/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { fetchGraphData } from "../api/fetchGraph";
import { ProgressSpinner } from "primereact/progressspinner";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const GraphContainer = styled.div`
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
`;

const Graph = () => {
  const graphRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { t } = useTranslation();

  // Получаем selectedHostId из Redux
  const selectedHostId = useSelector(
    (state: any) => state.hosts.selectedHostId
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["graphData", selectedHostId], // Добавляем selectedHostId в ключ запроса для кэширования
    queryFn: () => fetchGraphData(selectedHostId || undefined), // Передаем selectedHostId в функцию fetchGraphData
  });

  useEffect(() => {
    if (data && graphRef.current) {
      const { clientWidth, clientHeight } = graphRef.current;
      setDimensions({ width: clientWidth, height: clientHeight });
    }
  }, [data, selectedHostId]); // Добавляем selectedHostId в зависимости

  useEffect(() => {
    const updateDimensions = () => {
      if (graphRef.current) {
        const { clientWidth, clientHeight } = graphRef.current;
        setDimensions({ width: clientWidth, height: clientHeight });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  if (isLoading) {
    return (
      <ProgressSpinner
        style={{
          width: "50px",
          height: "50px",
          justifySelf: "center",
          alignSelf: "center",
        }}
        strokeWidth="8"
        animationDuration=".5s"
      />
    );
  }

  if (error) {
    return (
      <div
        style={{
          justifySelf: "center",
          alignSelf: "center",
        }}
      >
        {t("content.error")}: {error.message}
      </div>
    );
  }

  // Функция для определения цвета линий на основе packets_number
  const getLinkColorByPackets = (packetsNumber: number): string => {
    if (packetsNumber === 0) {
      return "#808080"; // Серый
    } else if (packetsNumber > 0 && packetsNumber <= 100) {
      return "#00FF00"; // Зеленый
    } else if (packetsNumber > 100 && packetsNumber <= 1000) {
      return "#FFFF00"; // Желтый
    } else {
      return "#FF0000"; // Красный
    }
  };

  // Преобразование данных в формат для графа
  const graphData = {
    nodes: [
      ...(data?.nodes
        ?.filter((node) => !selectedHostId || node.id === selectedHostId) // Фильтруем узлы по selectedHostId
        ?.map((node) => ({
          id: `host-${node.id}`,
          name: node.hostname,
          type: "host",
          ip: node.ip,
        })) ?? []),
      ...(data?.nodes
        ?.filter((node) => !selectedHostId || node.id === selectedHostId) // Фильтруем узлы по selectedHostId
        ?.flatMap((node) =>
          node.networks.map((network) => ({
            id: `network-${network.id}`,
            name: network.name,
            type: "network",
            parentId: `host-${node.id}`,
          }))
        ) ?? []),
      ...(data?.nodes
        ?.filter((node) => !selectedHostId || node.id === selectedHostId) // Фильтруем узлы по selectedHostId
        ?.flatMap((node) =>
          node.networks.flatMap((network) =>
            network.containers.map((container) => ({
              id: `container-${container.id}`,
              name: container.name,
              type: "container",
              image: container.image,
              status: container.status,
              ip: container.ip,
              created_at: container.created_at,
              packets_number: container.packets_number, // Добавляем packets_number
              parentId: `network-${network.id}`,
            }))
          )
        ) ?? []),
    ],
    links: [
      ...(data?.links
        ?.filter(
          (link) =>
            !selectedHostId ||
            data.nodes.some(
              (node) => node.id === link.source_id || node.id === link.target_id
            )
        ) // Фильтруем связи по selectedHostId
        ?.map((link) => ({
          source: `host-${link.source_id}`,
          target: `host-${link.target_id}`,
          color: "#0000FF",
          width: 4,
        })) ?? []),
      ...(data?.nodes
        ?.filter((node) => !selectedHostId || node.id === selectedHostId) // Фильтруем узлы по selectedHostId
        ?.flatMap((node) =>
          node.networks.map((network) => ({
            source: `host-${node.id}`,
            target: `network-${network.id}`,
            color: "#00AA00",
            width: 4,
          }))
        ) ?? []),
      ...(data?.nodes
        ?.filter((node) => !selectedHostId || node.id === selectedHostId) // Фильтруем узлы по selectedHostId
        ?.flatMap((node) =>
          node.networks.flatMap((network) =>
            network.containers.map((container) => ({
              source: `network-${network.id}`,
              target: `container-${container.id}`,
              color: getLinkColorByPackets(container.packets_number), // Определяем цвет на основе packets_number
              width: 4,
            }))
          )
        ) ?? []),
    ],
  };

  const getNodeColor = (node: any) => {
    switch (node.type) {
      case "host":
        return "#000000";
      case "network":
        return "#00AA00";
      case "container":
        return "#72b8ff";
      default:
        return "#888888";
    }
  };

  return (
    <GraphContainer ref={graphRef}>
      <ForceGraph2D
        key={selectedHostId || "all"} // Меняем ключ при изменении selectedHostId
        graphData={graphData}
        nodeLabel="name"
        nodeAutoColorBy="type"
        width={dimensions.width}
        height={dimensions.height}
        linkWidth={(link: any) => link.width}
        linkColor={(link: any) => link.color} // Используем цвет из данных связи
        backgroundColor="#FFFFFF"
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          if (node.x === undefined || node.y === undefined) return;

          ctx.beginPath();
          ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
          ctx.fillStyle = getNodeColor(node);
          ctx.fill();

          if (globalScale >= 1.5) {
            const label = node.name;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillStyle = "#000000";
            ctx.fillText(label, node.x, node.y + 8);
          }
        }}
        nodePointerAreaPaint={(node: any, color, ctx) => {
          if (node.x === undefined || node.y === undefined) return;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
          ctx.fill();
        }}
      />
    </GraphContainer>
  );
};

export default Graph;
