import { DataSnapshot } from "firebase/database";

export default interface IJeopardyGame {
  title: string;
  board: IJeopardyBoard;
  author?: string;
}

export interface IJeopardyBoard {
  isDoubleJeopardy?: boolean;
  categories: IJeopardyCategory[];
}

export interface IJeopardyCategory {
  title: string;
  questions: IJeopardyQuestion[];
}

export interface IJeopardyQuestion {
  answer: string;
  prompt: string;
  value: number;
  isDailyDouble?: boolean;
  hide?: boolean;
}

function cleanString(str: string) {
  return str.replace(/""/g, '"').replace(/^"(.*)"$/g, '$1');
}

export function parseTsv(tsv: string): IJeopardyBoard {
  let board: IJeopardyBoard = {
    isDoubleJeopardy: false,
    categories: [],
  };

  tsv.split("\n").forEach((line, idx) => {
    if (idx !== 0 && line) {
      const [category, prompt, answer, value, isDailyDouble] = line.split("\t");
      if (prompt == null || answer == null || category == null) return; // ensure there's at least some data
      const [realCat, realPrompt, realAns] = [cleanString(category), cleanString(prompt), cleanString(answer)];
      const newQuestion: IJeopardyQuestion = {
        prompt: realPrompt,
        answer: realAns,
        value: Number.parseInt(value),
        isDailyDouble: isDailyDouble === "TRUE",
      };

      const idx = board.categories.find((cat) => cat.title === realCat);
      if (!idx) {
        board.categories.push({
          title: realCat,
          questions: [newQuestion],
        });
      } else {
        idx.questions.push(newQuestion);
      }
    }
  });

  return board;
}

export function setJeopardyBoard(
  gameData: DataSnapshot | undefined,
  board: IJeopardyBoard
) {}

export function getJeopardyGame(
  gameData: DataSnapshot | undefined
): IJeopardyGame | undefined {

  type Category = {
    questions: Map<string, IJeopardyQuestion>;
    title: string;
  };

  type Board = {
    categories: Map<string, Category>;
    isDoubleJeopardy: boolean;
  };

  type Game = {
    author: string,
    board: Board,
    title: string
  }

  if (!gameData) return;

  const gameVal: Game = gameData.child("jeopardyGame").val();
  if (!gameVal) return;

  const board: Board = gameVal.board;
  if (!board) return;

  const author = gameVal.author;
  const title = gameVal.title;

  let categories: IJeopardyCategory[] = [];
  Object.values(board.categories).forEach((c: Category) => {
    let newQuestions: IJeopardyQuestion[] = [];
    categories.push({
      title: c.title,
      questions: newQuestions,
    });

    Object.values(c.questions).forEach((q: IJeopardyQuestion) => {
      if (q.hide === true) console.log('it is true');
      newQuestions.push(q);
    });
    newQuestions.sort((a, b) => {
      if (a.value > b.value) return 1;
      if (a.value < b.value) return -1;
      return 0;
    })
  });

  console.log(categories);

  return {
    author: author,
    title: title,
    board: { categories: categories, isDoubleJeopardy: false },
  };
}
