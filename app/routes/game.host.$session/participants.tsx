import type { GameParticipant } from "~/models/types.client";
import useHost from "./useHost";

interface ParticipantProps {
  participant: GameParticipant;
  isInRound: boolean;
  hasGuessed: boolean;
}

function Participant({
  participant,
  isInRound = false,
  hasGuessed = false,
}: ParticipantProps) {
  const color = isInRound
    ? hasGuessed
      ? "bg-green-300"
      : "bg-red-300"
    : "bg-yellow-300";
  return (
    <li
      className={`w-[10%] border border-[#FFF3] px-4 py-2 uppercase ${color}`}
    >
      {participant.emoji} {participant.nickname}
    </li>
  );
}

function Participants() {
  const { participants, currentRound } = useHost(
    ({ participants, currentRound }) => ({ participants, currentRound }),
    true
  );
  const hasCurrentRound = currentRound !== null;
  const guesses: GameParticipant["id"][] =
    hasCurrentRound && currentRound.guesses
      ? currentRound.guesses.map(({ participantId }) => participantId)
      : [];
  return (
    <ul className="flex flex-wrap bg-gray-200">
      {participants.map((participant) => (
        <Participant
          key={participant.id}
          participant={participant}
          isInRound={hasCurrentRound}
          hasGuessed={guesses.includes(participant.id)}
        />
      ))}
    </ul>
  );
}

export default Participants;
