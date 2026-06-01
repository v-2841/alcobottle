import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-wine-gradient">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-2 px-5 py-6 md:px-10">
        <Logo className="text-xl" />
        <p className="text-sm text-sand">©{year} Copyright alcobottle</p>
      </div>
    </footer>
  );
}
