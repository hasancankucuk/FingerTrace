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
import { createApiKey, deleteApiKey } from "@/services/api_keys";
import { IconTrash } from "@tabler/icons-react";
import { toast, Toaster } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "react-i18next";
import { useWorkspace } from "@/hooks/useWorkspace";
import type { ApiKey } from "@/utils/apiHelpers";
import { isApiKey, isObject, getErrorMessage } from "@/utils/apiHelpers";
import { ApiKeyModal } from "./ApiKeyModal";
import { useGetApiKeysQuery } from "@/queries/apiKeyQueries";
import { useQueryClient } from "@tanstack/react-query";

export const ApiKeys = () => {
  const { workspace } = useWorkspace();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [newApiKey, setNewApiKey] = useState<ApiKey | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    environment: "production",
    status: "active",
  });

  const {
    data: apiKeys = [],
    isLoading,
    error: apiKeyError
  } = useGetApiKeysQuery(String(workspace?.id || ""));

  useEffect(() => {
    if (apiKeyError) {
      toast.error(getErrorMessage(apiKeyError) || t("api_keys.toast.failed_load"));
    }
  }, [apiKeyError, t]);

  const handleCreate = async () => {
    if (!workspace) {
      toast.error(t("api_keys.toast.select_workspace"));
      return;
    }

    setIsCreating(true);
    try {
      const rawResponse = await createApiKey(form, String(workspace.id));
      let newKey: ApiKey | undefined;

      if (isApiKey(rawResponse)) {
        newKey = rawResponse;
      } else if (isObject(rawResponse)) {
        const apiKeyData = rawResponse["api_key"];
        if (isApiKey(apiKeyData)) newKey = apiKeyData;
      }

      if (!newKey) {
        toast.error(t("api_keys.toast.failed_create"));
        return;
      }

      setNewApiKey(newKey);
      setShowForm(false);
      setForm({ name: "", environment: "production", status: "active" });
      toast.success(t("api_keys.toast.created"));
      setShowApiKey(true);

      queryClient.invalidateQueries({ queryKey: ['api-keys', String(workspace.id)] });

    } catch (err) {
      toast.error(getErrorMessage(err) || t("api_keys.toast.failed_create"));
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!workspace) return;

    try {
      await deleteApiKey(key);
      toast.success(t("api_keys.toast.deleted"));

      queryClient.invalidateQueries({ queryKey: ['api-keys', String(workspace.id)] });
    } catch (err) {
      toast.error(getErrorMessage(err) || t("api_keys.toast.failed_delete"));
    }
  };

  return (
    <>
      <Toaster />
      <div className="max-w-4xl mx-auto space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("api_keys.title")}</CardTitle>
            <CardDescription>{t("api_keys.description")}</CardDescription>
            <div className="flex justify-end">
              <Button
                onClick={() => setShowForm((v) => !v)}
                disabled={!workspace || isLoading}
              >
                {t("api_keys.generate_key")}
              </Button>
            </div>

            {showForm && (
              <div className="mt-4 flex flex-col gap-2 p-4 border rounded-lg bg-muted/20">
                <input
                  className="border rounded p-2 bg-background"
                  placeholder={t("common.name")}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                <select
                  className="border rounded p-2 bg-background"
                  value={form.environment}
                  onChange={(e) => setForm((f) => ({ ...f, environment: e.target.value }))}
                >
                  <option value="production">{t("api_keys.production")}</option>
                  <option value="development">{t("api_keys.development")}</option>
                </select>
                <select
                  className="border rounded p-2 bg-background"
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                >
                  <option value="active">{t("api_keys.active")}</option>
                  <option value="inactive">{t("api_keys.inactive")}</option>
                </select>
                <div className="flex gap-2 justify-end mt-2">
                  <Button variant="ghost" onClick={() => setShowForm(false)}>
                    {t("common.cancel")}
                  </Button>
                  <Button disabled={!form.name || isCreating} onClick={handleCreate}>
                    {isCreating ? <Spinner className="mr-2" /> : null}
                    {isCreating ? t("common.creating") : t("common.create")}
                  </Button>
                </div>
              </div>
            )}

            {showApiKey && (
              <ApiKeyModal
                showModal={showApiKey}
                setShowModal={setShowApiKey}
                apiKey={newApiKey}
              />
            )}
          </CardHeader>
          <CardContent>
            {!workspace ? (
              <div className="text-center py-6 text-sm text-muted-foreground">
                {t("api_keys.select_workspace")}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left">{t("common.name")}</th>
                      <th className="p-3 text-left">{t("api_keys.key")}</th>
                      <th className="p-3 text-left">{t("common.created_at")}</th>
                      <th className="p-3 text-left">{t("common.environment")}</th>
                      <th className="p-3 text-left">{t("common.status")}</th>
                      <th className="p-3 text-right">{t("common.actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="h-24 text-center">
                          <Spinner className="mx-auto size-6" />
                        </td>
                      </tr>
                    ) : apiKeys.length > 0 ? (
                      apiKeys.map((key) => (
                        <tr key={key.key} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-3 font-medium">{key.name}</td>
                          <td className="p-3 font-mono text-xs">{key.key.slice(0, 8)}••••••••</td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {new Date(key.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-3 italic text-sm">{key.environment}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span
                                className={`size-2.5 rounded-full ${key.status === "active" ? "bg-green-500" : "bg-red-500"
                                  }`}
                              />
                              <span className="text-sm capitalize">{key.status}</span>
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(key.key)}
                            >
                              <IconTrash className="size-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="h-24 text-center text-muted-foreground">
                          {t("api_keys.no_keys")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};