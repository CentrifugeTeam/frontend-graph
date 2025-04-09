// src/store/hostsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Определяем типы для состояния
export interface HostState {
  selectedHostId: string | null; // ID выбранного хоста
  loading: boolean; // Флаг загрузки
  is_dead: boolean | null; // Фильтр по is_dead
}

// Начальное состояние
const initialState: HostState = {
  selectedHostId: null,
  loading: false,
  is_dead: null, // по умолчанию не фильтруем
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
    setIsDead: (state, action: PayloadAction<boolean | null>) => {
      state.is_dead = action.payload;
    },
  },
});

// Экспортируем действия и редюсер
export const { setSelectedHostId, setLoading, setIsDead } = hostsSlice.actions;
export default hostsSlice.reducer;
