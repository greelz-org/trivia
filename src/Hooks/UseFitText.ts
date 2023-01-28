import { useState, useEffect, useRef, Ref } from "react";

export function useFitText(text: string): [string, Ref<any>] {
  const MIN_FONT_SIZE = 20;
  const MAX_FONT_SIZE = 300;
  const RESOLUTION = 5;

  const ref = useRef<any>(null);
  const [fontSize, setFontSize] = useState(MAX_FONT_SIZE);
  const [fontSizePrevious, setFontSizePrevious] = useState(MIN_FONT_SIZE);
  const [fontSizeMax, setFontSizeMax] = useState(MAX_FONT_SIZE);
  const [fontSizeMin, setFontSizeMin] = useState(MIN_FONT_SIZE);

  function handleWindowResize(e: any) {
    return setTimeout(() => {
      setFontSize(MAX_FONT_SIZE);
      setFontSizePrevious(MIN_FONT_SIZE);
      setFontSizeMax(MAX_FONT_SIZE);
      setFontSizeMin(MIN_FONT_SIZE);
    }, 30);
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return function () {
      window.removeEventListener("resize", handleWindowResize);
    };
  });

  useEffect(() => {
    handleWindowResize(null);
  }, [text]);

  useEffect(() => {
    const isDone = Math.abs(fontSize - fontSizePrevious) <= RESOLUTION;
    const isOverflow =
      !!ref.current &&
      (ref.current.clientHeight < ref.current.scrollHeight ||
        ref.current.clientWidth < ref.current.scrollWidth);

    // We're done if isDone and no longer overflowing
    if (isDone) {
      if (isOverflow) {
        // There seems to be a bug in browsers where overflow shows the scrollbar, and since the scrollbar is there,
        // it doesn't allow you to fit the "max" font because the scrollbar was already there.
        // e.g., font-size=80, no scrollbar
        // e.g., add 5 to font, font-size=85, scrollbar
        // e.g., jump back down to 80, now there's still a scrollbar
        // so, we'll adjust the resolution distance down if we overflow so that we ensure no overflow & still have resolution
        const finalVal = fontSize - RESOLUTION;
        setFontSizeMin(finalVal);
        setFontSize(finalVal);
        setFontSizeMax(finalVal);
        setFontSizePrevious(finalVal);
      }
      return;
    }

    let newMax = fontSizeMax,
      newMin = fontSizeMin;
    if (isOverflow) {
      // If we're still too big, then immediately reset FSM and use that in next calc
      newMax = Math.min(fontSizeMax, fontSize);
    } else {
      newMin = Math.max(fontSizeMin, fontSize);
    }

    let delta = (newMax - newMin) / 2;
    let newFontSize = fontSize + (isOverflow ? -delta : delta);
    setFontSize(newFontSize);
    setFontSizeMax(newMax);
    setFontSizeMin(newMin);
    setFontSizePrevious(fontSize);
  }, [fontSize, fontSizeMax, fontSizeMin, fontSizePrevious, ref]);

  return [`${fontSize}px`, ref];
}
