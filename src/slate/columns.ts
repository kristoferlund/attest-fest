import { Node, Path, Point } from "slate";

interface LineCol {
  line: number;
  column: number;
}

export function slatePointToLineCol(
  root: Node,
  path: Path | undefined,
  offset: number | undefined
): LineCol | null {
  if (!path || !offset) return null; // Invalid path

  const [lineIndex, cellIndex] = path;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineNode = (root as any).children[lineIndex];
  if (!lineNode || !lineNode.children[cellIndex]) return null; // Invalid path

  // Calculate the column position
  let column = offset;
  for (let i = 0; i < cellIndex; i++) {
    const cellNode = lineNode.children[i];
    column += Node.string(cellNode).length;
  }

  return { line: lineIndex, column };
}

export function lineColToSlatePoint(
  root: Node,
  line: number,
  column: number
): Point | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineNode = (root as any).children[line];
  if (!lineNode) return null; // Line does not exist

  let columnIndex = 0;
  for (let i = 0; i < lineNode.children.length; i++) {
    const cellNode = lineNode.children[i];
    const textLength = Node.string(cellNode).length;
    if (columnIndex + textLength >= column) {
      // Found the cell containing the column
      return { path: [line, i], offset: column - columnIndex };
    }
    columnIndex += textLength;
  }

  return null; // Column does not exist
}
