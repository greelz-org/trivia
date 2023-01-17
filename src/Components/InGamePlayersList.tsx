import React from "react";
import PlayerCircleComponent from "./PlayerCircleComponent";

interface InGamePlayersListProps {
  players: string[];
  buzzers: string[];
}
export default function InGamePlayersList(props: InGamePlayersListProps) {
  return (
    <div className="inGamePlayersListDiv">
      {props.players.map((p) => {
        const didBuzz = props.buzzers.indexOf(p) !== -1;
        return <PlayerCircleComponent key={p} name={p} buzzedIn={didBuzz} />
      })}
    </div>
  );
}
