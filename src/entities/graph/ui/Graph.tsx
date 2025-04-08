/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { fetchGraphData } from "../api/fetchGraph";
import { ProgressSpinner } from "primereact/progressspinner";
import { useTranslation } from "react-i18next";

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

  const { data, isLoading, error } = useQuery({
    queryKey: ["graphData"],
    queryFn: fetchGraphData,
  });

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

  // Преобразование данных в формат для графа
  const graphData = {
    nodes: [
      ...(data?.nodes?.map((node) => ({
        id: `host-${node.id}`,
        name: node.hostname,
        type: "host",
        ip: node.ip,
      })) ?? []),
      ...(data?.nodes?.flatMap((node) =>
        node.networks.map((network) => ({
          id: `network-${network.id}`,
          name: network.name,
          type: "network",
          parentId: `host-${node.id}`,
        }))
      ) ?? []),
      ...(data?.nodes?.flatMap((node) =>
        node.networks.flatMap((network) =>
          network.containers.map((container) => ({
            id: `container-${container.id}`,
            name: container.name,
            type: "container",
            image: container.image,
            status: container.status,
            ip: container.ip,
            created_at: container.created_at,
            parentId: `network-${network.id}`,
          }))
        )
      ) ?? []),
    ],
    links: [
      ...(data?.links?.map((link) => ({
        source: `host-${link.source_id}`,
        target: `host-${link.target_id}`,
        color: "#0000FF",
        width: 2,
      })) ?? []),
      ...(data?.nodes?.flatMap((node) =>
        node.networks.map((network) => ({
          source: `host-${node.id}`,
          target: `network-${network.id}`,
          color: "#00AA00",
          width: 1,
        }))
      ) ?? []),
      ...(data?.nodes?.flatMap((node) =>
        node.networks.flatMap((network) =>
          network.containers.map((container) => ({
            source: `network-${network.id}`,
            target: `container-${container.id}`,
            color: "#FF0000",
            width: 1,
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
        graphData={graphData}
        nodeLabel="name"
        nodeAutoColorBy="type"
        width={dimensions.width}
        height={dimensions.height}
        linkWidth={(link: any) => link.width}
        linkColor={(link: any) => link.color}
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
