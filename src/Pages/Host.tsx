import { DatabaseReference, DataSnapshot, set } from "firebase/database";
import {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useMemo,
  useState,
} from "react";
import Button from "../Components/ButtonComponent";
import { getList } from "./Lobby";

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
  gameState: DataSnapshot | undefined,
  pers?: string
) {
  if (!gameState) return;
  if (pers == null) return;

  const ansPRef = gameState.child("ansP").ref;
  const gameStatusRef = gameState.child("gameStatus").ref;
  const hasBuzzedInRef = gameState.child(`hasBuzzedIn/${pers}`).ref;

  set(ansPRef, pers);
  set(gameStatusRef, "answering");
  set(hasBuzzedInRef, "");
}

export default function Host(props: IHostProps) {
  const players = getList(props.gameData, "players");
  const gameState = props.gameData?.child("gameState");
  const buzzData = gameState?.child("buzzers");
  const buzzStateValues = useMemo(() => calcBuzzerState(buzzData), [buzzData]);
  const buzzersEnabled = gameState?.child("buzzersEnabled").val() === "Y";
  const answerer = gameState?.child("ansP").val();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [pendingBuzzCheck, setPendingBuzzCheck] = useState(false);

  const shouldPickBuzzer =
    answerer == null &&
    buzzStateValues != null &&
    buzzStateValues.buzzResults.length > 0;

  if (shouldPickBuzzer && !pendingBuzzCheck) {
    setPendingBuzzCheck(true);
    setTimeout(() => {
      if (gameState) {
        setAnswering(gameState, buzzStateValues.buzzResults[0].name);
      }
      setPendingBuzzCheck(false);
    }, 500);
  }

  const toggleBuzzers = useCallback(
    (toOn: boolean) => {
      if (!gameState) return;
      set(gameState.child("buzzersEnabled").ref, toOn ? "Y" : "N");
    },
    [gameState]
  );

  const changeGameState = useCallback(
    async (state: "showQuestion" | "showAnswer" | "answering") => {
      if (!gameState) return;

      let isValid = false;
      if (state === "showQuestion") {
        // Validate there's a question in the box to show
        isValid = question != null && question.length > 0;
        if (isValid) {
          // set the question status
          toggleBuzzers(false);
          set(gameState.child("question").ref, question);
          set(gameState.child("buzzers").ref, null);
          set(gameState.child("hasBuzzedIn").ref, null);
          set(gameState.child("ansP").ref, null);
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
    [gameState, answer, question, toggleBuzzers]
  );

  const allowNewBuzzes = () => {
    if (!gameState) return;
    toggleBuzzers(false);
    set(gameState.child("question").ref, question);
    set(gameState.child("buzzersEnabled").ref, "Y");
    set(gameState.child("ansP").ref, null);
    set(gameState.child("gameStatus").ref, "showQuestion");
  };

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
                  onClick={() => setAnswering(gameState, p)}
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
            <Button
              caption="Let new answers"
              onClick={() => allowNewBuzzes()}
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
