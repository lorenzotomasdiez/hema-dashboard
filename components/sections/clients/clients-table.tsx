"use client";
import * as React from "react"
import { Loader2, Search } from "lucide-react"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { QUERY_KEYS, useClientsPaginatedQuery } from "@/lib/tanstack";
import ClientsTableRowSkeleton from "./clients-table-row-skeleton";
import AddUpdateClient from "./add-update-client";
import ClientsTableRow from "./clients-table-row";
import ClientsDeleteConfirmation from "./clients-delete-confirmation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { debounce } from "lodash";


export default function ClientsTable() {
  const [openDetails, setOpenDetails] = React.useState<string | null>(null);
  const [openDelete, setOpenDelete] = React.useState<string | null>(null);

  const [keywordInput, setKeywordInput] = React.useState<string>("");

  const {
    clientsQuery: clients,
    handlePrevPage,
    handleNextPage,
    page,
    per_page,
    keyword,
    handleKeyword
  } = useClientsPaginatedQuery({ page: 0, per_page: 10, keyword: "" });

  const handleOpenDetails = (id: string) => {
    setOpenDetails(id);
  }

  const handleOpenDelete = (id: string) => {
    setOpenDelete(id);
  }

  React.useEffect(() => {
    const debouncedHandleKeyword = debounce(() => handleKeyword(keywordInput), 500);
    debouncedHandleKeyword();
    return () => {
      debouncedHandleKeyword.cancel();
    }
  }, [keywordInput])

  return (
    <Card className="w-full max-w-4xl mx-auto dark:bg-neutral-900">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-2xl font-bold">Clientes</CardTitle>
        <div className="flex items-center justify-end gap-3">
          {clients.isFetching && <Loader2 className="animate-spin" />}
          <AddUpdateClient queryKey={QUERY_KEYS.clients.full} open={openDetails === "new"} setOpen={setOpenDetails} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente..."
              className="pl-8"
              onChange={(e) => setKeywordInput(e.target.value)}
              value={keywordInput}
            />
          </div>
        </div>
        <div className="rounded-md border dark:bg-neutral-800">
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
                clients.data?.clients.map((client) => (
                  <React.Fragment key={client.id}>
                    <ClientsTableRow
                      key={client.id}
                      client={client}
                      handleOpenDetails={handleOpenDetails}
                      handleOpenDelete={handleOpenDelete}
                    />
                    {
                      openDetails === client.id && (
                        <AddUpdateClient
                          queryKey={QUERY_KEYS.clients.full}
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
      <CardFooter>
        <div className="w-full flex items-center justify-between">
          <div className="flex flex-col items-start">
            <p className="text-base">
              Pagina: <span className="font-bold">{page + 1}</span>
            </p>
            <p className="text-base">
              Clientes totales: <span className="font-bold">{clients.data?.total}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={page === 0}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={(clients.data?.clients.length || 0) < per_page}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </CardFooter>
      <ClientsDeleteConfirmation
        clientId={openDelete}
        setOpen={setOpenDelete}
        queryKey={QUERY_KEYS.clients.full}
      />
    </Card>
  )
}