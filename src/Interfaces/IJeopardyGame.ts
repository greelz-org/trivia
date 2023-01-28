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
}
