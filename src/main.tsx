import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./App";
import App2 from "./App2";
import "./index.css";

const editorTask = false;

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 0 } },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {editorTask ? <App2 /> : <App />}
    </QueryClientProvider>
  </React.StrictMode>
);
