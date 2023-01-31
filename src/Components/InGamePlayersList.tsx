import React from "react";
import PlayerCircleComponent from "./PlayerCircleComponent";

interface InGamePlayersListProps {
  points: Map<string, number> | undefined;
  players: string[];
  buzzers: string[];
}
export default function InGamePlayersList(props: InGamePlayersListProps) {
  const { points, players, buzzers } = props;
  return (
    <div className="inGamePlayersListDiv">
      {players.map((p) => {
        const didBuzz = buzzers.indexOf(p) !== -1;
        return (
          <PlayerCircleComponent
            key={p}
            name={p}
            buzzedIn={didBuzz}
            points={points?.get(p) ?? 0}
          />
        );
      })}
    </div>
  );
}
