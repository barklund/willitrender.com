import useHost from "./useHost";

function BetweenRounds() {
  const { currentRound, rounds, session } = useHost(
    ({ currentRound, rounds, session }) => ({ currentRound, rounds, session }),
    true
  );
  if (currentRound || rounds.length > 0) return null;
  return (
    <div className="flex flex-col items-center gap-12">
      <img src="/willitrender_logo.png" className="h-80" alt="Logo" />
      <h1 className="text-6xl">Welcome</h1>
      <p className="text-3xl">
        <code>https://willitrender.com/game/join</code>
      </p>
      <p className="text-8xl">
        <code>{session.shortcode}</code>
      </p>
    </div>
  );
}

export default BetweenRounds;
