import Image from "next/image";
import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: { px: 32, cls: "h-8 w-8 text-xs" },
  md: { px: 40, cls: "h-10 w-10 text-sm" },
  lg: { px: 56, cls: "h-14 w-14 text-base" },
  xl: { px: 80, cls: "h-20 w-20 text-xl" },
};

export default function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const { px, cls } = sizeMap[size];

  if (src) {
    return (
      <div className={cn("relative rounded-full overflow-hidden flex-shrink-0", cls, className)}>
        <Image src={src} alt={name ?? "Avatar"} width={px} height={px} className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex-shrink-0 flex items-center justify-center font-semibold bg-brand-100 text-brand-700",
        cls,
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
