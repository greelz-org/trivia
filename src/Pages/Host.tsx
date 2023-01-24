import { DatabaseReference, DataSnapshot, set } from "firebase/database";
import {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useMemo,
  useState,
} from "react";
import Button from "../Components/ButtonComponent";
import { getPlayers } from "./Lobby";

interface IHostProps {
  gameData: DataSnapshot | undefined;
  name: string;
  gameId: string;
}

interface IBuzzResults {
  name: string;
  buzzEpoch: number;
  rank?: number;
}

interface IBuzzProcessed {
  buzzResults: IBuzzResults[];
  fastestBuzz: number;
}

function calcBuzzerState(
  buzzData: DataSnapshot | undefined
): IBuzzProcessed | undefined {
  if (!buzzData) return;
  let fastestBuzz = Number.MAX_VALUE;
  let tempProcessing: IBuzzResults[] = [];
  //   let whoBuzzed = "";
  //   let earliestBuzz = Number.MAX_VALUE;
  buzzData.forEach((ds) => {
    if (!ds.key) return;
    const t = ds.val();
    if (t < fastestBuzz) fastestBuzz = t;
    tempProcessing.push({ name: ds.key, buzzEpoch: t });
  });

  tempProcessing.sort((a, b) => {
    if (a.buzzEpoch > b.buzzEpoch) return 1;
    if (a.buzzEpoch < b.buzzEpoch) return -1;
    return 0;
  });

  tempProcessing.forEach((x, i) => {
    x.rank = i + 1;
  });

  return { buzzResults: tempProcessing, fastestBuzz: fastestBuzz };
}

function formatTimeDiff(t1?: number, t2?: number): string {
  if (!t1 || !t2) return "";
  if (isNaN(t1) || isNaN(t2)) return "";
  if (t1 === t2) return "";

  return ((t1 - t2) / 1000).toFixed(2);
}

async function setAnswering(
  ref1?: DatabaseReference,
  ref2?: DatabaseReference,
  pers?: string
) {
  console.log(ref1);
  console.log(ref2);
  console.log(pers);
  if (!ref1 || !ref2 || !pers) return;
  await set(ref1, pers);
  set(ref2, "answering");
}

export default function Host(props: IHostProps) {
  const players = getPlayers(props.gameData);
  const gameState = props.gameData?.child("gameState");
  const buzzData = gameState?.child("buzzers");
  const buzzStateValues = useMemo(() => calcBuzzerState(buzzData), [buzzData]);
  const buzzersEnabled = gameState?.child("buzzersEnabled").val() === "Y";
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const changeGameState = useCallback(
    async (state: "showQuestion" | "showAnswer" | "answering") => {
      if (!gameState) return;

      let isValid = false;
      if (state === "showQuestion") {
        // Validate there's a question in the box to show
        isValid = question != null && question.length > 0;
        if (isValid) {
          // set the question status
          await set(gameState.child("buzzers").ref, "");
          await set(gameState.child("question").ref, question);
        }
      } else if (state === "showAnswer") {
        // Validate there's a question in the box to show
        isValid = answer != null && answer.length > 0;
        if (isValid) set(gameState.child("answer").ref, answer);
      }

      // Always change the core gameStatus
      if (isValid) {
        set(gameState.child("gameStatus").ref, state);
      }
    },
    [gameState, answer, question]
  );

  const toggleBuzzers = useCallback(
    (toOn: boolean) => {
      if (!gameState) return;
      set(gameState.child("buzzersEnabled").ref, toOn ? "Y" : "N");
    },
    [gameState]
  );

  return (
    <div className="hostContainer">
      <div className="_hostTop">Welcome to the Host Panel.</div>
      <div className="_hostBottom">
        <div className="playersGrid">
          {players.map((p) => {
            const processedBuzz = buzzStateValues?.buzzResults.find(
              (a) => a.name === p
            );
            return (
              <>
                <div
                  key={p + "row"}
                  className="_hostPlayerRow"
                  onClick={() =>
                    setAnswering(
                      gameState?.child("ansP").ref,
                      gameState?.child("gameStatus").ref,
                      p
                    )
                  }
                >
                  <div key={p}>{p}</div>
                  <div key={p + "buzz"}>{processedBuzz?.rank || ""}</div>
                  <div key={p + "buzzDiff"}>
                    {formatTimeDiff(
                      processedBuzz?.buzzEpoch,
                      buzzStateValues!.fastestBuzz
                    )}
                  </div>
                </div>
              </>
            );
          })}
        </div>
        <div className="controlGrid">
          <div className="_controlButtons">
            <Button
              caption="Show Question"
              onClick={() => changeGameState("showQuestion")}
            />
            <Button
              caption={`${buzzersEnabled ? "Disable" : "Enable"} Buzzers`}
              onClick={() => toggleBuzzers(!buzzersEnabled)}
            />
            <Button
              caption="Reveal Answer"
              onClick={() => changeGameState("showAnswer")}
            />
          </div>
          <div className="_questionDiv">
            <textarea
              className="_textarea"
              autoComplete="off"
              placeholder="question"
              value={question}
              onChange={(e: any) => setQuestion(e.target.value)}
            />
          </div>
          <div className="_answerDiv">
            <input
              type="text"
              className="_answerInput"
              placeholder="answer"
              value={answer}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setAnswer(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
