/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Tree } from "primereact/tree";
import { TreeNode } from "primereact/treenode";
import { ScrollPanel } from "primereact/scrollpanel";
import { fetchHosts } from "../api/fetchHosts";
import { setLoading, setSelectedHostId } from "../model/hostsSlice";

interface HostsProps {
  searchValue: string;
}

export const Hosts = ({ searchValue }: HostsProps) => {
  const dispatch = useDispatch();
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [loading, setLoadingLocal] = useState(true);

  useEffect(() => {
    const loadHosts = async () => {
      try {
        dispatch(setLoading(true));
        const hostsData = await fetchHosts();
        const formattedNodes = hostsData.map((host: any) => {
          const label = host.display_name || host.hostname; // display_name если есть, иначе hostname
          return {
            key: host.id,
            label,
            data: { ip: host.ip },
            selectable: true,
          };
        });
        setNodes(formattedNodes);
      } catch (error) {
        console.error("Error loading hosts:", error);
      } finally {
        setLoadingLocal(false);
        dispatch(setLoading(false));
      }
    };

    loadHosts();
  }, [dispatch]);

  if (loading) return <div />;

  const handleNodeSelect = (node: TreeNode) => {
    const hostId = node.key?.toString() || null;
    dispatch(setSelectedHostId(hostId));
  };

  const filteredNodes = nodes.filter((node) =>
    node.label?.toLowerCase().includes(searchValue.toLowerCase())
  );

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
      <ScrollPanel style={{ width: "100%", height: "100%", flex: 1 }}>
        <Tree
          value={filteredNodes}
          nodeTemplate={(node) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <i
                className="pi pi-angle-right"
                style={{ fontSize: "12px", color: "#999" }}
              />
              <span title={node.data?.ip}>{node.label}</span>
            </div>
          )}
          selectionMode="single"
          onSelect={(e) => handleNodeSelect(e.node as TreeNode)}
          style={{
            border: "none",
            fontSize: "12px",
            padding: "0",
            boxSizing: "border-box",
            width: "100%",
          }}
        />
      </ScrollPanel>
    </div>
  );
};
