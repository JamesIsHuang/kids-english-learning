import { mysqlTable, varchar, int, timestamp, boolean, text, json } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * 用户表
 * 存储用户基本信息和认证数据
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  avatar: varchar("avatar", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

/**
 * 学习进度表
 * 存储用户的学习进度（字母、单词、统计数据）
 */
export const learningProgress = mysqlTable("learning_progress", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // 字母学习进度
  alphabetLearned: int("alphabet_learned").default(0).notNull(),
  
  // 单词学习进度
  wordsLearned: int("words_learned").default(0).notNull(),
  
  // 统计数据
  totalLearningTime: int("total_learning_time").default(0).notNull(), // 分钟
  consecutiveDays: int("consecutive_days").default(0).notNull(),
  lastLearningDate: timestamp("last_learning_date"),
  
  // 学习的单词ID列表（JSON格式）
  learnedWordIds: json("learned_word_ids").default([]).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

/**
 * 收藏夹表
 * 存储用户收藏的单词
 */
export const favorites = mysqlTable("favorites", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // 单词信息
  wordId: varchar("word_id", { length: 100 }).notNull(),
  english: varchar("english", { length: 255 }).notNull(),
  pronunciation: varchar("pronunciation", { length: 255 }).notNull(),
  chinese: varchar("chinese", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  
  // 复习统计
  reviewCount: int("review_count").default(0).notNull(),
  lastReviewedAt: timestamp("last_reviewed_at"),
  masteryLevel: int("mastery_level").default(0).notNull(), // 0-100
  
  addedAt: timestamp("added_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

/**
 * 成就徽章表
 * 存储用户解锁的成就
 */
export const achievements = mysqlTable("achievements", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  achievementType: varchar("achievement_type", { length: 100 }).notNull(), // "first_word", "10_words", "100_words", etc.
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 10 }).notNull(), // emoji
  
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

/**
 * 关系定义
 */
export const usersRelations = relations(users, ({ one, many }) => ({
  learningProgress: many(learningProgress),
  favorites: many(favorites),
  achievements: many(achievements),
}));

export const learningProgressRelations = relations(learningProgress, ({ one }) => ({
  user: one(users, {
    fields: [learningProgress.userId],
    references: [users.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
}));

export const achievementsRelations = relations(achievements, ({ one }) => ({
  user: one(users, {
    fields: [achievements.userId],
    references: [users.id],
  }),
}));
