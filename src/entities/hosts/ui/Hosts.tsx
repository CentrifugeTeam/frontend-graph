/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Tree } from "primereact/tree";
import { TreeNode } from "primereact/treenode";
import { ScrollPanel } from "primereact/scrollpanel";
import { useQuery } from "@tanstack/react-query";
import { fetchHosts } from "../api/fetchHosts";
import { setSelectedHostId } from "../model/hostsSlice";

interface HostsProps {
  searchValue: string;
}

export const Hosts = ({ searchValue }: HostsProps) => {
  const dispatch = useDispatch();

  const {
    data: hostsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hosts"],
    queryFn: fetchHosts,
    refetchInterval: 10000,
  });

  const nodes: TreeNode[] = useMemo(() => {
    if (!hostsData) return [];

    return hostsData.map((host: any) => {
      const label = host.display_name || host.hostname;
      return {
        key: host.id,
        label,
        data: { ip: host.ip },
        selectable: true,
      };
    });
  }, [hostsData]);

  const filteredNodes = useMemo(() => {
    return nodes.filter((node) =>
      node.label?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [nodes, searchValue]);

  const handleNodeSelect = (node: TreeNode) => {
    const hostId = node.key?.toString() || null;
    dispatch(setSelectedHostId(hostId));
  };

  if (isLoading) return <div />;
  if (error) return <div>Ошибка загрузки хостов</div>;

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
