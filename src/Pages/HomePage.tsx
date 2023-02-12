import Button from "../Components/ButtonComponent";
import DivWithFilledText from "../Components/DivWithFilledTextComponent";
import { database } from "../Hooks/FirebaseApp";
import { ref, push, set, get } from "firebase/database";
import JoinGameComponent from "../Components/JoinGameComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFootball,
  faLightbulb,
  faPersonWalkingLuggage,
} from "@fortawesome/free-solid-svg-icons";
import ClickableButton from "../Components/ClickableButton";
import { useState } from "react";

export interface IGameInfo {
  gameId: string;
  gameRefId: string;
}
interface HomePageProps {
  name: string;
  onSetName: (name: string) => void;
  onCreateNewGame: (i: IGameInfo) => void;
  onJoinGame: (gameId: string, exists?: boolean) => void;
}

export default function HomePage({
  name,
  onSetName,
  onCreateNewGame,
  onJoinGame,
}: HomePageProps) {
  const [isJoiningGame, setIsJoiningGame] = useState(false);

  const trySetIsJoiningGame = () => {
    if (!checkName()) return;
    setIsJoiningGame(true);
  };

  const checkName = () => {
    if (name === "") {
      alert("Enter your name first");
      return false;
    }
    return true;
  };

  const tryJoinGame = (gameId: string) => {
    if (!checkName()) return;
    // Here we want to check to make sure that the user isn't in the game first
    // Ideally this is a query that looks for the players name, but for now
    // Just get the list of players in a game and see if <name> is in there.
    gameId = gameId.toUpperCase();
    const playersRef = ref(database, `games/${gameId}/players/`);

    get(playersRef).then((snapshot) => {
      let nameExists: boolean = false;
      const players: Object = snapshot.val();

      Object.entries(players).every(([, playerName]) => {
        if (playerName === name) {
          nameExists = true;
          console.log(`${name} is already in the game`);
          return false;
        }
        return true;
      });
      if (!nameExists) {
        if (gameId !== "") {
          onJoinGame(gameId);
        }
      } else {
        onJoinGame(gameId, true);
        // alert(`Someone named ${name} is already in the game, try entering with a different name.`);
      }
    });
  };

  const tryCreateNewGame = async () => {
    if (!checkName()) return;
    const generateStr = (len: number) => {
      const alpha: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let ret = "";
      for (let i = 0; i < len; ++i) {
        ret += alpha.charAt(Math.floor(Math.random() * 26));
      }
      return ret;
    };

    const newGameCode = generateStr(4);
    // Todo: validate that this string doesn't yet exist in games/gameIds
    const pushGamesRef = await push(ref(database, "games/gameIds"));
    await set(pushGamesRef, { gameId: newGameCode });
    onCreateNewGame({ gameRefId: pushGamesRef.key!, gameId: newGameCode });
  };

  return (
    <div className="container">
      <div className="topTextContainer">
        <DivWithFilledText maxHeight="50%" text="Trivia!" />
        <p>A place where fun and smarts collide!</p>
      </div>
      <div className="actionsContainer">
        <div className="nameEntry">
          <label htmlFor="name">Name: </label>
          <input
            autoComplete="off"
            spellCheck={false}
            type="text"
            id="name"
            onChange={(e) => onSetName(e.target.value)}
            value={name}
            className="fancyInput"
          ></input>
        </div>
        <div className="buttonsContainer">
          {isJoiningGame ? (
            <JoinGameComponent
              onClickBack={() => setIsJoiningGame(false)}
              onClickGo={(code) => tryJoinGame(code)}
            />
          ) : (
            <>
              <ClickableButton
                icon={faPersonWalkingLuggage}
                text="Join a game"
                onClick={() => trySetIsJoiningGame()}
                scaleFactor={3}
              />
              <ClickableButton
                icon={faLightbulb}
                scaleFactor={3}
                text="Create a game"
                onClick={() => tryCreateNewGame()}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
