import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { moneyMask } from "@/lib/utils";

type CardData = {
  currentMonth: number;
  previousMonth: number;
}

interface MonthlySmallCardProps {
  data?: CardData;
  title: string;
  icon: React.ReactNode;
  isMoney?: boolean;
}

function MonthlyComparisonCardSkeleton({ title, icon }: { title: string, icon: React.ReactNode }) {
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

export default function MonthlyComparisonCard({ data, title, icon, isMoney }: MonthlySmallCardProps) {
  if (!data) return <MonthlyComparisonCardSkeleton title={title} icon={icon} />
  return (
    <Card className="dark:bg-neutral-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium dark:text-gray-100">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold dark:text-gray-100">{isMoney ? moneyMask(data?.currentMonth) : data?.currentMonth}</div>
        <p className="text-xs">
          <span className={`${data?.previousMonth !== 0
            ? ((data?.currentMonth - data?.previousMonth) / data?.previousMonth * 100) < 0
              ? 'text-red-500'
              : 'text-green-500'
            : data?.currentMonth > 0
              ? 'text-green-500'
              : 'text-neutral-500 dark:text-neutral-400'
            }`}>
            {data?.previousMonth !== 0
              ? `${((data?.currentMonth - data?.previousMonth) / data?.previousMonth * 100).toFixed(2)}%`
              : data?.currentMonth > 0
                ? '+100%'
                : '0%'
            }
          </span>
          {' '}respecto al mes anterior
        </p>
      </CardContent>
    </Card>
  )
}