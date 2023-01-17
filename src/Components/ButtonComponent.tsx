import React from "react";

interface ButtonProps {
  caption: string;
  containerClassName?: string;
  buttonClassName?: string;
  description?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}
export default function Button(props: ButtonProps) {
  return (
    <div className={props.containerClassName}>
      <button onClick={props.onClick} type="button" className={`${props.buttonClassName}`}>
        {props.caption}
      </button>
      {props.description ? <span>{props.description}</span> : null}
    </div>
  );
}
