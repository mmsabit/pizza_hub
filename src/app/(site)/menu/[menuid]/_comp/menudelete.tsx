'use client'

import { PizzaType } from '@/app/type/type';
import { authClient } from '@/lib/auth-client';
import { Trash2, X } from 'lucide-react';
import { redirect } from 'next/navigation';
import { toast, Bounce } from 'react-toastify';

const MenuDelete = ({ menu }: { menu: PizzaType }) => {

    const handleDelete = async () => {
      const {data} = await authClient.token();
      const token = data?.token;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/menu/${menu._id}`,
          {
            method: "DELETE",
            headers:{
              authorization: `Bearer ${token}`
      }
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
        <div className="modal-box max-w-md">
          <form method="dialog">
            <button
              aria-label="Close dialog"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              type="submit"
            >
              <X size={16} />
            </button>
          </form>

          <h3 className="font-headline-sm text-headline-sm font-bold text-charcoal-dark">
            Delete item?
          </h3>
          <p className="py-space-md font-body-md text-body-md text-on-surface-variant">
            Are you sure you want to delete this item? This action is permanent
            and cannot be undone. All associated data will be permanently
            removed from the system.
          </p>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost">Close</button>
            </form>
            <button
              className="btn btn-error"
              onClick={handleDelete}
              type="button"
            >
              <Trash2 size={16} />
              Are you sure?
            </button>
          </div>
        </div>

        <form className="modal-backdrop" method="dialog">
          <button>close</button>
        </form>
      </dialog>
        </>
    );
};

export default MenuDelete;