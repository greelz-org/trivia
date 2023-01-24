import Button from "../Components/ButtonComponent";
import DivWithFilledText from "../Components/DivWithFilledTextComponent";
import { database } from "../Hooks/FirebaseApp";
import { ref, push, set } from "firebase/database";
import TitleTextAndGoComponent from "../Components/TitleTextAndGoComponent";

export interface IGameInfo {
  gameId: string;
  gameRefId: string;
}
interface HomePageProps {
  name: string;
  onSetName: (name: string) => void;
  onCreateNewGame: (i: IGameInfo) => void;
  onJoinGame: (gameId: string) => void;
}

export default function HomePage({
  name,
  onSetName,
  onCreateNewGame,
  onJoinGame,
}: HomePageProps) {
  const checkName = () => {
    if (name === "") {
      alert("Enter your name first, please.");
      return false;
    }
    return true;
  };

  const tryJoinGame = (gameId: string) => {
    if (!checkName()) return;
    gameId = gameId.toUpperCase();
    if (gameId !== "") {
      onJoinGame(gameId);
    }
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
        <div>A place where fun and smarts collide.</div>
      </div>
      <div className="actionsContainer">
        <div className="nameEntry">
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            id="name"
            onChange={(e) => onSetName(e.target.value)}
            value={name}
          ></input>
        </div>
        <div className="buttonsContainer">
          <Button
            buttonClassName="bigButton"
            containerClassName="buttonTextDiv"
            caption="New Game"
            onClick={() => tryCreateNewGame()}
          />
          <TitleTextAndGoComponent
            title="Join Game"
            onClick={(gameCode) => tryJoinGame(gameCode)}
          />
        </div>
      </div>
    </div>
  );
}
