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

  const hostName = game?.child("gameState/host").val();
  const isHost = hostName === props.name;

  async function startGame() {
    // Set up the game information
    // Right now, everything under gameState
    const r = ref(database, `games/${props.gameId}/gameState`);
    const newGameState = {
      ansP: "",
      buzzers: [],
      gameStatus: "showQuestion",
      host: props.name,
      numQ: 1,
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
      <InGame
        gameId={props.gameId}
        gameData={game}
        playerName={props.name}
        isHost={isHost}
        hostName={hostName}
      />
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
