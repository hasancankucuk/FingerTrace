import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { createApiKey, deleteApiKey, getApiKeys } from "@/services/api_keys";
import { IconTrash } from "@tabler/icons-react";
import { toast, Toaster } from "sonner";
import { useWorkspace } from "@/hooks/useWorkspace";

type ApiKey = {
    name: string;
    key: string;
    created_at: string;
    environment: string;
    status: string;
    workspace_id?: string;
};

function isObject(o: unknown): o is Record<string, unknown> {
    return typeof o === "object" && o !== null;
}

function isApiKey(o: unknown): o is ApiKey {
    return isObject(o) && typeof (o as Record<string, unknown>).key === "string";
}

function isApiKeyArray(o: unknown): o is ApiKey[] {
    return Array.isArray(o) && o.every((it) => isApiKey(it));
}

function getErrorMessage(err: unknown): string {
    if (!err) return "Unknown error";
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    try {
        return JSON.stringify(err);
    } catch {
        return String(err);
    }
}

export const ApiKeys = () => {
    const { workspace } = useWorkspace();
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        name: "",
        environment: "production",
        status: "active",
    });

    useEffect(() => {
        const load = async () => {
            if (!workspace) {
                setApiKeys([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const data = await getApiKeys(String(workspace.id));
                let list: ApiKey[] = [];
                if (isApiKeyArray(data)) {
                    list = data;
                } else if (isObject(data)) {
                    const maybe = (data.api_keys ?? data.items) as unknown;
                    if (isApiKeyArray(maybe)) list = maybe;
                    else if (isApiKey(maybe)) list = [maybe];
                }
                setApiKeys(list);
            } catch (err: unknown) {
                toast.error(getErrorMessage(err) || "Failed to load API keys");
                setApiKeys([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [workspace]);

    const handleCreate = async () => {
        if (!workspace) {
            toast.error("Select a workspace before creating an API key.");
            return;
        }
        setLoading(true);
        try {
            const newKeyRaw = await createApiKey(form, String(workspace.id));
            let newKey: ApiKey;
            if (isApiKey(newKeyRaw)) {
                newKey = newKeyRaw;
            } else if (isObject(newKeyRaw) && isApiKey((newKeyRaw as Record<string, unknown>)["api_key"])) {
                newKey = (newKeyRaw as Record<string, unknown>)["api_key"] as ApiKey;
            } else {
                throw new Error("Unexpected API key response");
            }
            setApiKeys((keys) => [newKey, ...keys]);
            setShowForm(false);
            setForm({ name: "", environment: "production", status: "active" });
            toast.success("API key created");
        } catch (err: unknown) {
            toast.error(getErrorMessage(err) || "An error occurred while creating the API key.");
        } finally {
            setLoading(false);
        }
    };

    async function handleDelete(key: string) {
        if (!workspace) {
            toast.error("Select a workspace before deleting an API key.");
            return;
        }
        setLoading(true);
        try {
            await deleteApiKey(key, String(workspace.id));
            setApiKeys((keys) => keys.filter((k) => k.key !== key));
            toast.success("API key deleted");
        } catch (err: unknown) {
            toast.error(getErrorMessage(err) || "An error occurred while deleting the API key.");
        } finally {
            setLoading(false);
        }
    }

    // ensure rendering always uses an array
    const keysList = Array.isArray(apiKeys) ? apiKeys : [];

    return (
        <>
            <Toaster />
            <Card>
                <CardHeader>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>Manage your API keys</CardDescription>
                    <div className="flex flex-wrap items-center gap-2 md:flex-row justify-end">
                        <Button onClick={() => setShowForm((v) => !v)} disabled={!workspace}>
                            Generate New Key
                        </Button>
                    </div>
                    {showForm && (
                        <div className="mt-4 flex flex-col gap-2">
                            <input
                                className="border rounded p-2"
                                placeholder="Name"
                                value={form.name}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, name: e.target.value }))
                                }
                            />
                            <select
                                className="border rounded p-2"
                                value={form.environment}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, environment: e.target.value }))
                                }
                            >
                                <option value="production">Production</option>
                                <option value="development">Development</option>
                            </select>
                            <select
                                className="border rounded p-2"
                                value={form.status}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, status: e.target.value }))
                                }
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <Button disabled={!form.name || loading} onClick={handleCreate}>
                                {loading ? "Creating..." : "Create"}
                            </Button>
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    {!workspace ? (
                        <div className="mt-2 text-sm text-muted-foreground">
                            Select a workspace to view or manage API keys.
                        </div>
                    ) : (
                        <Table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Key</th>
                                    <th>Created At</th>
                                    <th>Environment</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {keysList.length > 0 ? (
                                    keysList.map((key) => (
                                        <tr key={key.key}>
                                            <td>{key.name}</td>
                                            <td>{key.key.slice(0, 5) + "..."}</td>
                                            <td>{new Date(key.created_at).toLocaleString()}</td>
                                            <td>
                                                {key.environment.charAt(0).toUpperCase() +
                                                    key.environment.slice(1)}
                                            </td>
                                            <td>
                                                <span
                                                    style={{
                                                        display: "inline-block",
                                                        width: "12px",
                                                        height: "12px",
                                                        borderRadius: "50%",
                                                        backgroundColor:
                                                            key.status === "active" ? "#22c55e" : "#ef4444",
                                                        marginRight: "6px",
                                                        verticalAlign: "middle",
                                                    }}
                                                />
                                                {key.status.charAt(0).toUpperCase() + key.status.slice(1)}
                                            </td>
                                            <td>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleDelete(key.key)}
                                                >
                                                    <IconTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : null}
                            </tbody>
                        </Table>
                    )}
                    {loading && (
                        <div className="mt-2 text-sm text-muted-foreground">Loading...</div>
                    )}
                    {!loading && workspace && keysList.length === 0 && (
                        <div className="mt-2 text-sm text-muted-foreground">
                            No API keys found.
                        </div>
                    )}

                    {/* error toast handled by Sonner */}
                </CardContent>
            </Card>
        </>
    );
};
