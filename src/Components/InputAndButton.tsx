import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

interface IInputAndButtonProps {
  title: string;
  onClick: (gameCode: string) => void;
}
export default function TitleTextAndGoComponent(props: IInputAndButtonProps) {
  const [text, setText] = useState("");
  const bounceButton = text.length === 4;
  return (
    <div className="titleTextAndGoDiv">
      <label htmlFor="codeInput">Enter your game code:</label>
      <div className="inputAndButtonDiv">
        <input
          id="codeInput"
          spellCheck={false}
          type="text"
          className="fancyInput"
          value={text}
          onChange={(e) => setText(e.target.value?.toUpperCase())}
        />
        <FontAwesomeIcon
          onClick={() => props.onClick(text)}
          icon={faArrowRight}
          size="2x"
          bounce={bounceButton}
          className="faArrowIcon"
        />
      </div>
    </div>
  );
}
