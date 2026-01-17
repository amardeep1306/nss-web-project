import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Jaise hi Path (URL) badlega, ye window ko upar scroll kar dega
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}