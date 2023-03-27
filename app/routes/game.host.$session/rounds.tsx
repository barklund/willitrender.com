import useHost from "./useHost";

function range(n: number) {
  return Array.from({ length: n }).map((k, v) => v);
}

function Rounds() {
  const { rounds, roundCount } = useHost(
    ({ rounds, roundCount }) => ({ rounds, roundCount }),
    true
  );
  return (
    <ol className="flex">
      {range(roundCount).map((roundNo) => (
        <li
          key={roundNo}
          className={`flex flex-grow flex-col border border-white ${
            rounds[roundNo]
              ? rounds[roundNo].isActive || rounds[roundNo].correct === null
                ? "bg-green-900 text-white"
                : "bg-green-300"
              : "bg-gray-300 text-gray-500"
          }`}
        >
          <p className="text-center text-2xl leading-loose">{roundNo + 1}</p>
        </li>
      ))}
    </ol>
  );
}

export default Rounds;
