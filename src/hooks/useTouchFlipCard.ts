import { useEffect, useRef, useState } from "react";

const MOBILE_FLIP_HINT_DURATION_MS = 1800;

interface UseTouchFlipCardOptions {
  readonly revealOnVisible?: boolean;
}

export function useTouchFlipCard(options: Readonly<UseTouchFlipCardOptions> = {}) {
  const { revealOnVisible = false } = options;
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const hasShownHintRef = useRef(false);
  const hintTimeoutRef = useRef<number | null>(null);

  function startHint() {
    if (hasShownHintRef.current) {
      return;
    }

    hasShownHintRef.current = true;
    setShowHint(true);

    if (hintTimeoutRef.current !== null) {
      window.clearTimeout(hintTimeoutRef.current);
    }

    hintTimeoutRef.current = window.setTimeout(() => {
      setShowHint(false);
    }, MOBILE_FLIP_HINT_DURATION_MS);
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: none) and (pointer: coarse)");
    const nextIsTouchDevice = mediaQuery.matches;
    setIsTouchDevice(nextIsTouchDevice);

    if (!nextIsTouchDevice || revealOnVisible) {
      return;
    }

    startHint();
  }, [revealOnVisible]);

  useEffect(() => {
    if (!isTouchDevice || !revealOnVisible || !cardRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) {
          return;
        }

        startHint();
        observer.disconnect();
      },
      {
        threshold: 0.35,
      },
    );

    observer.observe(cardRef.current);

    return () => observer.disconnect();
  }, [isTouchDevice, revealOnVisible]);

  useEffect(() => {
    return () => {
      if (hintTimeoutRef.current !== null) {
        window.clearTimeout(hintTimeoutRef.current);
      }
    };
  }, []);

  function toggleFlip() {
    if (!isTouchDevice) {
      return;
    }

    setIsFlipped((previousState) => !previousState);
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLElement>) {
    if (!isTouchDevice) {
      return;
    }

    event.preventDefault();
    toggleFlip();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (!isTouchDevice) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleFlip();
    }
  }

  return {
    cardRef,
    isTouchDevice,
    isFlipped,
    showHint,
    toggleFlip,
    handleTouchEnd,
    handleKeyDown,
  };
}
