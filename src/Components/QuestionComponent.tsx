import DivWithFilledText from "./DivWithFilledTextComponent";

interface QuestionComponentProps {
  question: string;
  questionNumber: number;
}
export default function QuestionComponent(props: QuestionComponentProps) {
  return (
    <>
      <div className="number">- Question {props.questionNumber} -</div>
      <DivWithFilledText className="question" text={props.question} />
    </>
  );
}
