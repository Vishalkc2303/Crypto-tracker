import { useState } from "react";
import { UserProvider } from "./context/userContext";
import {AuthProvider} from "./components/Auth/AuthProvider";
import AppRoutes from "./router/Routes";

import "./App.css";

function App() {
  return (
    <UserProvider>
      <AuthProvider>
      <AppRoutes />
      </AuthProvider>
      {/* <AppContent /> */}
    </UserProvider>
  );
}

export default App;
