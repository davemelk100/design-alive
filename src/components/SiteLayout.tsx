import { Outlet, useLocation } from "react-router-dom";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import SiteNav from "./SiteNav";

export default function SiteLayout() {
  const { pathname } = useLocation();
  const isEditor = pathname === "/editor";

  return (
    <>
      <SiteHeader />
      {isEditor ? (
        <Outlet />
      ) : (
        <div className="flex flex-1 w-full mx-auto site-container">
          <SiteNav />
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      )}
      <SiteFooter />
    </>
  );
}
