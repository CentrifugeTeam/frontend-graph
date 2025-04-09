import { api } from "@/shared/api/baseApi";

// Интерфейс для контейнера
export interface Container {
  name: string;
  image: string;
  container_id: string;
  display_name: string;
  status: string;
  packets_number: number;
  ip: string;
  created_at: string; // ISO format
  last_active: string; // ISO format
  id: string;
}

// Интерфейс для сети
export interface Network {
  name: string;
  network_id: string;
  display_name: string;
  packets_number: number;
  id: string;
  containers: Container[];
}

// Интерфейс для узла графа (Node)
export interface GraphNode {
  hostname: string;
  ip: string;
  display_name: string;
  id: string;
  networks: Network[];
}

// Интерфейс для связи между узлами (Link)
export interface GraphLink {
  source_id: string;
  target_id: string;
}

// Интерфейс для связи между сетями
export interface NetworkToNetwork {
  source_id: string;
  target_id: string;
}

// Интерфейс для всего ответа API
export interface ApiResponse {
  nodes: GraphNode[];
  links: GraphLink[];
  network_to_network: NetworkToNetwork[];
}

export const fetchGraphData = async (
  host_id?: string,
  is_dead?: boolean | null
): Promise<ApiResponse> => {
  try {
    const params = new URLSearchParams();

    if (host_id) {
      params.append("host_id", host_id);
    }

    if (typeof is_dead === "boolean") {
      params.append("is_dead", String(is_dead));
    }

    const url = `/graph${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await api.get<ApiResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch graph data:", error);
    throw error;
  }
};
