export const checkHealth = async () => {
  try {
    const res = await fetch("http://localhost:5000/health", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result?.message || "Health check failed");

    return result;
  } catch (error: any) {
    console.error("Health check error:", error);
    throw new Error(error?.message || "Health check failed");
  }
};