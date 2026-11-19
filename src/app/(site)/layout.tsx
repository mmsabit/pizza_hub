import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ToastContainer } from "react-toastify";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      <main className="w-full bg-dough-canvas">{children}</main>
      <SiteFooter />
      <ToastContainer />
    </>
  );
}
