import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider, QueryClient } from "react-query";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";

import { store } from "context/store";
import { backend } from "services/backend";
import { localStorageKeys } from "constants/localStorageKeys";

import { Router } from "Router";

import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import "prototypes";
import "index.css";

const queryClient = new QueryClient();

backend.defaults.headers.common["Authorization"] =
  "JWT " + localStorage.getItem(localStorageKeys.tokenUsuario);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <Provider store={store}> */}
        <ToastContainer />
        <Router />
      {/* </Provider> */}
    </QueryClientProvider>
  </React.StrictMode>
);
