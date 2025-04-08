import { api } from "@/shared/api/baseApi";

// Интерфейс для узла графа (Node)
export interface GraphNode {
  name: string; // Имя контейнера
  image: string; // Образ контейнера
  container_id: string; // ID контейнера
  status: string; // Статус контейнера
  ip: string; // IP-адрес контейнера
  created_at: string; // Время создания контейнера
  id: string; // Уникальный ID узла
}

// Интерфейс для связи между узлами (Link)
export interface GraphLink {
  source_id: number; // ID исходного узла
  target_ids: number[]; // Массив ID целевых узлов
}

// Интерфейс для всего ответа API
export interface ApiResponse {
  nodes: GraphNode[]; // Массив узлов
  links: GraphLink[]; // Массив связей
}

export const fetchGraphData = async (): Promise<ApiResponse> => {
  try {
    const url = `/graph`;
    const response = await api.get<ApiResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch graph data:", error);
    throw error;
  }
};
