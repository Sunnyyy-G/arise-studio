import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * PC / 移动 H5 双端自动切换（Next.js 16：middleware 已更名为 proxy）。
 *
 * - 移动设备访问 PC 路径（根 / 等）→ 引导到 /mobi/* 对应页面
 * - /mobi/* 始终放行（PC 评审设备框预览不受影响）
 * - 桌面 UA 不处理
 * - ?force=pc 或 cookie arise-force-pc=1 可强制留在 PC（评审用逃生口）
 *
 * 为什么用引导 HTML 而不是 307：URL 的 hash（如 /#projects）不会随请求发给
 * 服务端，307 会丢失它。引导页在浏览器端读 location.hash 映射到对应
 * /mobi/xxx 后 replace，保证「带 hash 的 PC 链接」也能落到正确移动端页面。
 * 客户端另有 MobiRedirect 组件覆盖 DevTools 切换设备未刷新的场景。
 */
const MOBILE_UA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|Windows Phone/i;

/* PC hash → 移动端路径（与 src/components/app/MobiRedirect.tsx 保持一致） */
const BOOT_HTML = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Arise Studio</title></head><body><script>
(function(){
  var map={home:'home',projects:'projects',resume:'resume',knowledge:'knowledge',about:'about',contact:'contact',privacy:'privacy','404':'404'};
  var h=location.hash.replace(/^#/,'');
  var seg=h?h.split('-'):[],p=seg[0],id=seg[1],target='/mobi/home';
  if(!h){target='/mobi/home'}
  else if(map[p]){target='/mobi/'+map[p]}
  else if((p==='project'||p==='article')&&id){target='/mobi/'+p+'-'+id}
  location.replace(target+location.search);
})();
</script><noscript><meta http-equiv="refresh" content="0;url=/mobi/home"></noscript></body></html>`;

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 已在移动端路由树：放行
  if (pathname === "/mobi" || pathname.startsWith("/mobi/")) {
    return NextResponse.next();
  }

  // 显式强制 PC：种 cookie 后放行，后续请求不再引导
  if (searchParams.get("force") === "pc" || request.cookies.get("arise-force-pc")?.value === "1") {
    const res = NextResponse.next();
    if (searchParams.get("force") === "pc") {
      res.cookies.set("arise-force-pc", "1", { path: "/", maxAge: 60 * 60 * 24, sameSite: "lax" });
    }
    return res;
  }

  const ua = request.headers.get("user-agent") || "";
  if (!MOBILE_UA.test(ua)) return NextResponse.next();

  // 移动设备访问 PC 路径：返回引导页，保留 hash 映射到对应 /mobi/xxx
  return new NextResponse(BOOT_HTML, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export const config = {
  // 排除静态资源与元数据文件，避免误拦截 CSS/JS/图片导致白屏
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
