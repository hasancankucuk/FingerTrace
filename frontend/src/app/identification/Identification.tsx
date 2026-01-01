import { ExportButtons } from "@/components/ExportButtons";
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
import { useSocket } from "@/hooks/useSocket";
import { useWorkspace } from "@/hooks/useWorkspace";
import type { MergedFingerprint } from "@/models/IdentificationData";
import { useFingerprintQuery } from "@/queries/fingerprintQueries";
import { downloadBlob, exportFingerprintsPDF } from "@/services/export";
import type { ExportColumn } from "@/utils/exportCSV";
import { formatDate } from "@/utils/exportCSV";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { IdentificationDetailModal } from "./IdentificationDetailModal";

export function Identification() {
  const { t } = useTranslation();
  const { workspace } = useWorkspace();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  useSocket(workspace?.id, 'fingerprint_update', ['fingerprint', workspace?.id]);

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

  useEffect(() => {
    if (fingerprintError) {
      toast.error(t("identification.error"));
    }
  }, [fingerprintError, t]);

  const columns = useMemo<ColumnDef<MergedFingerprint>[]>(() => [
    {
      accessorKey: "fingerprint",
      header: t("identification.fingerprint"),
      cell: ({ row }) => (
        <code className="bg-muted px-1 py-0.5 rounded text-[10px] font-mono">
          {row.original.fingerprint.slice(0, 12)}...
        </code>
      ),
    },
    {
      accessorKey: "device_type",
      header: t("identification.device_type"),
    },
    {
      accessorKey: "platform",
      header: t("identification.platform"),
    },
    {
      accessorKey: "created_at",
      header: t("common.created_at"),
      cell: ({ row }) => new Date(row.original.created_at).toLocaleString(),
    }
  ], [t]);

  const exportColumns: ExportColumn[] = useMemo(() => [
    { key: 'fingerprint', label: 'Fingerprint' },
    { key: 'device_type', label: 'Device Type' },
    { key: 'platform', label: 'Platform' },
    { key: 'browser', label: 'Browser' },
    { key: 'time_zone', label: 'Time Zone' },
    { key: 'user_agent', label: 'User Agent' },
    {
      key: 'created_at',
      label: 'Created At',
      format: formatDate
    },
  ], []);

  const handlePDFExport = async () => {
    if (!workspace?.id) {
      toast.error('Workspace not found');
      return;
    }

    try {
      toast.info('PDF oluşturuluyor...');
      const blob = await exportFingerprintsPDF(workspace.id);
      downloadBlob(blob, `fingerprints_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('PDF indirildi!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('PDF export başarısız oldu');
    }
  };

  const table = useReactTable({
    data: fingerprintData?.data || [],
    columns,
    pageCount: Math.ceil((fingerprintData?.pagination.total_items || 0) / pagination.pageSize),
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    enableMultiRowSelection: false, // Sadece tek satır detay için
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{t("identification.title")}</CardTitle>
              <CardDescription>{t("identification.description")}</CardDescription>
            </div>
            <ExportButtons
              data={fingerprintData?.data || []}
              columns={exportColumns}
              filename={`fingerprints_${new Date().toISOString().split('T')[0]}`}
              onExportPDF={handlePDFExport}
              disabled={isLoading}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Top Bar: Search & PageSize */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("identification.search_placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">{t("identification.show")}</span>
              <Select
                value={`${pagination.pageSize}`}
                onValueChange={(v) => table.setPageSize(Number(v))}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50, 100].map((size) => (
                    <SelectItem key={size} value={`${size}`}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            {isLoading ? (
              <div className="p-8 text-center"><TableSkeleton /></div>
            ) : (
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          <div
                            className={`flex items-center space-x-2 ${header.column.getCanSort() ? "cursor-pointer select-none" : ""}`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <ChevronUp className="h-4 w-4" />,
                              desc: <ChevronDown className="h-4 w-4" />,
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => {
                          row.toggleSelected(true);
                          setOpen(true);
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        {t("common.no_results")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {t("identification.pagination.showing", {
                from: pagination.pageIndex * pagination.pageSize + 1,
                to: Math.min((pagination.pageIndex + 1) * pagination.pageSize, fingerprintData?.pagination.total_items || 0),
                total: fingerprintData?.pagination.total_items || 0
              })}
            </p>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                {pagination.pageIndex + 1} / {table.getPageCount()}
              </span>
              <Button variant="outline" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <IdentificationDetailModal open={open} setOpen={setOpen} table={table} />
    </div>
  );
}