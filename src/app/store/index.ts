import { configureStore } from "@reduxjs/toolkit";
import hostsReducer from "@/entities/hosts/model/hostsSlice";

export const store = configureStore({
  reducer: {
    hosts: hostsReducer,
  },
});

// Типизация для состояния и диспетчера
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
