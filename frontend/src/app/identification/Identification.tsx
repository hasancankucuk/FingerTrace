import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import type { MergedFingerprint } from "@/models/IdentificationData";
import { useWorkspace } from "@/hooks/useWorkspace";
import { getMergedFingerprints } from "@/services/fingerprint";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  ChevronDown,
  Search,
} from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";

export function Identification() {
  const [data, setData] = useState<MergedFingerprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalItems, setTotalItems] = useState(0);
  const { workspace } = useWorkspace();

  // Debounced search
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!workspace) {
      setData([]);
      setTotalItems(0);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        // Convert tanstack table sorting to API format
        const sortField = sorting[0]?.id || "created_at";
        const sortDirection = sorting[0]?.desc ? "desc" : "asc";

        const response = await getMergedFingerprints(workspace.id, {
          page: pagination.pageIndex + 1,
          page_size: pagination.pageSize,
          sort_field: sortField,
          sort_direction: sortDirection,
          search: debouncedSearch || undefined,
        });

        setData(response.data);
        setTotalItems(response.pagination.total_items);
      } catch (err) {
        console.error(err);
        setData([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [workspace, pagination, sorting, debouncedSearch]);

  const columns: ColumnDef<MergedFingerprint>[] = [
    {
      accessorKey: "fingerprint",
      header: "Fingerprint",
      cell: ({ row }) => (
        <div className="font-mono text-xs max-w-[200px] truncate">
          {row.getValue("fingerprint")}
        </div>
      ),
    },
    {
      accessorKey: "device_type",
      header: "Device Type",
      cell: ({ row }) => <div>{row.getValue("device_type")}</div>,
    },
    {
      accessorKey: "platform",
      header: "Platform",
      cell: ({ row }) => <div>{row.getValue("platform")}</div>,
    },
    {
      accessorKey: "time_zone",
      header: "Time Zone",
      cell: ({ row }) => <div>{row.getValue("time_zone")}</div>,
    },
    {
      accessorKey: "user_agent",
      header: "User Agent",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate text-sm">
          {row.getValue("user_agent")}
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => <div>{new Date(row.getValue("created_at")).toLocaleString()}</div>,
    },
    {
      accessorKey: "updated_at",
      header: "Updated At",
      cell: ({ row }) => <div>{new Date(row.getValue("updated_at")).toLocaleString()}</div>,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(totalItems / pagination.pageSize),
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

  if (loading) {
    return <div className="text-center py-16 text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Identification</CardTitle>
          <CardDescription>
            Overview of user identification data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search all columns..."
                  value={globalFilter ?? ""}
                  onChange={(event) => setGlobalFilter(event.target.value)}
                  className="pl-10 max-w-sm"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show</span>
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
              <span className="text-sm text-gray-600">entries</span>
            </div>
          </div>

          {/* Table */}
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
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-600">
                Showing{" "}
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1}{" "}
                to{" "}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}{" "}
                of {table.getFilteredRowModel().rows.length} entries
                {table.getFilteredRowModel().rows.length !== data.length && (
                  <span className="text-gray-400">
                    {" "}
                    (filtered from {data.length} total entries)
                  </span>
                )}
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
                <span className="text-sm text-gray-600">Page</span>
                <strong className="text-sm">
                  {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </strong>
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
    </div>
  );
}
