import { DataSnapshot, set } from "firebase/database";
import BuzzComponent from "../Components/BuzzComponent";
import DivWithFilledText from "../Components/DivWithFilledTextComponent";
import InGamePlayersList from "../Components/InGamePlayersList";
import QuestionComponent from "../Components/QuestionComponent";
import { getPlayers } from "./Lobby";

interface InGameProps {
  gameId: string;
  playerName: string;
  gameData: DataSnapshot | undefined;
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
  const question = gameState
    .child(`questions/${questionNumber - 1}`)
    .child("question")
    .val();
  let buzzers: string[] = [];
  gameState.child("buzzers").forEach((ds) => {
    if (ds.key) {
      buzzers.push(ds.key);
    }
  });

  const personAnswering = gameState.child("ansP").val();
  const answer = gameState
    .child(`questions/${questionNumber - 1}`)
    .child("correct_answer")
    .val();
  const paText =
    personAnswering === props.playerName
      ? "Nice buzz! Answer the question out loud!"
      : `Listen up! ${personAnswering} is answering!`;
  const players = getPlayers(props.gameData);
  const isHost = gameState.child("/host").val() === props.playerName;

  if (isHost) {
    // Need to check who buzzed in first - wait 400ms after the first buzz and then check
    // for the earliest to account for latency
    if (gameState.child("buzzers").exists()) {
      setTimeout(() => {
        let whoBuzzed = "";
        let earliestBuzz = Number.MAX_VALUE;
        gameState.child("buzzers").forEach((ds) => {
          if (ds.val() < earliestBuzz) {
            whoBuzzed = ds.key!;
            earliestBuzz = ds.val();
          }
        });
        set(gameState.child("ansP").ref, whoBuzzed);
        set(gameState.child("gameStatus").ref, "answering");
      }, 1400);
    }
  }

  function buzzIn() {
    if (gameState)
      set(gameState.child(`/buzzers/${props.playerName}`).ref, Date.now());
  }

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
          <BuzzComponent canBuzzIn={true} buzzClickHandler={buzzIn} />
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
