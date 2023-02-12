import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface IClickableButtonProps {
  onClick: () => void;
  text: string;
  scaleFactor?: number;
  color?: string;
  icon?: IconProp;
  className?: string;
}

type SizeProp =
  | "1x"
  | "2x"
  | "3x"
  | "4x"
  | "5x"
  | "6x"
  | "7x"
  | "8x"
  | "9x"
  | "10x";

function getSizeProp(val: number): SizeProp {
  switch (val) {
    case 1:
      return "1x";
    case 2:
      return "2x";
    case 3:
      return "3x";
    case 4:
      return "4x";
    case 5:
      return "5x";
    case 6:
      return "6x";
    case 7:
      return "7x";
    case 8:
      return "8x";
    case 9:
      return "9x";
    case 10:
      return "10x";
  }
  return "1x";
}

export default function ClickableButton(props: IClickableButtonProps) {
  const { text, color, scaleFactor, icon, onClick, className } = props;

  let scaleFactorVal: number = 1;

  if (scaleFactor && !isNaN(scaleFactor)) {
    scaleFactorVal = Math.min(10, Math.max(1, ~~scaleFactor));
  }

  return (
    <button
      type="button"
      className={`_clickableButton ${className ?? ""}`}
      onClick={() => onClick()}
    >
      {icon != null && (
        <FontAwesomeIcon
          className="_faIcon"
          icon={icon}
          color={color ?? "blue"}
          size={getSizeProp(scaleFactorVal)}
        />
      )}
      <span style={{ fontSize: `${scaleFactorVal}em` }}>{text}</span>
    </button>
  );
}
