import Image from "next/image";

export const Logo = () => {
  return (
    <Image
      className="dark:invert"
      src="/logo.png"
      alt="IFV"
      width={50}
      height={50}
    />
  );
};
