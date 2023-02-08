import React, { ChangeEvent, useState } from "react";
import { IBuzzResults } from "../Pages/Host";

interface IPlayerRowHostModeProps {
  name: string;
  score: number | undefined;
  isAnswering: boolean;
  onClickRow: () => void;
  onChangeScore: (newScore: number) => void;
  onClickPoints: () => void;
  onClickStopPoints: () => void;
  processedBuzz: IBuzzResults | undefined;
  timeDifference: string | undefined;
  changingScore: boolean;
}

export default function PlayerRowHostMode(props: IPlayerRowHostModeProps) {
  const {
    name,
    score,
    isAnswering,
    onClickRow,
    onChangeScore,
    onClickPoints,
    onClickStopPoints,
    processedBuzz,
    timeDifference,
    changingScore,
  } = props;

  return (
    <>
      <div
        key={name + "row"}
        className={`_hostPlayerRow ${isAnswering ? "_highlightPlayer" : ""}`}
      >
        <div key={name} onClick={() => onClickRow()}>
          {name}
        </div>
        {changingScore ? (
          <>
            <input
              className="scoreChangeInput"
              key={name + "pts"}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (!isNaN(+e.target.value)) {
                  const n = Number(e.target.value);
                  onChangeScore(n);
                }
              }}
              placeholder={score?.toString()}
            ></input>
            <div onClick={() => onClickStopPoints()}>Save</div>
          </>
        ) : (
          <div key={name + "pts"} onClick={() => onClickPoints()}>
            {score ?? 0}
          </div>
        )}
        <div key={name + "buzz"}>{processedBuzz?.rank || ""}</div>
        <div key={name + "buzzDiff"}>{timeDifference}</div>
      </div>
    </>
  );
}
