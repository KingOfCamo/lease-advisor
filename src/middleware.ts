export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/clients/:path*",
    "/leases/:path*",
    "/portfolio/:path*",
    "/reports/:path*",
    "/enquiries/:path*",
    "/assistant/:path*",
    "/settings/:path*",
  ],
};
