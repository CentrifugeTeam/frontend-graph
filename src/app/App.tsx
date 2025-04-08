import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store";
import { Router } from "./routers/router";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/saga-orange/theme.css";
import "primeicons/primeicons.css";

const queryClient = new QueryClient();

const App = () => {
  return (
    <PrimeReactProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router />
        </QueryClientProvider>
      </Provider>
    </PrimeReactProvider>
  );
};

export default App;
