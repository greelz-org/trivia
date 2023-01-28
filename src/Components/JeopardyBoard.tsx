import { useState } from "react";
import IJeopardyGame, { IJeopardyQuestion } from "../Interfaces/IJeopardyGame";
import DivWithFilledText from "./DivWithFilledTextComponent";

interface IJeopardyBoardProps {
  game: IJeopardyGame | undefined;
}

export default function JeopardyBoard(props: IJeopardyBoardProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<
    IJeopardyQuestion | undefined
  >();

  if (!props.game) return null;

  // Get the stuff
  const game = props.game;
  const { title, board, author } = game;
  const { isDoubleJeopardy, categories } = board;

  if (!game) return null;
  return (
    <>
      {selectedQuestion && (
        <div className="jeopardyFullScreenQuestion">
          <DivWithFilledText text={selectedQuestion.prompt} maxHeight="70%" maxWidth="70%" />
        </div>
      )}
      {!selectedQuestion && (
        <div className="jeopardyBoard">
          <div className="title">{`${title}, by ${author}`}</div>
          <div className="isDoubleJeopardy">{`It is ${
            isDoubleJeopardy ? "" : "not"
          } double jeopardy round.`}</div>
          <div className="board">
            {categories.map((c) => {
              return (
                <div key={c.title} className="jeopardyCategory">
                  <div className="categoryTitle">{c.title}</div>
                  {c.questions.map((q) => {
                    return (
                      <div
                        onClick={() => setSelectedQuestion(q)}
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
