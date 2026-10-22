"use client";
import { BlockView } from "@/components/Blocks";
import { components } from "@/editor/config";
import { propsToBlock } from "@/editor/convert";

// Every block with its starter content. Used to make the block-picker thumbnails (npm run thumbnails).
export default function BlockLibrary() {
  return (
    <>
      {Object.entries(components).map(([name, c]) => (
        <div key={name} data-block={name}>
          <BlockView block={propsToBlock(name, (c.defaultProps ?? {}) as Record<string, unknown>)} />
        </div>
      ))}
    </>
  );
}
