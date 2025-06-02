import { Board } from "./components/board";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <h1 className="text-2xl text-center font-bold mt-1">Choose your phone number</h1>
      <ul className="flex flex-col items-center">
        <li className="text-sm">
          Draw out the digits of your phone number on the grid below and press the Predict button to submit the number.
        </li>
        <li className="text-sm">
          To erase the board, go over it with your mouse without pressing down.
        </li>
        <li className="text-sm">
          Time is OF THE ESSENCE because black spots will randomly appear on the board.
        </li>
        <li className="text-sm">
          If you wish to restart, be aware that all your progress will be erased.
        </li>
      </ul>
      <Board />
    </div>
  );
}
