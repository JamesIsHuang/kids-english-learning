import { initTRPC, TRPCError } from "@trpc/server";

/**
 * 定义上下文类型
 */
export type Context = {
  user?: {
    id: string;
    email: string;
    name: string;
  };
};

/**
 * 创建上下文
 */
export const createContext = async (): Promise<Context> => {
  // 这里可以从请求头或cookie中获取用户信息
  // 暂时返回空上下文，后续集成Manus OAuth
  return {};
};

/**
 * 初始化tRPC
 */
const t = initTRPC.context<Context>().create();

/**
 * 公开过程（无需认证）
 */
export const publicProcedure = t.procedure;

/**
 * 受保护的过程（需要认证）
 */
export const protectedProcedure = t.procedure.use(async (opts: any) => {
  const { ctx } = opts;
  
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Please login first",
    });
  }
  
  return opts.next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

/**
 * 路由器
 */
export const router = t.router;

/**
 * 合并路由
 */
export const mergeRouters = t.mergeRouters;
