"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

import { AlignRight } from "lucide-react";
import { defaultLinks } from "@/config/nav";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <div className="md:hidden border-b md:mb-2 w-full">
      <nav className="flex justify-between w-full items-center">
        <div className="flex-1"></div>
        <div className="flex items-center justify-center flex-1 py-2">
          <Image src="/hema-logo.jpg" alt="Logo" width={50} height={50} className="rounded-full border-2 border-border" />
        </div>
        <div className="flex-1 flex justify-end">
          <Button variant="ghost" onClick={() => setOpen(!open)}>
            <AlignRight />
          </Button>
        </div>
      </nav>
      {open ? (
        <div className="my-4 p-4 bg-muted">
          <ul className="space-y-2">
            {defaultLinks.map((link) => (
              <li key={link.title} onClick={() => setOpen(false)} className="">
                <Link
                  href={link.href}
                  className={
                    pathname === link.href
                      ? "text-primary hover:text-primary font-semibold"
                      : "text-muted-foreground hover:text-primary"
                  }
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
