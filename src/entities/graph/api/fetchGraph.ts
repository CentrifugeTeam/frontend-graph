import { api } from "@/shared/api/baseApi";

// Интерфейс для контейнера
export interface Container {
  name: string; // Имя контейнера
  image: string; // Образ контейнера
  container_id: string; // ID контейнера
  status: string; // Статус контейнера
  ip: string; // IP-адрес контейнера
  created_at: string; // Время создания контейнера
  last_active: string; // Время последней активности
  id: number; // Уникальный ID контейнера
}

// Интерфейс для сети
export interface Network {
  name: string; // Имя сети
  network_id: string; // ID сети
  id: number; // Уникальный ID сети
  containers: Container[]; // Массив контейнеров в сети
}

// Интерфейс для узла графа (Node)
export interface GraphNode {
  hostname: string; // Имя хоста
  ip: string; // IP-адрес хоста
  id: string; // Уникальный ID узла
  networks: Network[]; // Массив сетей
}

// Интерфейс для связи между узлами (Link)
export interface GraphLink {
  source_id: string; // ID исходного узла
  target_id: string; // ID целевого узла
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
