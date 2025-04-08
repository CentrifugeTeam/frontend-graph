import { api } from "@/shared/api/baseApi";

// Интерфейс для сетевых интерфейсов хоста
export interface HostNetwork {
  name: string; // Название сети
  network_id: string; // ID сети
  id: number; // Уникальный ID интерфейса
}

// Интерфейс для хоста
export interface Host {
  hostname: string; // Имя хоста
  ip: string; // IP-адрес хоста
  id: string; // Уникальный ID хоста
  networks: HostNetwork[]; // Массив сетевых интерфейсов
}

// Тип для ответа API
export type HostsResponse = Host[];

export const fetchHosts = async (): Promise<HostsResponse> => {
  try {
    const url = "/hosts";
    const response = await api.get<HostsResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch hosts data:", error);
    throw error;
  }
};
