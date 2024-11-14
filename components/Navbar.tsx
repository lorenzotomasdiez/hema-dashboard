"use client";
import { HorizontalLogoPymePro } from "./ui/logo";
import { SidebarTrigger } from "./ui/sidebar";
import { ModeToggle } from "./ui/ThemeToggle";

export default function Navbar() {
  return (
    <nav className="grid grid-cols-3 px-3 py-3 items-center md:py-4">
      <div className="col-span-1">
        <SidebarTrigger />
      </div>
      <div className="col-span-1 flex items-center justify-center">
        <HorizontalLogoPymePro />
      </div>
      <div className="col-span-1 flex items-center justify-end">
        <ModeToggle />
      </div>
    </nav>
  )
}