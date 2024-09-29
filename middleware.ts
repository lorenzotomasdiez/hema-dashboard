import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { APP_PATH } from "./config/path";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const token = req.nextauth.token;
    if (token && !token.selectedCompanyId) {
      return NextResponse.redirect(new URL(APP_PATH.protected.chooseCompany, req.url));
    }
    return NextResponse.next();
  }, {
  callbacks: {
    authorized: async ({ token }) => !!token
  }
}
);

export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas excepto:
     * - api (rutas de API)
     * - _next/static (archivos estáticos)
     * - _next/image (archivos de optimización de imágenes)
     * - favicon.ico (archivo favicon)
     */
    // '/((?!api|_next/static|_next/image|favicon.ico).*)',
    //routes that does not match with publicRoutes array
    "/dashboard"

  ],
};
