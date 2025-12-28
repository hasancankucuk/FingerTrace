import { TableSkeleton } from "@/components/landing/TableSkeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWorkspace } from "@/hooks/useWorkspace";
import type { MergedFingerprint } from "@/models/IdentificationData";
import { useFingerprintQuery } from "@/queries/fingerprintQueries";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function Identification() {
  const { t } = useTranslation();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const { workspace } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const {
    data: fingerprintData,
    isLoading,
    error: fingerprintError
  } = useFingerprintQuery(workspace?.id || "", {
    page: pagination.pageIndex + 1,
    page_size: pagination.pageSize,
    sort_field: sorting[0]?.id || "created_at",
    sort_direction: sorting[0]?.desc ? "desc" : "asc",
    search: debouncedSearch.trim(),
  });

  if (fingerprintError) {
    toast.error(t("identification.error"))
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const columns: ColumnDef<MergedFingerprint>[] = [
    {
      accessorKey: "fingerprint",
      header: t("identification.fingerprint"),
      cell: ({ row }) => (
        <div className="font-mono text-xs max-w-[200px] truncate">
          {row.getValue("fingerprint")}
        </div>
      ),
    },
    {
      accessorKey: "device_type",
      header: t("identification.device_type"),
      cell: ({ row }) => <div>{row.getValue("device_type")}</div>,
    },
    {
      accessorKey: "platform",
      header: t("identification.platform"),
      cell: ({ row }) => <div>{row.getValue("platform")}</div>,
    },
    {
      accessorKey: "time_zone",
      header: t("identification.time_zone"),
      cell: ({ row }) => <div>{row.getValue("time_zone")}</div>,
    },
    {
      accessorKey: "user_agent",
      header: t("identification.user_agent"),
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate text-sm">
          {row.getValue("user_agent")}
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: t("common.created_at"),
      cell: ({ row }) => <div>{new Date(row.getValue("created_at")).toLocaleString()}</div>,
    },
    {
      accessorKey: "updated_at",
      header: t("common.updated_at"),
      cell: ({ row }) => <div>{new Date(row.getValue("updated_at")).toLocaleString()}</div>,
    },
  ];

  const table = useReactTable({
    data: fingerprintData?.data || [],
    columns,
    pageCount: Math.ceil(fingerprintData?.pagination.total_items || 0 / pagination.pageSize),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter: searchQuery,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setSearchQuery,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return (

    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t("identification.title")}</CardTitle>
            <CardDescription>
              {t("identification.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t("identification.search_placeholder")}
                    value={globalFilter ?? ""}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    className="pl-10 max-w-sm"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{t("identification.show")}</span>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">{t("identification.entries")}</span>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} className="px-4 py-3">
                            {header.isPlaceholder ? null : (
                              <div
                                className={
                                  header.column.getCanSort()
                                    ? "cursor-pointer select-none flex items-center space-x-1 hover:bg-gray-50 rounded px-2 py-1 -mx-2 -my-1"
                                    : ""
                                }
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                <span>
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                </span>
                                {header.column.getCanSort() && (
                                  <div className="flex flex-col">
                                    {header.column.getIsSorted() === "desc" ? (
                                      <ChevronDown className="h-3 w-3" />
                                    ) : header.column.getIsSorted() === "asc" ? (
                                      <ChevronUp className="h-3 w-3" />
                                    ) : (
                                      <div className="h-3 w-3 opacity-20">
                                        <ChevronUp className="h-2 w-2" />
                                        <ChevronDown className="h-2 w-2 -mt-1" />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="hover:bg-gray-50"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="px-4 py-3">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        {t("common.no_results")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-600">
                  {t("identification.pagination.showing", {
                    from: table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1,
                    to: Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, fingerprintData?.pagination.total_items || 0),
                    total: fingerprintData?.pagination.total_items || 0
                  })}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-600">{t("identification.pagination.page", {
                    current: table.getState().pagination.pageIndex + 1,
                    total: table.getPageCount()
                  })}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
