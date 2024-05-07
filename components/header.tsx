import Link from "next/link";

export function Header() {
  return (
    <header>
      <div>
        <Link title="toTop" href="/">
          toTop
        </Link>
      </div>
    </header>
  );
}
