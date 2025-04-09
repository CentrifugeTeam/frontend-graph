/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import ForceGraph2D from "react-force-graph-2d";
import styled from "styled-components";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchGraphData } from "../api/fetchGraph";
import { ProgressSpinner } from "primereact/progressspinner";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { patchResource } from "@/entities/hosts/api/patchHosts";
import { deleteContainer } from "../api/deleteContainers";

const GraphContainer = styled.div`
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
`;

// Мемоизированная версия ForceGraph2D
const MemoizedForceGraph = memo(ForceGraph2D);

interface NodeComment {
  nodeId: string;
  comment: string;
}

const Graph = () => {
  const graphRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { t } = useTranslation();
  const [comments, setComments] = useState<NodeComment[]>([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [commentDialogVisible, setCommentDialogVisible] = useState(false);
  const [currentComment, setCurrentComment] = useState("");
  const queryClient = useQueryClient();

  const isDead = useSelector((state: any) => state.hosts.is_dead);

  const selectedHostId = useSelector(
    (state: any) => state.hosts.selectedHostId
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["graphData", selectedHostId, isDead],
    queryFn: () => fetchGraphData(selectedHostId || undefined, isDead),
    refetchInterval: 60 * 1000,
  });

  useEffect(() => {
    if (data && graphRef.current) {
      const { clientWidth, clientHeight } = graphRef.current;
      setDimensions({ width: clientWidth, height: clientHeight });
    }
  }, [data, selectedHostId]);

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

  const getLinkColorByPackets = useCallback((packetsNumber: number): string => {
    if (packetsNumber === 0) return "#808080";
    if (packetsNumber <= 100) return "#00FF00";
    if (packetsNumber <= 1000) return "#ffae00";
    return "#FF0000";
  }, []);

  const graphData = useMemo(
    () => ({
      nodes: [
        ...(data?.nodes
          ?.filter((node) => !selectedHostId || node.id === selectedHostId)
          ?.map((node) => ({
            id: `host-${node.id}`,
            name: node.display_name || node.hostname,
            display_name: node.display_name,
            type: "host",
            ip: node.ip,
          })) ?? []),
        ...(data?.nodes
          ?.filter((node) => !selectedHostId || node.id === selectedHostId)
          ?.flatMap((node) =>
            node.networks.map((network) => ({
              id: `network-${network.id}`,
              name: network.display_name || network.name,
              display_name: network.display_name,
              type: "network",
              parentId: `host-${node.id}`,
            }))
          ) ?? []),
        ...(data?.nodes
          ?.filter((node) => !selectedHostId || node.id === selectedHostId)
          ?.flatMap((node) =>
            node.networks.flatMap((network) =>
              network.containers.map((container) => ({
                id: `container-${container.id}`,
                name: container.display_name || container.name,
                display_name: container.display_name,
                type: "container",
                image: container.image,
                status: container.status,
                ip: container.ip,
                created_at: container.created_at,
                packets_number: container.packets_number,
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
                (node) =>
                  node.id === link.source_id || node.id === link.target_id
              )
          )
          ?.map((link) => ({
            source: `host-${link.source_id}`,
            target: `host-${link.target_id}`,
            color: "#0000FF", // Цвет по умолчанию
            width: 4,
          })) ?? []),

        ...(data?.nodes
          ?.filter((node) => !selectedHostId || node.id === selectedHostId)
          ?.flatMap((node) =>
            node.networks.map((network) => ({
              source: `host-${node.id}`,
              target: `network-${network.id}`,
              color: getLinkColorByPackets(network.packets_number),
              width: 4,
            }))
          ) ?? []),

        ...(data?.nodes
          ?.filter((node) => !selectedHostId || node.id === selectedHostId)
          ?.flatMap((node) =>
            node.networks.flatMap((network) =>
              network.containers.map((container) => ({
                source: `network-${network.id}`,
                target: `container-${container.id}`,
                color: getLinkColorByPackets(container.packets_number),
                width: 4,
              }))
            )
          ) ?? []),
      ],
    }),
    [data, selectedHostId, getLinkColorByPackets]
  );

  const getNodeColor = useCallback((node: any) => {
    switch (node.type) {
      case "host":
        return "#000000";
      case "network":
        return "#4de74d";
      case "container":
        return "#72b8ff";
      default:
        return "#888888";
    }
  }, []);

  const getNodeTooltip = useCallback(
    (node: any) => {
      const commentObj = comments.find((c) => c.nodeId === node.id);
      let tooltip = `<div style="white-space: pre-line">${t("content.name")}: ${
        node.name
      }`;
      if (commentObj?.comment)
        tooltip += `\n${t("content.display_name")}: ${commentObj.comment}`;
      if (node.ip) tooltip += `\nIP: ${node.ip}`;
      if (node.status) tooltip += `\n${t("content.status")}: ${node.status}`;
      if (node.image) tooltip += `\n${t("content.image")}: ${node.image}`;
      tooltip += `</div>`;
      return tooltip;
    },
    [comments, t]
  );

  const handleNodeClick = useCallback(
    (node: any) => {
      setSelectedNode(node);
      const existingComment = comments.find((c) => c.nodeId === node.id);
      setCurrentComment(existingComment?.comment || "");
      setCommentDialogVisible(true);
    },
    [comments]
  );

  const handleSaveComment = useCallback(async () => {
    if (!selectedNode) return;

    try {
      let resourceType: "hosts" | "networks" | "containers";
      switch (selectedNode.type) {
        case "host":
          resourceType = "hosts";
          break;
        case "network":
          resourceType = "networks";
          break;
        case "container":
          resourceType = "containers";
          break;
        default:
          return;
      }

      const id = selectedNode.id.replace(/^(host|network|container)-/, "");
      const patchData = {
        display_name: currentComment.trim(),
      };

      await patchResource(resourceType, id, patchData);

      const updatedComments = comments.filter(
        (c) => c.nodeId !== selectedNode.id
      );
      if (currentComment.trim()) {
        updatedComments.push({
          nodeId: selectedNode.id,
          comment: currentComment,
        });
      }

      setComments(updatedComments);
      setCommentDialogVisible(false);

      // 👉 invalidate query to refetch updated data
      await queryClient.invalidateQueries({
        queryKey: ["graphData", selectedHostId],
      });
    } catch (error) {
      console.error("Failed to update node display name:", error);
    }
  }, [selectedNode, comments, currentComment, selectedHostId, queryClient]);

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

  return (
    <>
      <GraphContainer ref={graphRef}>
        <MemoizedForceGraph
          key={JSON.stringify(data)} // Используем данные как ключ для перерисовки
          graphData={graphData}
          nodeLabel={getNodeTooltip}
          nodeAutoColorBy="type"
          width={dimensions.width}
          height={dimensions.height}
          linkWidth={(link: any) => link.width}
          linkColor={(link: any) => link.color}
          backgroundColor="#FFFFFF"
          onNodeClick={handleNodeClick}
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            if (node.x === undefined || node.y === undefined) return;

            ctx.beginPath();
            ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
            ctx.fillStyle = getNodeColor(node);
            ctx.fill();

            if (globalScale >= 1.5) {
              const label = node.display_name || node.name;
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

      {/* Ваш компонент Dialog для комментариев */}
      <Dialog
        header={`${t("content.display_name")} ${selectedNode?.name || "ноды"}`}
        visible={commentDialogVisible}
        style={{ width: "50vw" }}
        onHide={() => setCommentDialogVisible(false)}
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            {selectedNode?.type === "container" && (
              <Button
                label="Удалить"
                severity="danger"
                onClick={async () => {
                  try {
                    const containerId = selectedNode.id.replace(
                      "container-",
                      ""
                    );
                    await deleteContainer(containerId);
                    setCommentDialogVisible(false);
                    await queryClient.invalidateQueries({
                      queryKey: ["graphData", selectedHostId],
                    });
                  } catch (error) {
                    console.error("Ошибка при удалении контейнера:", error);
                  }
                }}
              />
            )}
            <div>
              <Button onClick={() => setCommentDialogVisible(false)}>
                {t("content.cancel")}
              </Button>
              <Button onClick={handleSaveComment}>{t("content.save")}</Button>
            </div>
          </div>
        }
      >
        <InputText
          value={currentComment}
          onChange={(e) => setCurrentComment(e.target.value)}
          placeholder={t("content.enter_display_name")}
          style={{ width: "100%" }}
        />
      </Dialog>
    </>
  );
};

export default Graph;
