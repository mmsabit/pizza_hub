/**
 * Fetch a list from the PizzaHub backend. Returns an empty array when the
 * request fails or the payload is not a list, so overview pages can render an
 * empty state instead of crashing.
 */
export async function fetchArray<T>(path: string, token?: string): Promise<T[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      cache: "no-store",
      headers: token ? { authorization: `Bearer ${token}` } : undefined,
    });

    if (!res.ok) return [];

    const data = await res.json();

    return Array.isArray(data) ? (data as T[]) : [];
  } catch {
    return [];
  }
}
