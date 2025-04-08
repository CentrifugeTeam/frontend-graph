// src/store/hostsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Определяем типы для состояния
export interface HostState {
  selectedHostId: string | null; // ID выбранного хоста
  loading: boolean; // Флаг загрузки
}

// Начальное состояние
const initialState: HostState = {
  selectedHostId: null,
  loading: false,
};

// Создаем слайс
const hostsSlice = createSlice({
  name: "hosts",
  initialState,
  reducers: {
    setSelectedHostId: (state, action: PayloadAction<string | null>) => {
      state.selectedHostId = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

// Экспортируем действия и редюсер
export const { setSelectedHostId, setLoading } = hostsSlice.actions;
export default hostsSlice.reducer;
