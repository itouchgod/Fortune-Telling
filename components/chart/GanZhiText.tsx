import { getWuXingColorForBranch, getWuXingColorForStem } from "@/lib/bazi/wuxingColors";

interface GanZhiTextProps {
  char: string;
  kind: "stem" | "branch";
  className?: string;
}

export default function GanZhiText({ char, kind, className = "" }: GanZhiTextProps) {
  const color = kind === "stem" ? getWuXingColorForStem(char) : getWuXingColorForBranch(char);

  return (
    <span className={className} style={color ? { color } : undefined}>
      {char}
    </span>
  );
}

interface GanZhiPairTextProps {
  stem: string;
  branch: string;
  className?: string;
}

export function GanZhiPairText({ stem, branch, className = "" }: GanZhiPairTextProps) {
  return (
    <span className={className}>
      <GanZhiText char={stem} kind="stem" />
      <GanZhiText char={branch} kind="branch" />
    </span>
  );
}
