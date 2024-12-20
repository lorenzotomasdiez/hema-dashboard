import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, moneyMask } from "@/lib/utils";

interface MonthlySmallCardProps {
  data?: number;
  title: string;
  icon: React.ReactNode;
  isMoney?: boolean;
  leyend?: string;
  textClassName?: string;
}

function MonthlySmallCardSkeleton({ title, icon }: { title: string, icon: React.ReactNode }) {
  return (
    <Card className="dark:bg-neutral-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium dark:text-gray-100">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="font-bold dark:text-gray-100 h-[32px] flex items-center justify-start">
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex items-center justify-start h-4">
          <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function MonthlySmallCard({ data, title, icon, isMoney, leyend, textClassName }: MonthlySmallCardProps) {
  if (data === undefined) return <MonthlySmallCardSkeleton title={title} icon={icon} />
  return (
    <Card className="dark:bg-neutral-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium dark:text-gray-100">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold dark:text-gray-100", textClassName)}>{isMoney ? moneyMask(data) : data}</div>
        <p className="text-xs">
          {leyend}
        </p>
      </CardContent>
    </Card>
  )
}