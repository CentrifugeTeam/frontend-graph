import { api } from "@/shared/api/baseApi";

export const fetchPlantUML = async (id?: string): Promise<void> => {
  try {
    const url = `/export/plantuml${id ? `?id=${encodeURIComponent(id)}` : ""}`;

    const response = await api.get(url, {
      responseType: "blob",
    });

    const contentDisposition = response.headers["content-disposition"];
    const fileName =
      contentDisposition?.split("filename=")[1]?.replace(/['"]/g, "") ||
      "graph.puml"; // Если имя файла не найдено, используем "graph.puml"

    // Создаем Blob из данных
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    // Создаем ссылку для скачивания файла
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", fileName); // Устанавливаем имя файла
    document.body.appendChild(link);
    link.click();

    // Очищаем созданные ресурсы
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Failed to fetch PlantUML file:", error);
    throw error;
  }
};
