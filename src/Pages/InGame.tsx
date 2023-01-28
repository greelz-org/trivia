import { DatabaseReference, DataSnapshot, set } from "firebase/database";
import BuzzComponent from "../Components/BuzzComponent";
import DivWithFilledText from "../Components/DivWithFilledTextComponent";
import InGamePlayersList from "../Components/InGamePlayersList";
import JeopardyBoard from "../Components/JeopardyBoard";
import QuestionComponent from "../Components/QuestionComponent";
import IJeopardyGame, {
  IJeopardyBoard,
  IJeopardyCategory,
  IJeopardyQuestion,
} from "../Interfaces/IJeopardyGame";
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

function getJeopardyGame(
  gameData: DataSnapshot | undefined
): IJeopardyGame | undefined {
  if (!gameData) return;
  let categories: IJeopardyCategory[] = [];

  // Todo: questionData - rename?
  // const questionData: IJeopardyBoard = new Map(
  //   Object.entries(gameData.child("questions").val())
  // );

  type x = {
    categoryTitle: string;
    questions: Map<string, IJeopardyQuestion>;
  };

  Object.values<x>(gameData.child("questions").val()).forEach((x: x) => {
    let newQuestions: IJeopardyQuestion[] = [];
    categories.push({
      title: x.categoryTitle,
      questions: newQuestions,
    });
    Object.values(x.questions).forEach((q: IJeopardyQuestion) => {
      newQuestions.push(q);
    });
  });

  return {
    title: "Matt's game",
    board: { categories: categories, isDoubleJeopardy: false },
  };
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

  // function getJeopardyGame(): IJeopardyGame {
  //   return {
  //     board: {
  //       categories: [
  //         getJeopardyCategory(
  //           "here's an answer",
  //           "Why is writing code so hard but so easy?",
  //           "Fun category"
  //         ),
  //         getJeopardyCategory(
  //           "chickens",
  //           "what's the worlds smallest animal?",
  //           "animals"
  //         ),
  //         getJeopardyCategory(
  //           "525600",
  //           "how many miles till i get to you?",
  //           "music"
  //         ),
  //         getJeopardyCategory(
  //           "another answer",
  //           "when you ask a question out loud, who doesn't hear it if they aren't listening?",
  //           "philosophy"
  //         ),
  //         getJeopardyCategory(
  //           "random longer answer here",
  //           "What kind of math works with the pythagorean theorem?",
  //           "SCIENCE"
  //         ),
  //       ],
  //       isDoubleJeopardy: false,
  //     },
  //     title: "Here's a title.",
  //   };
  // }

  return (
    <>
      <InGamePlayersList players={players} buzzers={buzzers} />
      {gameStatus === "showQuestion" && (
        <>
          <div className="top">
            <JeopardyBoard game={jGame} />
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
