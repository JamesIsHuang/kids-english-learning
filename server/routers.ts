import { router, publicProcedure, protectedProcedure } from "./trpc";
import { z } from "zod";
import {
  getUserLearningProgress,
  updateUserLearningProgress,
  getUserFavorites,
  addFavorite,
  removeFavorite,
  getUserAchievements,
  unlockAchievement,
} from "./db";

export const appRouter = router({
  // 学习进度相关API
  learning: router({
    /**
     * 获取用户的学习进度
     */
    getProgress: protectedProcedure.query(async ({ ctx }: any) => {
      try {
        const progress = await getUserLearningProgress(ctx.user.id);
        if (!progress) {
          // 如果没有进度记录，返回默认值
          return {
            alphabetLearned: 0,
            wordsLearned: 0,
            totalLearningTime: 0,
            consecutiveDays: 0,
            learnedWordIds: [],
          };
        }
        return progress;
      } catch (error) {
        console.error("Error getting learning progress:", error);
        throw error;
      }
    }),

    /**
     * 更新学习进度
     */
    updateProgress: protectedProcedure
      .input(
        z.object({
          alphabetLearned: z.number().optional(),
          wordsLearned: z.number().optional(),
          totalLearningTime: z.number().optional(),
          consecutiveDays: z.number().optional(),
          learnedWordIds: z.array(z.string()).optional(),
          lastLearningDate: z.date().optional(),
        })
      )
      .mutation(async ({ ctx, input }: any) => {
        try {
          await updateUserLearningProgress(ctx.user.id, {
            ...input,
            updatedAt: new Date(),
          });
          return { success: true };
        } catch (error) {
          console.error("Error updating learning progress:", error);
          throw error;
        }
      }),
  }),

  // 收藏夹相关API
  favorites: router({
    /**
     * 获取用户的收藏夹
     */
    list: protectedProcedure.query(async ({ ctx }: any) => {
      try {
        const favorites = await getUserFavorites(ctx.user.id);
        return favorites || [];
      } catch (error) {
        console.error("Error getting favorites:", error);
        throw error;
      }
    }),

    /**
     * 添加单词到收藏夹
     */
    add: protectedProcedure
      .input(
        z.object({
          wordId: z.string(),
          english: z.string(),
          pronunciation: z.string(),
          chinese: z.string(),
          category: z.string(),
        })
      )
      .mutation(async ({ ctx, input }: any) => {
        try {
          await addFavorite(ctx.user.id, {
            wordId: input.wordId,
            english: input.english,
            pronunciation: input.pronunciation,
            chinese: input.chinese,
            category: input.category,
            reviewCount: 0,
            masteryLevel: 0,
          });
          return { success: true };
        } catch (error) {
          console.error("Error adding favorite:", error);
          throw error;
        }
      }),

    /**
     * 从收藏夹删除单词
     */
    remove: protectedProcedure
      .input(
        z.object({
          wordId: z.string(),
        })
      )
      .mutation(async ({ ctx, input }: any) => {
        try {
          await removeFavorite(ctx.user.id, input.wordId);
          return { success: true };
        } catch (error) {
          console.error("Error removing favorite:", error);
          throw error;
        }
      }),
  }),

  // 成就相关API
  achievements: router({
    /**
     * 获取用户的成就
     */
    list: protectedProcedure.query(async ({ ctx }: any) => {
      try {
        const achievements = await getUserAchievements(ctx.user.id);
        return achievements || [];
      } catch (error) {
        console.error("Error getting achievements:", error);
        throw error;
      }
    }),

    /**
     * 解锁成就
     */
    unlock: protectedProcedure
      .input(
        z.object({
          achievementType: z.string(),
          name: z.string(),
          description: z.string().optional(),
          icon: z.string(),
        })
      )
      .mutation(async ({ ctx, input }: any) => {
        try {
          await unlockAchievement(ctx.user.id, {
            achievementType: input.achievementType,
            name: input.name,
            description: input.description,
            icon: input.icon,
          });
          return { success: true };
        } catch (error) {
          console.error("Error unlocking achievement:", error);
          throw error;
        }
      }),
  }),

  // 健康检查
  health: publicProcedure.query(() => {
    return { status: "ok" };
  }),
});

export type AppRouter = typeof appRouter;
