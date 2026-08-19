import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/somderua_logo.png";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex shrink-0" aria-label="Som de Rua">
      <Image quality={100} src={logo} alt="Logo do Som de Rua" width={32} height={32} />
    </Link>
  );
}
