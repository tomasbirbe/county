import { extendTheme } from "@chakra-ui/react";

import { cssReset } from "./cssCustomReset";

export const theme = extendTheme({
  colors: {
    spend: {
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
    secondary: {
      100: "#686868",
      200: "#595959",
      300: "#4A4A4A",
      400: "#3A3A3A",
      500: "#2C2C2C",
      600: "#282828",
      700: "#252525",
      800: "#222222",
      900: "#1F1F1F",
    },
    primary: {
      500: "#FFFFFF",
      600: "#EDEDED",
      700: "#DBDBDB",
      800: "#C8C8C8",
      900: "#B6B6B6",
    },
    fontPrimary: {
      default: "#2C2C2C",
    },
  },
  semanticTokens: {
    colors: {
      spend: {
        default: "#FF715F",
      },
      saving: {
        default: "#FFD262",
      },
      income: {
        default: "#7079D9",
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
          color: "fontPrimary",
          width: "fit-content",
          fontWeight: "400",
        },
        h1: {
          // 60px
          fontSize: "3.75rem",
          fontWeight: "700",
        },
        "h1/2": {
          // 48px
          fontSize: "3rem",
          fontWeight: "700",
        },
        h2: {
          // 40px
          fontSize: "2.5rem",
          fontWeight: "500",
        },
        h3: {
          // 35px
          fontSize: "2.1875rem",
          fontWeight: "700",
        },
        h4: {
          // 25px
          fontSize: "1.5625rem",
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
    Button: {
      variants: {
        primary: {
          bg: "secondary",
          color: "primary",
          fontWeight: "500",
        },
        secondary: {
          bg: "transparent",
          color: "secondary",
          fontWeight: "500",
          paddingInline: 2,
          _hover: { bg: "primary.600" },
        },
        add: {
          bg: "primary.600",
          paddingInlineEnd: "0.8rem",
          paddingInlineStart: "0.5rem",
          borderRadius: "8px",
          fontSize: "1rem",
          width: "fit-content",
          _hover: { boxShadow: {} },
          _focus: { boxShadow: {} },
          _active: { boxShadow: {} },
        },
        icon: {
          bg: "transparent",
          padding: "0",
          margin: "0",
          borderRadius: "50%",
          width: "35px",
          minWidth: "fit-content",
          height: "35px",
        },
      },
    },
  },
  styles: {
    global: {
      ...cssReset,
      body: {
        fontSize: "1.125rem",
        color: "fontPrimary",
        fontFamily: "Inter, Roboto, system-ui,sans-serif",
      },
      ul: {
        listStyle: "none",
      },
      "nav a": {
        display: "inline-flex",
        height: "full",
        alignItems: "center",
      },

      ".editButton": {
        visibility: "hidden",
      },
      ".deleteButton": {
        visibility: "hidden",
      },

      ".tableRow: hover": {
        bg: "red",
      },

      ".tableRow:hover > .editButton": {
        visibility: "visible",
      },
      ".tableRow:hover > .deleteButton": {
        visibility: "visible",
      },
    },
  },
});
