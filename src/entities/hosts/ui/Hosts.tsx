import { useState, useEffect } from "react";
import { Tree } from "primereact/tree";
import { TreeNode } from "primereact/treenode";
import { ScrollPanel } from "primereact/scrollpanel";
import { fetchHosts } from "../api/fetchHosts";

export const Hosts = () => {
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHosts = async () => {
      try {
        const hostsData = await fetchHosts();
        const formattedNodes = hostsData.map((host) => ({
          key: host.id,
          label: host.hostname,
          // Сохраняем IP в данных узла
          data: { ip: host.ip },
          children: host.networks.map((network) => ({
            key: `${host.id}-${network.id}`,
            label: network.name,
          })),
        }));
        setNodes(formattedNodes);
      } catch (error) {
        console.error("Error loading hosts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHosts();
  }, []);

  if (loading) {
    return <div>Loading hosts data...</div>;
  }

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
            // Отображаем IP из данных узла в title
            <span title={node.data?.ip}>{node.label}</span>
          )}
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
