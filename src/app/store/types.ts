import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState, store } from "./index";

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
