export const ROLES = ["user", "vendor", "admin"] as const;

export type Role = (typeof ROLES)[number];

export type RoleUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

export function normalizeRole(value: unknown): Role {
  return ROLES.includes(value as Role) ? (value as Role) : "user";
}

export function roleLabel(value: unknown): string {
  const role = normalizeRole(value);

  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function homeForRole(value: unknown): string {
  switch (normalizeRole(value)) {
    case "vendor":
      return "/vendor/dashboard";
    case "admin":
      return "/admin/dashboard";
    default:
      return "/dashboard";
  }
}
