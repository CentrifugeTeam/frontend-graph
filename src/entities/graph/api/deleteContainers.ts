/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/shared/api/baseApi";

export const deleteContainer = async (id: string | number): Promise<any> => {
  try {
    const url = `/containers/${id}`;
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete container with ID ${id}:`, error);
    throw error;
  }
};
