import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-wine-gradient">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-2 px-5 pb-16 pt-6 text-center md:px-10 md:pb-6">
        <Logo className="text-xl" />
        <p className="max-w-3xl text-[11px] leading-relaxed text-sand/80">
          Сайт носит информационно-справочный характер. Размещённые сведения
          о товарах и ценах не являются публичной офертой.
        </p>
        <p className="text-[11px] font-medium text-sand">
          18+ Чрезмерное употребление алкоголя вредит вашему здоровью
        </p>
        <p className="text-sm text-sand">©{year} Copyright alcobottle</p>
      </div>
    </footer>
  );
}
