import { cn } from "@/lib/utils";

const Skeleton = ({
  width = "100%",
  height = "3rem",
  className = "",
}: {
  width?: string;
  height?: string;
  className?: string;
}) => {
  return (
    <div
      style={{ width, height }}
      className={cn("bg-gray-300 rounded-md animate-pulse", className)}
    />
  );
};

export default Skeleton;
