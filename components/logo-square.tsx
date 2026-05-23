import clsx from "clsx";
import Image from "next/image";

export default function LogoSquare({ size }: { size?: "sm" | undefined }) {
  return (
    <Image
      src="/logo.png"
      alt="Upcube"
      width={size === "sm" ? 20 : 24}
      height={size === "sm" ? 20 : 24}
      className={clsx({
        "h-[20px] w-[20px]": size === "sm",
        "h-[24px] w-[24px]": !size,
      })}
    />
  );
}
