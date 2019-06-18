import React, { useState, useEffect, useRef } from "react";

/**
 *
 * @param {Number} initialTab
 * @param {Array} allTabs
 */
export const useTabs = (initialTab, allTabs) => {
  if (!allTabs || !Array.isArray(allTabs)) return;

  const [currentIndex, setCurrentIndex] = useState(initialTab);
  return {
    currentItem: allTabs[currentIndex],
    changeItem: setCurrentIndex
  };
};

/**
 *
 * @param {Function} onClick
 */
export const useClick = onClick => {
  if (typeof onClick !== "function") return;

  const element = useRef();

  useEffect(() => {
    if (element.current) {
      element.current.addEventListener("click", onClick);
    }
    return () => {
      if (element.current) {
        element.current.removeEventListener("click", onClick);
      }
    };
  }, [onClick]);

  return element;
};

/**
 *
 * @param {Number} duration
 * @param {Number} delay
 */
export const useFadeIn = (duration = 1, delay = 0) => {
  if (typeof duration !== "number" || typeof delay !== "number") return;
  const element = useRef();
  useEffect(() => {
    if (element.current) {
      const { current } = element;
      current.style.transition = `opacity ${duration}s ease-in-out ${delay}s`;
      current.style.opacity = 1;
    }
  }, [delay, duration]);
  return { ref: element, style: { opacity: 0 } };
};

/**
 *
 * @param {Function} onHover
 */
export const useHover = onHover => {
  if (typeof onHover !== "function") return;

  const element = useRef();

  useEffect(() => {
    if (element.current) {
      element.current.addEventListener("mouseenter", onHover);
    }
    return () => {
      if (element.current) {
        element.current.removeEventListener("mouseenter", onHover);
      }
    };
  }, [onHover]);

  return element;
};

/**
 * popup on/off 용 hook
 */
export const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);

  const toggle = () => {
    setIsShowing(!isShowing);
  };

  return { isShowing, toggle };
};
