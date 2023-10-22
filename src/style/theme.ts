import { createTheme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";
import React from "react";

export function useAppTheme(currentMode: PaletteMode) {
  const [mode, setMode] = React.useState<PaletteMode>("light");
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === "light" ? "dark" : "light"
        );
      },
    }),
    []
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
          primary: {
            main: mode === "light" ? "#646cff" : "#9fa8da",
          },
          secondary: {
            main: mode === "light" ? "#535bf2" : "#7986cb",
          },
          text: {
            primary: mode === "dark" ? "#ccc" : "#000",
          },
        },
        components: {
          MuiTable: {
            styleOverrides: {
              root: {
                color: mode === "light" ? "#000" : "#ccc",
                backgroundColor: mode === "light" ? "#fff" : "#1E1E1E",
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                color: mode === "light" ? "#000" : "#ccc",
                backgroundColor: mode === "light" ? "#fff" : "#1E1E1E",
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                color: mode === "dark" ? "#ccc" : "#000",
              },
              notchedOutline: {
                borderColor: "#E0E0E0",
                "&:hover": {
                  borderColor: mode === "dark" ? "#ff0000" : "#E0E0E1",
                },
                "&.Mui-focused": {
                  borderColor: "#ff0000",
                },
              },
            },
          },
        },
      }),
    [mode]
  );

  return theme;
}
