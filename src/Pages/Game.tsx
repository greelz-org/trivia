import { ref, set } from "firebase/database";
import { useObject } from "react-firebase-hooks/database";
import MistakeComponent from "../Components/MistakeComponent";
import { database } from "../Hooks/FirebaseApp";
import Host from "./Host";
import InGame from "./InGame";
import Lobby from "./Lobby";
import Results from "./Results";

interface GameProps {
  gameId: string;
  name: string;
}

export default function Game(props: GameProps) {
  const [game, loading, error] = useObject(
    ref(database, `games/${props.gameId}`)
  );

  const isHost = game?.child("gameState/host").val() === props.name;

  async function startGame() {
    // Set up the game information
    // Right now, everything under gameState
    const r = ref(database, `games/${props.gameId}/gameState`);
    const questions = await getQuestions(10);
    const newGameState = {
      ansP: "",
      buzzers: [],
      gameStatus: "showQuestion",
      host: props.name,
      numQ: 1,
      questions: questions,
    };

    set(r, newGameState);
    set(ref(database, `games/${props.gameId}/status`), "ingame");
  }

  type gcS = "lobby" | "ingame" | "gameover" | undefined;
  const gameStatus: gcS = game?.child("status")?.val();
  const gameComponentStates = {
    lobby: (
      <Lobby
        onClickStartGame={startGame}
        gameId={props.gameId}
        gameData={game}
        name={props.name}
      />
    ),
    ingame: isHost ? (
      <Host gameId={props.gameId} gameData={game} name={props.name} />
    ) : (
      <InGame gameId={props.gameId} gameData={game} playerName={props.name} />
    ),
    gameover: <Results results={[]} />,
    mistake: <MistakeComponent />,
  };

  if (loading || error) {
    return <MistakeComponent />;
  } else {
    return gameComponentStates[gameStatus ? gameStatus : "mistake"];
  }
}
export interface IQuestion {
  category: string;
  type: string;
  difficulty: "easy";
}

async function getQuestions(numQuestions: number): Promise<IQuestion[] | null> {
  const token =
    "7b5de1f4ae137e3796c9afbc6a64d5a6d09e208184a5da7ab620ca613f4a308c";
  const questionFetch = await fetch(
    `https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple&token=${token}`
  );
  const data = await questionFetch.json();

  if (!data) return null;
  const status = data["response_code"];

  if (status === 0) return data["results"];
  else return null;
}
