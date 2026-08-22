import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AccentContext = createContext(null);

const ACCENT_COLORS = {
  emerald: {
    primary: "#10B981",
    hover: "#059669",
    light: "#34D399",
    soft: "rgba(16, 185, 129, 0.15)",
  },

  cyan: {
    primary: "#06B6D4",
    hover: "#0891B2",
    light: "#22D3EE",
    soft: "rgba(6, 182, 212, 0.15)",
  },

  purple: {
    primary: "#A855F7",
    hover: "#9333EA",
    light: "#C084FC",
    soft: "rgba(168, 85, 247, 0.15)",
  },

  blue: {
    primary: "#3B82F6",
    hover: "#2563EB",
    light: "#60A5FA",
    soft: "rgba(59, 130, 246, 0.15)",
  },
};

export function AccentProvider({ children }) {
  const [accent, setAccent] = useState(() => {
    return (
      localStorage.getItem("accentColor") ||
      "emerald"
    );
  });

  // ==========================================
  // APPLY ACCENT COLOR
  // ==========================================

  useEffect(() => {
    const selected =
      ACCENT_COLORS[accent] ||
      ACCENT_COLORS.emerald;

    // Main accent color
    document.documentElement.style.setProperty(
      "--accent-primary",
      selected.primary
    );

    // Hover color
    document.documentElement.style.setProperty(
      "--accent-hover",
      selected.hover
    );

    // Light accent
    document.documentElement.style.setProperty(
      "--accent-light",
      selected.light
    );

    // Soft transparent accent
    document.documentElement.style.setProperty(
      "--accent-soft",
      selected.soft
    );

    // ==========================================
    // BACKWARD COMPATIBILITY
    // ==========================================

    document.documentElement.style.setProperty(
      "--vf-accent",
      selected.primary
    );

    // ==========================================
    // STORE SELECTED ACCENT
    // ==========================================

    localStorage.setItem(
      "accentColor",
      accent
    );

    // ==========================================
    // STORE ACCENT AS HTML ATTRIBUTE
    // ==========================================

    document.documentElement.setAttribute(
      "data-accent",
      accent
    );
  }, [accent]);

  // ==========================================
  // CHANGE ACCENT
  // ==========================================

  const changeAccent = (newAccent) => {
    // Don't allow invalid colors
    if (!ACCENT_COLORS[newAccent]) {
      console.warn(
        `Unknown accent color: ${newAccent}`
      );

      return;
    }

    setAccent(newAccent);
  };

  // ==========================================
  // RESET ACCENT
  // ==========================================

  const resetAccent = () => {
    setAccent("emerald");
  };

  // ==========================================
  // CONTEXT
  // ==========================================

  return (
    <AccentContext.Provider
      value={{
        accent,

        setAccent: changeAccent,

        resetAccent,

        colors: ACCENT_COLORS,
      }}
    >
      {children}
    </AccentContext.Provider>
  );
}

// ==========================================
// CUSTOM HOOK
// ==========================================

export function useAccent() {
  const context =
    useContext(AccentContext);

  if (!context) {
    throw new Error(
      "useAccent must be used inside AccentProvider"
    );
  }

  return context;
}