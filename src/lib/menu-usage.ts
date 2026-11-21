export async function getMenuUsage(vendorId: string) {
  if (!vendorId) return { active: 0, total: 0 };

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/menus/${vendorId}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      throw new Error(`Failed to load menu usage: ${res.status}`);
    }

    const data: unknown = await res.json();
    if (!Array.isArray(data)) {
      throw new Error("Menu usage response must be an array.");
    }

    const items = data.filter(
      (item): item is { available?: boolean } =>
        typeof item === "object" && item !== null,
    );

    return {
      active: items.filter((item) => item.available === true).length,
      total: data.length,
    };
  } catch (error) {
    console.error("Failed to load menu usage:", error);
    return { active: 0, total: 0 };
  }
}
