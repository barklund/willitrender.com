import { Form } from "@remix-run/react";
import type { GameRound } from "~/models/types.client";
import useHost from "./useHost";

function range(n: number) {
  return Array.from({ length: n }).map((k, v) => v);
}

function Round({
  roundNo,
  round,
  done,
  onReplay,
}: {
  roundNo: number;
  round?: GameRound;
  done: boolean;
  onReplay: (round: GameRound) => void;
}) {
  return (
    <li
      className={`flex flex-grow flex-col border border-white ${
        round
          ? round.isActive || round.correct === null
            ? "bg-green-900 text-white"
            : "bg-green-300"
          : "bg-gray-300 text-gray-500"
      }`}
    >
      {!round || !done ? (
        <p className="text-center text-2xl leading-loose">{roundNo + 1}</p>
      ) : (
        <Form method="post" className="flex justify-center">
          <input type="hidden" name="action" value="replay" />
          <input type="hidden" name="roundId" value={round.id} />
          <button
            className="text-center text-2xl leading-loose"
            onClick={() => onReplay(round)}
          >
            {roundNo + 1}
          </button>
        </Form>
      )}
    </li>
  );
}

function Rounds() {
  const { rounds, roundCount, setReplayRound } = useHost(
    ({ rounds, roundCount, setReplayRound }) => ({
      rounds,
      roundCount,
      setReplayRound,
    }),
    true
  );
  const done =
    rounds.length === roundCount && rounds[roundCount - 1].correct !== null;
  return (
    <ol className="flex">
      {range(roundCount).map((roundNo) => (
        <Round
          key={roundNo}
          roundNo={roundNo}
          round={rounds[roundNo]}
          done={done}
          onReplay={setReplayRound}
        />
      ))}
    </ol>
  );
}

export default Rounds;
