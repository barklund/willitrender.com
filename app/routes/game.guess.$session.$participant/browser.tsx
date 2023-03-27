import { useState } from "react";
import { FileTree } from "~/components/filetree";
import { Highlight } from "~/components/highlight";
import type { GameRound } from "~/models/types.client";

interface Node {
  content: string;
  language: string;
}

function Browser({ currentRound }: { currentRound: GameRound | null }) {
  const [activeNode, setActiveNode] = useState<Node | null>(null);
  if (!currentRound) return null;
  const repo = `render-champion-${currentRound.round
    .toFixed(0)
    .padStart(2, "0")}`;
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

export default Browser;
