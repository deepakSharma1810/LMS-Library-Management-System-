import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const ScrollOnTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const main = document.querySelector("main");

    if (main) {
      main.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [pathname]);

  return null;
};

export default ScrollOnTop;
