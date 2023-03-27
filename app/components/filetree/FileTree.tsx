import { useEffect, useState } from "react";
import { FaFolder, FaFolderOpen } from "react-icons/fa";
import cx from "classnames";
import type { ZipFileEntry } from "@types/zip.js";

interface File {
  name: string;
  content: string;
}
interface Folder {
  name: string;
  isOpen?: boolean;
  children?: TreeNode[];
}
type TreeNode = File | Folder;

const getExtension = (str: string) => /(?:\.([^.]+))?$/.exec(str)?.[1];

function getFileIcon(filename: string) {
  const getIcon = (type: string) => `/icons/filetype-${type}.svg`;
  switch (getExtension(filename)) {
    case "png":
      return getIcon("png");
    case "svg":
      return getIcon("svg");
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
      return getIcon("js");
    case "json":
      return getIcon("json");
    case "html":
      return getIcon("html");
    case "css":
      return getIcon("css");
    default:
      return getIcon("generic");
  }
}

interface NodeProps {
  node: TreeNode;
  path?: string;
  indent?: number;
  selected?: string;
  onSelect: (path: string, node: TreeNode) => void;
}

function Node({ node, path = "", indent = 0, selected, onSelect }: NodeProps) {
  const [isOpen, setOpen] = useState("isOpen" in node ? node.isOpen : false);
  path = `src/${node.name}`;
  const hasChildren = "children" in node;
  const indentation = (
    <span className="shrink-0" style={{ width: `${indent * 1}em` }}>
       
    </span>
  );
  if (!hasChildren) {
    return (
      <button
        className={cx("flex items-center gap-1 px-2 py-1 hover:bg-blue-50", {
          "!bg-blue-100": selected === path,
        })}
        onClick={() => onSelect(path, node)}
      >
        {indentation}
        <img src={getFileIcon(node.name)} width="16" alt="" />
        {node.name}
      </button>
    );
  }
  return (
    <>
      <button
        className="flex items-center gap-1 px-2 py-1 hover:bg-blue-50"
        onClick={() => setOpen((v) => !v)}
      >
        {indentation}
        {isOpen ? <FaFolderOpen /> : <FaFolder />}
        {node.name}
      </button>
      {isOpen &&
        typeof node.children !== "undefined" &&
        node.children.map((child) => (
          <Node
            node={child}
            indent={indent + 1}
            key={child.name}
            onSelect={onSelect}
            selected={selected}
            path={path}
          />
        ))}
    </>
  );
}

function getLanguage(extension: string) {
  switch (extension) {
    case "gitignore":
      return "shell";
    default:
      return extension;
  }
}

function getName(path: string) {
  return path.replace(/\/$/, "").split("/").pop();
}

function sortFiles(fileList: TreeNode[]) {
  fileList.sort((a, b) => {
    const nameSort = a.name < b.name ? -1 : 1;
    if ("children" in a && "children" in b) {
      return nameSort;
    }
    return "children" in a ? -1 : "children" in b ? 1 : nameSort;
  });
  return fileList;
}

function getNextNode(list, offset) {
  const { name, ...rest } = list[offset];
  const node = { name: getName(name) };
  let newOffset = offset + 1;
  const children = [];
  while (true) {
    const next = list[newOffset];
    if (!next?.name.startsWith(name)) {
      break;
    }
    const response = getNextNode(list, newOffset);
    children.push(response.node);
    newOffset = response.offset;
  }
  if (children.length) {
    node.children = sortFiles(children);
    node.isOpen = node.name === "src" || offset === 0;
  } else {
    Object.assign(node, rest);
  }
  return { node, offset: newOffset };
}
function getTree(list) {
  return getNextNode(list, 0).node;
}

function FileTree({
  zip,
  onClick,
  defaultSelected = null,
}: {
  zip: string;
  onClick: (node: any) => void;
  defaultSelected: string | null;
}) {
  const [files, setFiles] = useState({});
  useEffect(() => {
    const readZip = async () => {
      const zipJs = await require("@zip.js/zip.js");
      fetch(zip)
        .then((res) => new zipJs.ZipReader(res.body).getEntries())
        .then((files) =>
          Promise.all(
            files.map(async (file: ZipFileEntry) => {
              if (file.filename.endsWith("/")) {
                return { name: file.filename };
              }
              const contentWriter = new zipJs.TextWriter();
              const content = await file.getData(contentWriter);
              const baseNode = {
                name: file.filename,
                content,
              };
              return {
                ...baseNode,
                language: getLanguage(getExtension(file.filename)),
              };
            })
          )
        )
        .then((list) => setFiles(getTree(list)));
    };
    readZip();
  }, [zip]);
  const [selected, setSelected] = useState(defaultSelected);
  useEffect(() => {
    if (defaultSelected && files.children) {
      onClick(
        files.children.find(({ name }) => defaultSelected.includes(name))
      );
    }
  }, [defaultSelected, files]);
  if (!files.name) return null;
  const onSelect = (path, node) => {
    setSelected(path);
    onClick(node);
  };
  return (
    <div className="flex flex-col items-stretch">
      <Node node={files} selected={selected} onSelect={onSelect} />
    </div>
  );
}

export default FileTree;
