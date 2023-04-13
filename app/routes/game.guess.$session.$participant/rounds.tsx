import type { GameParticipant, GameRound } from "~/models/types.client";

function range(n: number) {
  return Array.from({ length: n }).map((k, v) => v);
}

function Bit({ bit }: { bit: number }) {
  const color = bit ? "bg-green-900" : "bg-white";
  return <li className={`flex-grow md:border md:border-gray-200 ${color}`}> </li>;
}

function Answer({
  guess,
  correct,
}: {
  guess?: number;
  correct: number | null;
}) {
  const bits = [8, 4, 2, 1];
  return (
    <>
      {typeof guess === "number" ? (
        <ol className="flex h-2 items-stretch">
          {bits.map((bit) => (
            <Bit key={bit} bit={guess & bit} />
          ))}
        </ol>
      ) : (
        <div className="h-2" />
      )}
      {correct !== null && (
        <ol className="flex h-2 items-stretch">
          {bits.map((bit) => (
            <Bit key={bit} bit={correct & bit} />
          ))}
        </ol>
      )}
    </>
  );
}

function Rounds({
  rounds,
  roundCount,
  participant,
  replayRound,
}: {
  rounds: GameRound[];
  roundCount: number;
  participant: GameParticipant;
  replayRound?: GameRound;
}) {
  const guessesByRoundId = Object.fromEntries(
    participant.guesses?.map(({ roundId, answer }) => [roundId, answer]) || []
  );
  return (
    <ol className="flex w-full border">
      {range(roundCount).map((roundNo) => (
        <li
          key={roundNo}
          className={`flex flex-grow flex-col border ${
            rounds[roundNo]
              ? rounds[roundNo].isActive ||
                rounds[roundNo].correct === null ||
                (replayRound && replayRound.id === rounds[roundNo].id)
                ? "bg-gray-900 text-white"
                : "bg-gray-300"
              : "bg-gray-300 text-gray-500"
          }`}
        >
          <p className="text-center leading-none">{roundNo + 1}</p>
          {rounds[roundNo] && (
            <Answer
              guess={guessesByRoundId[rounds[roundNo].id]}
              correct={rounds[roundNo].correct}
            />
          )}
        </li>
      ))}
    </ol>
  );
}

export default Rounds;
