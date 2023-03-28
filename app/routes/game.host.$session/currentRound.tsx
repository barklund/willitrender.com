import { useState } from "react";
import { FileTree } from "~/components/filetree";
import { Highlight } from "~/components/highlight";
import useHost from "./useHost";

interface Node {
  content: string;
  language: string;
}

function CurrentRound() {
  const { rounds, replayRound } = useHost(
    ({ rounds, replayRound }) => ({ rounds, replayRound }),
    true
  );
  const [activeNode, setActiveNode] = useState<Node | null>(null);
  const lastRound = replayRound || rounds[rounds.length - 1];
  const isReplay = replayRound !== null;
  if (!isReplay && (!lastRound || lastRound.correct !== null)) return null;
  const repo = `render-champion-${lastRound.round.toFixed(0).padStart(2, "0")}`;
  if (lastRound.isActive || isReplay) {
    return (
      <div className="flex w-full max-w-full flex-grow items-stretch overflow-hidden">
        <div className="w-[300px] overflow-auto border-r-2 text-sm">
          <FileTree
            zip={`/zips/${repo}.zip`}
            onClick={(node: Node) => void setActiveNode(node)}
            defaultSelected="src/App.js"
          />
        </div>
        <div className="w-max-full h-full w-full overflow-auto">
          {activeNode && (
            <Highlight
              content={activeNode.content}
              language={activeNode.language}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-grow justify-center">
      <iframe
        title={`Demo application for round ${lastRound.round}`}
        src={`/builds/${repo}/`}
        className="h-full w-3/4 border bg-gray-200"
      />
    </div>
  );
}

export default CurrentRound;
