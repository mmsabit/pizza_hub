import { StatusType } from "@/app/type/type";
import React from "react";


const AdminStatusBadge = ({ status }: StatusType) => {
  return (
    <>
      <span
        className={`inline-flex w-fit items-center gap-space-xs rounded-full px-space-sm py-space-xs font-label-sm text-label-sm font-bold ${
          status === "pending"
            ? "bg-yellow-100 text-on-tertiary-fixed"
            : status === "rejected"
              ? "bg-red-300 text-on-tertiary-fixed"
              : "bg-tertiary-fixed text-on-tertiary-fixed"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            status === "pending"
              ? "bg-yellow-500"
              : status === "rejected"
                ? "bg-error"
                : "bg-tertiary"
          }`}
        />
        {status}
      </span>
    </>
  );
};

export default AdminStatusBadge;
