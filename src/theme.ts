import { extendTheme } from "@chakra-ui/react";

import { cssReset } from "./cssCustomReset";

export const theme = extendTheme({
  semanticTokens: {
    colors: {
      spend: {
        default: "#FF715F",
        100: "#FF9B8E",
        200: "#FF9183",
        300: "#FF8777",
        400: "#FF7D6C",
        500: "#FF715F",
        600: "#FF5D48",
        700: "#FF472F",
        800: "#FF3115",
        900: "#FB1D00",
      },
      saving: {
        default: "#FFD262",
        100: "#FFDF8E",
        200: "#FFDC83",
        300: "#FFD977",
        400: "#FFD56C",
        500: "#FFD262",
        600: "#FFCB48",
        700: "#FFC42F",
        800: "#FFBD15",
        900: "#FBB400",
      },
      income: {
        default: "#7079D9",
        100: "#9AA0E4",
        200: "#9097E2",
        300: "#868EDF",
        400: "#7C84DC",
        500: "#7079D9",
        600: "#5F69D5",
        700: "#4D57D0",
        800: "#3A46CB",
        900: "#323DBB",
      },
      primary: {
        default: "#FFFFFF",
      },
      secondary: {
        default: "#2C2C2C",
      },
      fontPrimary: {
        default: "#2C2C2C",
      },
    },
  },
  components: {
    Text: {
      variants: {
        base: {
          color: "font",
          fontSize: "1.5rem",
          width: "fit-content",
        },
        h1: {
          fontSize: "5rem",
          fontWeight: "700",
        },
        h2: {
          fontSize: "3.75rem",
          fontWeight: "700",
        },
        h3: {
          fontSize: "3.125rem",
          fontWeight: "700",
        },
        h4: {
          fontSize: "2,1875rem",
          fontWeight: "500",
        },
      },
      defaultProps: {
        variant: "base",
      },
    },
    Input: {
      variants: {
        base: {
          field: {
            background: "transparent",
            borderBlockEnd: "1px solid",
            borderColor: "secondary",
            borderRadius: "0",
            padding: "0",
            height: "fit-content",
            width: "full",
          },
        },
      },
      defaultProps: {
        variant: "base",
      },
    },
  },
  styles: {
    global: {
      ...cssReset,
      body: {
        fontSize: "1.5rem",
        color: "fontPrimary",
        fontFamily: "Inter, Roboto, system-ui,sans-serif",
      },
      ul: {
        listStyle: "none",
      },
    },
  },
});
