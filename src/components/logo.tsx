import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/">
      <Image
        className="dark:invert"
        src="/logo.png"
        alt="IFV"
        width={50}
        height={50}
      />
    </Link>
  );
};
