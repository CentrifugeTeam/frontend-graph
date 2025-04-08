/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { useEffect, useState } from "react";

// Функция для подключения к WebSocket и получения данных
export const useGraphWebSocket = (url: string) => {
  const [data, setData] = useState<any[]>([]); // Состояние для хранения данных (используем any)
  const [error, setError] = useState<string | null>(null); // Состояние для ошибок
  const [isLoading, setIsLoading] = useState<boolean>(true); // Состояние загрузки

  useEffect(() => {
    const socket = new WebSocket(url); // Создаем WebSocket-соединение

    // Обработчик события открытия соединения
    socket.addEventListener("open", () => {
      console.log("WebSocket connection established");
      setIsLoading(false);
    });

    // Обработчик входящих сообщений
    socket.addEventListener("message", (event) => {
      try {
        const parsedData = JSON.parse(event.data); // Парсим данные как JSON
        setData((prevData) => [...prevData, parsedData]); // Добавляем новые данные
      } catch (parseError) {
        console.error("Failed to parse WebSocket message:", parseError);
        setError("Failed to parse incoming data");
      }
    });

    // Обработчик ошибок
    socket.addEventListener("error", (event) => {
      console.error("WebSocket error:", event);
      setError("WebSocket connection error");
    });

    // Обработчик закрытия соединения
    socket.addEventListener("close", () => {
      console.log("WebSocket connection closed");
      setIsLoading(false);
    });

    // Очистка ресурсов при размонтировании компонента
    return () => {
      socket.close();
    };
  }, [url]);

  return { data, error, isLoading };
};
