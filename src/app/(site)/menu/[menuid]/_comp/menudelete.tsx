'use client'

import { PizzaType } from '@/app/type/type';
import { Trash2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import { toast, Bounce } from 'react-toastify';

const MenuDelete = ({ menu }: { menu: PizzaType }) => {

    const handleDelete = async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/menu/${menu._id}`,
          {
            method: "DELETE",
          },
        );
    
        if (res.ok) {
          toast.success(`${menu.name} successfully deleted`, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
    
          redirect("/");
        }
      };

    return (
        <>
        <button
        className="inline-flex items-center justify-center gap-space-xs rounded-xl border border-error/30 bg-error-container/40 px-space-md py-space-sm font-label-lg text-label-lg text-error transition-colors hover:bg-error-container"
        onClick={() =>
          (
            document.getElementById("deleteModal") as HTMLDialogElement
          )?.showModal()
        }
        type="button"
      >
        <Trash2 size={16} />
        Delete
      </button>


      <dialog id="deleteModal" className="modal">
        <div className="w-11/12 max-w-md rounded-3xl border border-surface-container-high bg-dough-canvas p-space-lg shadow-2xl">
          <h3 className="font-headline-sm text-headline-sm font-bold text-charcoal-dark">
            Delete item?
          </h3>
          <p className="py-space-md font-body-md text-body-md text-on-surface-variant">
            Are you sure you want to delete this item? This action is permanent
            and cannot be undone. All associated data will be permanently
            removed from the system.
          </p>
          <div className="flex flex-wrap justify-end gap-space-sm border-t border-surface-container-high pt-space-md">
            <button
              className="inline-flex items-center justify-center rounded-xl border border-outline-variant px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
              onClick={() =>
                (
                  document.getElementById("deleteModal") as HTMLDialogElement
                )?.close()
              }
              type="button"
            >
              Close
            </button>
            <button
              className="inline-flex items-center justify-center gap-space-xs rounded-xl bg-primary-container px-space-md py-space-sm font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:bg-primary hover:-translate-y-0.5"
              onClick={handleDelete}
              type="button"
            >
              <Trash2 size={16} />
              Are you sure?
            </button>
          </div>
        </div>
      </dialog>
        </>
    );
};

export default MenuDelete;