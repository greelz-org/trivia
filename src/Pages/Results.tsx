import React from "react";
import DivWithFilledText from "../Components/DivWithFilledTextComponent";

export interface GameResult {
  player: string;
  points: number;
}
interface ResultsProps {
  results: GameResult[];
}

export default function Results(props: ResultsProps) {
  return (
    <div className="container">
      <div className="tableContainer">
        <table id="resultTable">
          <thead>
            <td>Place</td>
            <td>Points</td>
            <td>Player</td>
          </thead>
          {props.results
            .sort((a, b) => {
              if (a.points > b.points) return 1;
              else if (a.points < b.points) return -1;
              return 0;
            })
            .map((gameResult, idx) => {
              return (
                <tr className="result">
                  <td>{idx + 1}</td>
                  <td>{gameResult.points}</td>
                  <td>{gameResult.player}</td>
                </tr>
              );
            })}
        </table>
      </div>
    </div>
  );
}
