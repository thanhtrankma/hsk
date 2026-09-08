// Placeholder session data for the logged-in ("app") UI shell.
//
// The real hanbeego.com stores this per-user in a database behind real auth.
// This clone has no backend, so every /(app) page renders from this single
// fake object instead. Swap this file for a real session/query once you wire
// up auth + a database.
export const mockSession = {
  displayName: "Học viên",
  levelLabel: "Level 1",
  membership: "free" as "free" | "premium",
  currentHsk: "HSK 1",
  overallProgressPct: 0,
  streakDays: 0,
  xpTotal: 0,
  hearts: "∞",
  joinedLabel: "hôm nay",
};

export const mockWeekStreak = [
  { day: "T2", done: false },
  { day: "T3", done: false },
  { day: "T4", done: false },
  { day: "T5", done: false },
  { day: "T6", done: false },
  { day: "T7", done: false },
  { day: "CN", done: false },
];

export const mockBadges = [
  { title: "Bài đầu tiên", desc: "Hoàn thành bài học đầu tiên.", unlocked: false },
  { title: "1 tuần kiên trì", desc: "Học 7 ngày liên tiếp.", unlocked: false },
  { title: "1 tháng không nghỉ", desc: "Học 30 ngày liên tiếp.", unlocked: false },
  { title: "100 từ vựng", desc: "Đã học 100 từ vựng.", unlocked: false },
  { title: "500 từ vựng", desc: "Đã học 500 từ vựng.", unlocked: false },
  { title: "HSK 1 hoàn thành", desc: "Hoàn thành toàn bộ bài học HSK 1.", unlocked: false },
];

// Sample-only leaderboard rows: fictional names, not real hanbeego members.
export const mockLeaderboard = [
  { rank: 1, name: "Học viên A", level: 12, xp: 4820 },
  { rank: 2, name: "Học viên B", level: 11, xp: 4510 },
  { rank: 3, name: "Học viên C", level: 10, xp: 3990 },
  { rank: 4, name: "Học viên D", level: 9, xp: 3400 },
  { rank: 5, name: "Học viên E", level: 8, xp: 3105 },
];
