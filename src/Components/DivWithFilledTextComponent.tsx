import React from "react";
import { useFitText } from "../Hooks/UseFitText";

interface FitContainerTextProps {
  text: string;
  maxHeight?: string;
  maxWidth?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
  className?: string | undefined;
}

export default function DivWithFilledText(props: FitContainerTextProps) {
  const [fs, ref] = useFitText(props.text);
  return (
    <div
      className={props.className}
      ref={ref}
      style={{
        fontSize: fs,
        overflow: "auto",
        maxHeight: props.maxHeight,
        maxWidth: props.maxWidth,
      }}
      onClick={props.onClick}
    >
      {props.text}
    </div>
  );
}
