import { useState } from "react";
import DivWithFilledText from "./DivWithFilledTextComponent";

interface BuzzComponentProps {
  canBuzzIn: boolean;
  buzzClickHandler: () => void;
}

export default function BuzzComponent(props: BuzzComponentProps) {
  const [timeoutLocks, setTimeoutLocks] = useState(0);
  const lockedOut = timeoutLocks > 0;
  const actuallyCanBuzz = props.canBuzzIn && !lockedOut;

  const clickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (props.canBuzzIn && !lockedOut) {
      // Submit buzz to the server
      props.buzzClickHandler();
    } else if (props.canBuzzIn && lockedOut) {
      console.log("You couldn't buzz in because you clicked too early...");
    } else if (!props.canBuzzIn) {
      setTimeoutLocks(timeoutLocks + 1);
      setTimeout(() => {
        setTimeoutLocks((currLockNumber) => currLockNumber - 1);
      }, 750);
    }
  };

  return (
    <div
      className={`buzzDiv`}
      onClick={(e) => clickHandler(e)}
    >
      <DivWithFilledText className={`${actuallyCanBuzz ? "buzzable" : "notBuzzable"} buzzContainer`} text="Buzz in!" />
    </div>
  );
}
