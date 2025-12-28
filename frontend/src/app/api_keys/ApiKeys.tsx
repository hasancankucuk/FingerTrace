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
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "react-i18next";
import { useWorkspace } from "@/hooks/useWorkspace";
import type { ApiKey } from "@/utils/apiHelpers";
import { isApiKey, isApiKeyArray, isObject, getErrorMessage } from "@/utils/apiHelpers";
import { ApiKeyModal } from "./ApiKeyModal";

export const ApiKeys = () => {
  const { workspace } = useWorkspace();
  const { t } = useTranslation();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [newApiKey, setNewApiKey] = useState<ApiKey | null>(null);
  const [form, setForm] = useState({
    name: "",
    environment: "production",
    status: "active",
  });

  useEffect(() => {
    const fetchApiKeys = async () => {
      if (!workspace) {
        setApiKeys([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await getApiKeys(String(workspace.id));
        let list: ApiKey[] = [];
        if (isApiKeyArray(data)) list = data;
        else if (isObject(data)) {
          const maybe = "api_keys" in data
            ? (data as Record<string, unknown>)["api_keys"]
            : "items" in data
              ? (data as Record<string, unknown>)["items"]
              : undefined;
          if (isApiKeyArray(maybe)) list = maybe;
          else if (isApiKey(maybe)) list = [maybe];
        }
        setApiKeys(list);
      } catch (err) {
        toast.error(getErrorMessage(err) || t("api_keys.toast.failed_load"));
        setApiKeys([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApiKeys();
  }, [workspace]);

  const handleCreate = async () => {
    if (!workspace) {
      toast.error(t("api_keys.toast.select_workspace"));
      return;
    }
    setLoading(true);
    try {
      const rawResponse = await createApiKey(form, String(workspace.id));
      let newKey: ApiKey | undefined;

      if (isApiKey(rawResponse)) {
        newKey = rawResponse;
      } else if (isObject(rawResponse)) {
        const apiKeyData = rawResponse["api_key"];
        if (isApiKey(apiKeyData)) {
          newKey = apiKeyData;
        }
      }

      if (!newKey) {
        let message = t("api_keys.toast.failed_create");
        if (isObject(rawResponse)) {
          message = (rawResponse.error as string) || (rawResponse.message as string) || message;
        }
        toast.error(message);
        console.warn("API key creation response:", rawResponse);
        return;
      }
      setNewApiKey(newKey);
      setApiKeys((keys) => [newKey, ...keys]);
      setShowForm(false);
      setForm({ name: "", environment: "production", status: "active" });
      toast.success(t("api_keys.toast.created"));
      setShowApiKey(true);
    } catch (err) {
      toast.error(getErrorMessage(err) || t("api_keys.toast.failed_create"));
      console.error("API key creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!workspace) {
      toast.error(t("api_keys.toast.select_workspace"));
      return;
    }
    setLoading(true);
    try {
      await deleteApiKey(key);
      setApiKeys((keys) => keys.filter((k) => k.key !== key));
      toast.success(t("api_keys.toast.deleted"));
    } catch (err) {
      toast.error(getErrorMessage(err) || t("api_keys.toast.failed_delete"));
    } finally {
      setLoading(false);
    }
  };

  const keysList = Array.isArray(apiKeys) ? apiKeys : [];

  return (
    <>
      <Toaster />
      <div className="mx-w-4xl mx-auto space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("api_keys.title")}</CardTitle>
            <CardDescription>{t("api_keys.description")}</CardDescription>
            <div className="flex flex-wrap items-center gap-2 md:flex-row justify-end">
              <Button
                onClick={() => setShowForm((v) => !v)}
                disabled={!workspace}
              >
                {t("api_keys.generate_key")}
              </Button>
            </div>
            {showForm && (
              <div className="mt-4 flex flex-col gap-2">
                <input
                  className="border rounded p-2"
                  placeholder={t("common.name")}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                <select
                  className="border rounded p-2"
                  value={form.environment}
                  onChange={(e) => setForm((f) => ({ ...f, environment: e.target.value }))}
                >
                  <option value="production">{t("api_keys.production")}</option>
                  <option value="development">{t("api_keys.development")}</option>
                </select>
                <select
                  className="border rounded p-2"
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                >
                  <option value="active">{t("api_keys.active")}</option>
                  <option value="inactive">{t("api_keys.inactive")}</option>
                </select>
                <Button disabled={!form.name || loading} onClick={handleCreate}>
                  {loading ? t("common.creating") : t("common.create")}
                </Button>
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
              <div className="mt-2 text-sm text-muted-foreground">
                {t("api_keys.select_workspace")}
              </div>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th>{t("common.name")}</th>
                    <th>{t("api_keys.key")}</th>
                    <th>{t("common.created_at")}</th>
                    <th>{t("common.environment")}</th>
                    <th>{t("common.status")}</th>
                    <th>{t("common.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {keysList.length > 0
                    ? keysList.map((key) => (
                      <tr key={key.key}>
                        <td>{key.name}</td>
                        <td>{key.key.slice(0, 5) + "..."}</td>
                        <td>{new Date(key.created_at).toLocaleString()}</td>
                        <td>{key.environment.charAt(0).toUpperCase() + key.environment.slice(1)}</td>
                        <td>
                          <span
                            style={{
                              display: "inline-block",
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              backgroundColor: key.status === "active" ? "#22c55e" : "#ef4444",
                              marginRight: "6px",
                              verticalAlign: "middle",
                            }}
                          />
                          {key.status.charAt(0).toUpperCase() + key.status.slice(1)}
                        </td>
                        <td>
                          <Button variant="outline" onClick={() => handleDelete(key.key)}>
                            <IconTrash />
                          </Button>
                        </td>
                      </tr>
                    ))
                    : null}
                </tbody>
              </Table>
            )}
            {loading && (
              <div className="flex justify-center p-4">
                <Spinner className="size-8 text-primary" />
              </div>
            )}
            {!loading && workspace && keysList.length === 0 && (
              <div className="mt-2 text-sm text-muted-foreground">{t("api_keys.no_keys")}</div>
            )}
            {/* error toast handled by Sonner */}
          </CardContent>
        </Card>
      </div>
    </>
  );
};
