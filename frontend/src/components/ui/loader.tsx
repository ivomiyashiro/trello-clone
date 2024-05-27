import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

export const Loader = ({ className }: { className?: string }) => {
  return (
    <LoaderCircle
      aria-label="Loading"
      className={cn("animate-spin", className)}
    />
  );
};
