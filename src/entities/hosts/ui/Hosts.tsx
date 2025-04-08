/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Tree } from "primereact/tree";
import { TreeNode } from "primereact/treenode";
import { ScrollPanel } from "primereact/scrollpanel";
import { fetchHosts } from "../api/fetchHosts";
import { setLoading, setSelectedHostId } from "../model/hostsSlice";

export const Hosts = () => {
  const dispatch = useDispatch();
  const [nodes, setNodes] = useState<TreeNode[]>([]); // Локальное состояние для узлов
  const [loading, setLoadingLocal] = useState(true); // Локальный флаг загрузки

  useEffect(() => {
    const loadHosts = async () => {
      try {
        dispatch(setLoading(true)); // Устанавливаем флаг загрузки в Redux
        const hostsData = await fetchHosts();
        const formattedNodes = hostsData.map((host: any) => ({
          key: host.id,
          label: host.hostname,
          data: { ip: host.ip },
          selectable: true, // Разрешаем выбор только для хостов
        }));
        setNodes(formattedNodes); // Сохраняем узлы локально
      } catch (error) {
        console.error("Error loading hosts:", error);
      } finally {
        setLoadingLocal(false);
        dispatch(setLoading(false)); // Снимаем флаг загрузки в Redux
      }
    };

    loadHosts();
  }, [dispatch]);

  if (loading) {
    return <div></div>;
  }

  // Обработчик выбора узла
  const handleNodeSelect = (node: TreeNode) => {
    // Сохраняем только ID хоста
    const hostId = node.key?.toString() || null;
    dispatch(setSelectedHostId(hostId));
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        overflow: "hidden",
        marginTop: "20px",
      }}
    >
      <ScrollPanel
        style={{
          width: "100%",
          height: "100%",
          flex: 1,
        }}
      >
        <Tree
          value={nodes}
          nodeTemplate={(node) => (
            <span title={node.data?.ip}>{node.label}</span>
          )}
          selectionMode="single" // Разрешаем выбор одного элемента
          onSelect={(e) => handleNodeSelect(e.node as TreeNode)} // Обработчик выбора
          style={{
            border: "none",
            fontSize: "10px",
            padding: "0",
            boxSizing: "border-box",
            width: "100%",
          }}
        />
      </ScrollPanel>
    </div>
  );
};
