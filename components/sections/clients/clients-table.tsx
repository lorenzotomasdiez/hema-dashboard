"use client";
import * as React from "react"
import { Loader2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query";
import { Client } from "@/types/client";
import { getClientsFull } from "@/services/clients";
import ClientsTableRowSkeleton from "./clients-table-row-skeleton";
import ClientsTableRow from "./clients-table-row";
import AddUpdateClient from "./add-update-client";


export default function ClientsTable() {
  const [openDetails, setOpenDetails] = React.useState<string | null>(null);
  const queryKey = ["clients"];
  const clients = useQuery<(Client & {ordersTotal: number})[]>({
    queryKey: queryKey,
    queryFn: getClientsFull
  })

  const handleOpenDetails = (id: string) => {
    setOpenDetails(id);
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-2xl font-bold">Clientes</CardTitle>
        <div className="flex items-center justify-end gap-3">
          {clients.isFetching && <Loader2 className="animate-spin" />}
          <AddUpdateClient queryKey={queryKey} open={openDetails === "new"} setOpen={setOpenDetails} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente..."
              className="pl-8"
            />
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Telefono</TableHead>
                <TableHead>Direccion</TableHead>
                <TableHead>Total Pedidos</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!clients.data && clients.isFetching ? (
                Array.from({ length: 10 }, (_, i) => i)
                  .map(e => (
                    <ClientsTableRowSkeleton key={e} />
                  ))
              ) :
                clients.data?.map((client) => (
                  <React.Fragment key={client.id}>
                    <ClientsTableRow
                      key={client.id}
                      client={client}
                      handleOpenDetails={handleOpenDetails}
                    />
                    {
                      openDetails === client.id && (
                        <AddUpdateClient 
                          queryKey={queryKey} 
                          open={openDetails === client.id} 
                          setOpen={setOpenDetails} 
                          client={client}
                        />
                      )
                    }
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}