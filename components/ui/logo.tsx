"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function HorizontalLogoPymePro({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-[66px] h-[45px] rounded-lg dark:bg-white", className)}>
      <Image src="/horizontal-logo.png" alt="PymePro logo" fill sizes="100%" />
    </div>
  )
}

export function SquaredLogoPymePro({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-[100px] h-[100px] rounded-lg dark:bg-white", className)}>
      <Image src="/squared-logo.png" alt="PymePro logo" fill sizes="100%" />
    </div>
  )
}