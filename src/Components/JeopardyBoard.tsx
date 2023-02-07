import { ChangeEvent } from "react";
import IJeopardyGame, { IJeopardyQuestion } from "../Interfaces/Jeopardy";
import DivWithFilledText from "./DivWithFilledTextComponent";

interface IJeopardyBoardProps {
  game: IJeopardyGame | undefined;
  askedQuestions: string[] | undefined;
  playerViewMode?: boolean;
  showDailyDouble?: boolean;
  selectedQuestion?: IJeopardyQuestion;
  setSelectedQuestion?: (
    q?: IJeopardyQuestion,
    catIdx?: number,
    questionIdx?: number
  ) => void;
  onFileChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function JeopardyBoard(props: IJeopardyBoardProps) {
  // Get the stuff
  const game = props.game;

  if (!game) {
    return (
      <input
        accept="tsv"
        type="file"
        id="tsvFileInput"
        onChange={(e: ChangeEvent<HTMLInputElement>) => props.onFileChange!(e)}
      />
    );
  }
  const { board } = game;
  const { categories } = board;
  const {
    selectedQuestion,
    setSelectedQuestion,
    playerViewMode,
    askedQuestions,
    showDailyDouble,
  } = props;

  const showDailyDoubleTextOnly =
    selectedQuestion?.isDailyDouble && !showDailyDouble;

  return (
    <>
      {selectedQuestion && (
        <>
          {!playerViewMode && (
            <div
              className="goBack"
              onClick={
                setSelectedQuestion ? () => setSelectedQuestion() : () => null
              }
            >
              Show Board
            </div>
          )}
          <div className="jeopardyFullScreenQuestion">
            {showDailyDoubleTextOnly ? (
              <div>DAILY DOUBLE!!</div>
            ) : (
              <>
                <DivWithFilledText
                  text={selectedQuestion ? selectedQuestion.prompt : ""!}
                  maxHeight="70%"
                  maxWidth="70%"
                />
                {!playerViewMode && (
                  <div className="jeopardyAnswer">
                    {selectedQuestion?.answer}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
      {!selectedQuestion && (
        <div className="jeopardyBoard">
          <div className="board">
            {categories.map((c, cIdx) => {
              return (
                <div key={c.title} className="jeopardyCategory">
                  <div className="categoryTitle">{c.title}</div>
                  {c.questions.map((q, qIdx) => {
                    return askedQuestions?.includes(cIdx + "," + qIdx) ? (
                      <div className="jeopardyQuestion"></div>
                    ) : (
                      <div
                        onClick={
                          setSelectedQuestion
                            ? () => setSelectedQuestion(q, cIdx, qIdx)
                            : () => null
                        }
                        key={c.title + q.value}
                        className="jeopardyQuestion"
                      >
                        <div className="jeopardyQuestionValue">{q.value}</div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
