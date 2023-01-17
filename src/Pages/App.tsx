import "../styles/css/App.css";
import { useState } from "react";
import HomePage, { IGameInfo } from "./HomePage";
import Game from "./Game";
import { push, ref, set } from "firebase/database";
import { database } from "../Hooks/FirebaseApp";


function App() {
  const [gameId, setGameId] = useState("YCOV");
  const [name, setName] = useState("testing");

  const addUserToGame = async (gameId: string) => {
    console.log("adding a user to a game...")
    return push(ref(database, `games/${gameId}/players`), name);
  };

  const onCreateNewGame = (gameInfo: IGameInfo) => {
    console.log("creating a new game...")
    setGameId(gameInfo.gameId);
    set(ref(database, `games/${gameInfo.gameId}`), {
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
        onJoinGame={async (gameId) => {
          setGameId(gameId);
          addUserToGame(gameId);
        }}
      />
    );
  }
}

export default App;
