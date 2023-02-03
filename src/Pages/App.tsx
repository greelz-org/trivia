import "../styles/css/App.css";
import { useState } from "react";
import HomePage, { IGameInfo } from "./HomePage";
import Game from "./Game";
import { push, ref, set } from "firebase/database";
import { database } from "../Hooks/FirebaseApp";

function App() {
  const [gameId, setGameId] = useState("");
  const [name, setName] = useState("");

  const addUserToGame = async (gameId: string) => {
    console.log("Adding a user to a game...");
    return push(ref(database, `games/${gameId}/players`), name);
  };

  const onCreateNewGame = (gameInfo: IGameInfo) => {
    console.log("Creating a new game...");
    setGameId(gameInfo.gameId);
    const reference = ref(database, `games/${gameInfo.gameId}`);
    set(reference, {
      status: "lobby",
    });

    addUserToGame(gameInfo.gameId);
  };

  if (gameId !== "" && name !== "") {
    return <Game gameId={gameId} name={name} />;
  } else {
    return (
      <HomePage
        name={name}
        onSetName={(name) => setName(name)}
        onCreateNewGame={(gameInfo) => {
          onCreateNewGame(gameInfo);
        }}
        onJoinGame={async (gameId, exists) => {
          setGameId(gameId);
          if (!exists) addUserToGame(gameId);
        }}
      />
    );
  }
}

export default App;
