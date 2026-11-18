import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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
