import { CircularProgress } from "@mui/material";
import React from "react";
import "./App.css";
import UserAssignment from "./components/UserAssignment";
import { storageInit, storageKey } from "./queries/constants";
import { ThemeProvider } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";
import { ColorModeContext } from "./style/ColorModeContext";

import { useAppTheme } from "./style/theme";

// Custom theme hook
function useTheme() {
  const [currentMode, setCurrentMode] = React.useState<PaletteMode>("light");

  const toggleTheme = () => {
    setCurrentMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = useAppTheme(currentMode);

  return { theme, toggleTheme, currentMode };
}

// used to initialize mock storage
function useInitializeStorage() {
  const [init, setInit] = React.useState(true);

  React.useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(storageInit));
    const value = localStorage.getItem(storageKey);
    if (value) {
      setInit(false);
    }
  }, []);

  return init;
}

export default function App() {
  const init = useInitializeStorage();
  const { theme, toggleTheme, currentMode } = useTheme();

  if (init) {
    return <CircularProgress sx={{ m: "auto" }} />;
  }

  return (
    <ColorModeContext.Provider
      value={{ toggleColorMode: toggleTheme, currentMode }}
    >
      <ThemeProvider theme={theme}>
        <UserAssignment data-theme={currentMode} />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
