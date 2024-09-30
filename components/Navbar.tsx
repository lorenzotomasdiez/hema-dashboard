"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

import { AlignRight } from "lucide-react";
import { defaultLinks } from "@/config/nav";
import Image from "next/image";
import { APP_PATH } from "@/config/path";
import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      if (open) {
        listRef.current.style.maxHeight = `${listRef.current.scrollHeight}px`;
      } else {
        listRef.current.style.maxHeight = '0px';
      }
    }
  }, [open]);

  return (
    <div className="md:hidden border-b md:mb-2 w-full">
      <nav className="flex justify-between w-full items-center">
        <div className="flex-1"></div>
        <div className="flex items-center justify-center flex-1 py-2">
          <Link href={APP_PATH.protected.dashboard.root}>
            <Image src="/app-logo.png" alt="Logo" width={50} height={50} className="cursor-pointer" />
          </Link>
        </div>
        <div className="flex-1 flex justify-end">
          <Button variant="ghost" onClick={() => setOpen(!open)}>
            <AlignRight />
          </Button>
        </div>
      </nav>
      <div
        ref={listRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: '0px' }}
      >
        <div className="my-4 p-4 bg-muted">
          <ul className="space-y-4">
            {defaultLinks.map((link) => (
              link.roles.includes(session?.user.selectedCompany?.role as UserRole) && (
                <li key={link.title} onClick={() => setOpen(false)} className="w-full">
                  <Link
                    href={link.href}
                    className={`
                    block w-full py-3 px-4 rounded-lg text-lg
                    ${pathname === link.href
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-background text-muted-foreground hover:bg-secondary"}
                  `}
                  >
                    <div className="flex items-center">
                      {link.icon && <link.icon className="mr-3 h-5 w-5" />}
                      {link.title}
                    </div>
                  </Link>
                </li>
              )))}
          </ul>
        </div>
      </div>
    </div>
  );
}
