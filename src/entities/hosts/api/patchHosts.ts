/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/shared/api/baseApi";

export const patchResource = async (
  resourceType: "hosts" | "networks" | "containers",
  id: string | number,
  data: any
): Promise<any> => {
  try {
    // Формируем URL с учетом типа ресурса и его ID
    const url = `/${resourceType}/${id}`;
    const response = await api.patch(url, data);
    return response.data;
  } catch (error) {
    console.error(`Failed to update ${resourceType} with ID ${id}:`, error);
    throw error;
  }
};
