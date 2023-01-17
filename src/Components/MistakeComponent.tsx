import Button from "./ButtonComponent";

interface MistakeComponentProps {
  text?: string;
}

export default function MistakeComponent(props: MistakeComponentProps) {
  return (
    <div className="container">
      <p></p>
      {props.text ? <p>{props.text}</p> : <p>Did you get here by mistake?</p>}
      <p></p>
      <Button caption="Go home" onClick={() => alert("going back?")} />
    </div>
  );
}
