import { api } from "@/shared/api/baseApi";

// Интерфейс для контейнера
export interface Container {
  name: string; // Имя контейнера
  image: string; // Образ контейнера
  container_id: string; // ID контейнера
  status: string; // Статус контейнера
  packets_number: number; // Количество пакетов, обработанных контейнером
  ip: string; // IP-адрес контейнера
  created_at: string; // Время создания контейнера (ISO формат)
  last_active: string; // Время последней активности (ISO формат)
  id: number; // Уникальный ID контейнера
  display_name: string;
}

// Интерфейс для сети
export interface Network {
  name: string; // Имя сети
  network_id: string; // ID сети
  display_name: string;
  id: number; // Уникальный ID сети
  containers: Container[]; // Массив контейнеров в сети
  packets_number: number; // Количество пакетов, обработанных контейнером
}

// Интерфейс для узла графа (Node)
export interface GraphNode {
  hostname: string; // Имя хоста
  display_name: string;
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

export const fetchGraphData = async (
  host_id?: string
): Promise<ApiResponse> => {
  try {
    // Формируем URL с учетом query-параметра host_id
    const url = `/graph${
      host_id ? `?host_id=${encodeURIComponent(host_id)}` : ""
    }`;
    const response = await api.get<ApiResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch graph data:", error);
    throw error;
  }
};
