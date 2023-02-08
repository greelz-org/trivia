import React from "react";
import Button from "./ButtonComponent";

interface PlayerListComponentProps {
  players?: string[];
}
export default function PlayerListComponent(props: PlayerListComponentProps) {
  const players = props.players;
  const numPlayers = players?.length || 0;
  return (
    <div className="playersTable">
      {numPlayers > 0
        ? players!.map((name) => {
            return <div key={name} className="player">{name}</div>;
          })
        : null}
      {numPlayers < 10 ? (
        <div key={'invite'} className="player">
          <Button caption="Invite" />
        </div>
      ) : null}
      {numPlayers < 9
        ? Array(9 - numPlayers)
            .fill(null)
            .map((_, idx) => {
              return <div key={`b${idx}`} className="player"></div>;
            })
        : null}
    </div>
  );
}
