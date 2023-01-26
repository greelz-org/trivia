import { DatabaseReference, DataSnapshot, set } from "firebase/database";
import BuzzComponent from "../Components/BuzzComponent";
import DivWithFilledText from "../Components/DivWithFilledTextComponent";
import InGamePlayersList from "../Components/InGamePlayersList";
import QuestionComponent from "../Components/QuestionComponent";
import { getList } from "./Lobby";

interface InGameProps {
  gameId: string;
  playerName: string;
  gameData: DataSnapshot | undefined;
  isHost?: boolean;
}

function buzzIn(ref: DatabaseReference) {
  if (ref) set(ref, Date.now());
}

export default function InGame(props: InGameProps) {
  const gameState = props.gameData?.child("/gameState");
  if (!gameState) return null; // Don't show anything if gameState is broken

  type gameStatusType =
    | "showQuestion"
    | "answering"
    | "showAnswer"
    | "nextQuestion";
  const gameStatus: gameStatusType = gameState.child("/gameStatus").val();
  const questionNumber = gameState.child("numQ").val();
  const question = gameState.child("question").val();
  const personAnswering = gameState.child("ansP").val();
  const answer = gameState.child("answer").val();
  const hasBuzzedNames = getList(gameState, "hasBuzzedIn");
  const canBuzz =
    gameState.child("buzzersEnabled").val() === "Y" &&
    !hasBuzzedNames.includes(props.playerName);
  const paText =
    personAnswering === props.playerName
      ? "Nice buzz! Answer the question out loud!"
      : `Listen up! ${personAnswering} is answering!`;

  const players = getList(props.gameData, "players");
  let buzzers: string[] = [];
  gameState.child("buzzers").forEach((ds) => {
    if (ds.key) {
      buzzers.push(ds.key);
    }
  });

  return (
    <>
      <InGamePlayersList players={players} buzzers={buzzers} />
      {gameStatus === "showQuestion" && (
        <>
          <div className="top">
            <QuestionComponent
              question={question}
              questionNumber={questionNumber}
            />
          </div>
          {/* "bottom" component in CSS */}
          <BuzzComponent
            canBuzzIn={canBuzz}
            buzzClickHandler={() =>
              buzzIn(gameState.child(`/buzzers/${props.playerName}`).ref)
            }
          />
        </>
      )}
      {gameStatus === "answering" && (
        <div className="center">
          <DivWithFilledText text={paText} maxHeight="30%" maxWidth="80%" />
        </div>
      )}
      {gameStatus === "showAnswer" && (
        <>
          <div className="questionAnswer">The answer is... {answer}</div>
        </>
      )}
      {gameStatus === "nextQuestion" && (
        <>
          <div className="nextQuestion">
            Everyone ready for the next question?
          </div>
        </>
      )}
    </>
  );
}
