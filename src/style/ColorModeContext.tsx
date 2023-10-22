import React from "react";
import { PaletteMode } from "@mui/material";

interface ColorModeContextProps {
  toggleColorMode: () => void;
  currentMode: PaletteMode;
}

export const ColorModeContext = React.createContext<
  ColorModeContextProps | undefined
>(undefined);
