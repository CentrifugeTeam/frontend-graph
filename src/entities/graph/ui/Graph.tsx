import { useState, useEffect, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { fetchGraphData } from "../api/fetchGraph";
import { ProgressSpinner } from "primereact/progressspinner";

const GraphContainer = styled.div`
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
`;

const Graph = () => {
  const graphRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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
    return <div>Error loading graph data: {error.message}</div>;
  }

  const graphData = {
    nodes:
      data?.nodes.map((node) => ({
        id: node.id,
        name: node.name,
        image: node.image,
        status: node.status,
        ip: node.ip,
        created_at: node.created_at,
      })) || [],
    links:
      data?.links.flatMap((link) =>
        link.target_ids.map((targetId) => ({
          source: link.source_id,
          target: targetId,
          color: "#0000FF",
          width: 2,
        }))
      ) || [],
  };

  return (
    <GraphContainer ref={graphRef}>
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="name"
        nodeAutoColorBy="id"
        width={dimensions.width}
        height={dimensions.height}
        linkWidth={(link) => link.width}
        linkColor={(link) => link.color}
        backgroundColor="#FFFFFF"
        nodeCanvasObject={(node, ctx, globalScale) => {
          if (node.x === undefined || node.y === undefined) return;

          // Всегда рисуем ноду
          ctx.beginPath();
          ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
          ctx.fillStyle = "#db0000";
          ctx.fill();

          // Рисуем текст только при достаточном масштабе
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
        nodePointerAreaPaint={(node, color, ctx) => {
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
