import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";
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

export function Identification() {
  const [data, setData] = useState<MergedFingerprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<keyof MergedFingerprint>("request_id");
  const [sortAsc, setSortAsc] = useState(true);
  const { workspace } = useWorkspace();

  useEffect(() => {
    if (!workspace) {
      // clear or set data to empty when no workspace selected
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    (async () => {
      try {
        const merged = await getMergedFingerprints(workspace.id);
        // adapt merged into component's expected data shape
        setData(Array.isArray(merged) ? merged : []);
      } catch (err) {
        console.error(err);
        setData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [workspace]);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aVal =
        typeof a[sortKey] === "object"
          ? JSON.stringify(a[sortKey])
          : String(a[sortKey]);
      const bVal =
        typeof b[sortKey] === "object"
          ? JSON.stringify(b[sortKey])
          : String(b[sortKey]);
      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortAsc]);

  const handleSort = (key: keyof MergedFingerprint) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  if (loading)
    return <div className="text-center py-16 text-gray-500">Loading...</div>;

  return (
    <div className="mx-w-4xl mx-auto space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Identification</CardTitle>
          <CardDescription>
            Overview of user identification data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="min-w-[800px] text-sm font-light">
            <TableHeader>
              <TableRow className="bg-gray-50">
                {[
                  "Request Id",
                  "Fingerprint",
                  "Device Type",
                  "Platform",
                  "Time Zone",
                  "User Agent",
                  "Color Depth",
                  "Color Gamut",
                ].map((col) => (
                  <TableHead
                    key={col}
                    className="cursor-pointer select-none px-3 py-2 text-left"
                    onClick={() => handleSort(col as keyof MergedFingerprint)}
                  >
                    {col.replace(/_/g, " ")}{" "}
                    {sortKey === col ? (sortAsc ? " ▲" : " ▼") : ""}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center px-3 py-6 text-gray-500"
                  >
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((row, i) => (
                  <TableRow
                    key={row.request_id}
                    className={`hover:bg-gray-100 ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <TableCell className="px-3 py-2 font-normal">
                      {row.request_id}
                    </TableCell>
                    <TableCell className="px-3 py-2 font-mono">
                      {row.fingerprint}
                    </TableCell>
                    <TableCell className="px-3 py-2 font-normal">
                      {row.device_type}
                    </TableCell>
                    <TableCell className="px-3 py-2 font-normal">
                      {row.platform}
                    </TableCell>
                    <TableCell className="px-3 py-2 font-normal">
                      {row.time_zone}
                    </TableCell>
                    <TableCell className="px-3 py-2 font-normal">
                      {row.user_agent}
                    </TableCell>
                    <TableCell className="px-3 py-2 font-normal">
                      {row.color_depth}
                    </TableCell>
                    <TableCell className="px-3 py-2 font-normal">
                      {row.color_gamut}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-right px-3 py-2 text-gray-500 font-light"
                >
                  Total: {sortedData.length} entries
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
