import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputAndButton from "./InputAndButton";

interface IJoinGameComponentProps {
  onClickGo: (name: string) => void;
  onClickBack: () => void;
}

export default function JoinGameComponent(props: IJoinGameComponentProps) {
  return (
    <div className="joinGameComponent">
      <FontAwesomeIcon icon={faArrowLeft} size="2x" onClick={() => props.onClickBack()} />
      <InputAndButton
        title="Join"
        onClick={(gameCode: string) => props.onClickGo(gameCode)}
      />
    </div>
  );
}
