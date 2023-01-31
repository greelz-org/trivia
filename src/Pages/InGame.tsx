import { DatabaseReference, DataSnapshot, push, set } from "firebase/database";
import BuzzComponent from "../Components/BuzzComponent";
import DivWithFilledText from "../Components/DivWithFilledTextComponent";
import InGamePlayersList from "../Components/InGamePlayersList";
import JeopardyBoard from "../Components/JeopardyBoard";
import { getJeopardyGame, IJeopardyQuestion } from "../Interfaces/Jeopardy";
import { getList, getMap } from "./Lobby";

interface InGameProps {
  gameId: string;
  playerName: string;
  gameData: DataSnapshot | undefined;
  isHost: boolean;
  hostName: string;
}

function buzzIn(ref: DatabaseReference) {
  if (ref) set(ref, Date.now());
}

export default function InGame(props: InGameProps) {
  const gameState = props.gameData?.child("/gameState");
  if (!gameState) return null; // Don't show anything if gameState is broken
  const jGame = getJeopardyGame(props.gameData);

  type gameStatusType =
    | "showQuestion"
    | "answering"
    | "showAnswer"
    | "nextQuestion";
  const gameStatus: gameStatusType = gameState.child("/gameStatus").val();
  const personAnswering = gameState.child("ansP").val();
  const answer: string = gameState.child("answer").val();
  const question: IJeopardyQuestion | undefined = gameState
    .child("question")
    .val();
  const hasBuzzedNames = getList(gameState, "hasBuzzedIn");
  const canBuzz =
    gameState.child("buzzersEnabled").val() === "Y" &&
    !hasBuzzedNames.includes(props.playerName);
  const paText =
    personAnswering === props.playerName
      ? "Nice buzz! Answer the question out loud!"
      : `Listen up! ${personAnswering} is answering!`;

  const players = getList(props.gameData, "players");
  players.splice(players.indexOf(props.hostName), 1);
  const playersPoints = getMap(props.gameData, "points");
  const askedQuestions = getList(props.gameData, "gameState/askedQuestions");

  let buzzers: string[] = [];
  gameState.child("buzzers").forEach((ds) => {
    if (ds.key) {
      buzzers.push(ds.key);
    }
  });

  return (
    <>
      {gameStatus === "showQuestion" && (
        <>
          <div className="top">
            <JeopardyBoard
              askedQuestions={askedQuestions}
              game={jGame}
              selectedQuestion={question ? question : undefined}
              playerViewMode
            />
          </div>

          {/* "bottom" component in CSS */}
          <div className="inGameBottomDiv">
            <BuzzComponent
              canBuzzIn={canBuzz}
              buzzClickHandler={() =>
                buzzIn(gameState.child(`/buzzers/${props.playerName}`).ref)
              }
            />
            <InGamePlayersList
              players={players}
              buzzers={buzzers}
              points={playersPoints}
            />
          </div>
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
