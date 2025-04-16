import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../slices/auth";

export default function useSingleTabGuard() {
  const dispatch = useDispatch();

  useEffect(() => {
    const thisTabId = `${Date.now()}-${Math.random()}`;

    // Add this tab to the active tab list
    const registerTab = () => {
      const currentTabs = JSON.parse(
        localStorage.getItem("activeTabs") || "[]"
      );
      currentTabs.push(thisTabId);
      localStorage.setItem("activeTabs", JSON.stringify(currentTabs));
    };

    const unregisterTab = () => {
      const currentTabs = JSON.parse(
        localStorage.getItem("activeTabs") || "[]"
      );
      const updatedTabs = currentTabs.filter((id) => id !== thisTabId);
      localStorage.setItem("activeTabs", JSON.stringify(updatedTabs));
    };

    const handleStorage = () => {
      const currentTabs = JSON.parse(
        localStorage.getItem("activeTabs") || "[]"
      );
      // If there's more than one tab open, log out
      if (currentTabs.length > 1) {
        dispatch(logout());
      }
    };

    // Register this tab
    registerTab();

    // Listen to tab changes
    window.addEventListener("storage", handleStorage);

    // Cleanup on tab close
    window.addEventListener("beforeunload", unregisterTab);

    // Check immediately on mount
    handleStorage();

    return () => {
      unregisterTab();
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("beforeunload", unregisterTab);
    };
  }, []);
}
