/* =========================================================
   HabitFlow – Supabase / localStorage DB Abstraction
   ========================================================= */

'use strict';

// ── Supabase client (lazy-loaded) ─────────────────────
let _supabase = null;
function getClient() {
  if (_supabase) return _supabase;
  if (typeof window.supabase !== 'undefined' && !DEMO_MODE) {
    _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
  }
  return _supabase;
}

// ── localStorage helpers ──────────────────────────────
const LS = {
  get: (k, def = null) => {
    try { return JSON.parse(localStorage.getItem('hf_' + k)) ?? def; }
    catch { return def; }
  },
  set: (k, v) => localStorage.setItem('hf_' + k, JSON.stringify(v)),
  del: (k)    => localStorage.removeItem('hf_' + k),
};

// ── Default demo habits ───────────────────────────────
const DEFAULT_HABITS = [
  { id: 'h1', name: 'Drink Water',    icon: '💧', description: '8 glasses',  frequency: 'daily', reminderTime: '08:00', color: '#00b4d8', isActive: true, createdAt: '2025-01-01' },
  { id: 'h2', name: 'Meditate',       icon: '🧘', description: '10 minutes', frequency: 'daily', reminderTime: '07:30', color: '#7c3aed', isActive: true, createdAt: '2025-01-01' },
  { id: 'h3', name: 'Exercise',       icon: '🏋️', description: '30 minutes', frequency: 'daily', reminderTime: '06:30', color: '#dc2626', isActive: true, createdAt: '2025-01-01' },
  { id: 'h4', name: 'Read Book',      icon: '📖', description: '20 minutes', frequency: 'daily', reminderTime: '21:00', color: '#d97706', isActive: true, createdAt: '2025-01-01' },
  { id: 'h5', name: 'Healthy Food',   icon: '🥗', description: 'Eat clean',  frequency: 'daily', reminderTime: null,   color: '#16a34a', isActive: true, createdAt: '2025-01-01' },
  { id: 'h6', name: 'Sleep Early',    icon: '🌙', description: '8 hours',    frequency: 'daily', reminderTime: '22:00', color: '#1d4ed8', isActive: true, createdAt: '2025-01-01' },
  { id: 'h7', name: 'Learn Something',icon: '🧠', description: '30 minutes', frequency: 'daily', reminderTime: null,   color: '#be185d', isActive: true, createdAt: '2025-01-01' },
];

// ── Seed demo data ────────────────────────────────────
function seedDemoData() {
  if (LS.get('seeded')) return;
  LS.set('user', { id: 'demo', email: 'demo@habitflow.app', fullName: 'Habit Explorer', avatar: null });
  LS.set('habits', DEFAULT_HABITS);

  // Generate realistic log history for last 30 days
  const logs = [];
  const today = new Date();
  for (let d = 29; d >= 0; d--) {
    const date = new Date(today);
    date.setDate(today.getDate() - d);
    const ds = date.toISOString().split('T')[0];
    DEFAULT_HABITS.forEach(h => {
      // Give each habit random but convincing streaks
      const chance = h.id === 'h1' ? .88 : h.id === 'h6' ? .82 : h.id === 'h2' ? .75 : .7;
      if (Math.random() < chance) {
        logs.push({ id: crypto.randomUUID(), habitId: h.id, date: ds });
      }
    });
  }
  LS.set('logs', logs);
  LS.set('seeded', true);
}

// ══════════════════════════════════════════════════════
// PUBLIC API
// ══════════════════════════════════════════════════════
window.DB = {

  // ── Auth ────────────────────────────────────────────
  auth: {
    async login(email, password) {
      if (DEMO_MODE) {
        seedDemoData();
        LS.set('session', true);
        return { user: LS.get('user') };
      }
      const { data, error } = await getClient().auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },

    async signup(email, password, fullName) {
      if (DEMO_MODE) {
        seedDemoData();
        const u = { id: 'demo', email, fullName, avatar: null };
        LS.set('user', u); LS.set('session', true);
        return { user: u };
      }
      const { data, error } = await getClient().auth.signUp({ email, password, options: { data: { full_name: fullName } } });
      if (error) throw error;
      return data;
    },

    async logout() {
      if (DEMO_MODE) { LS.del('session'); return; }
      await getClient().auth.signOut();
    },

    async getUser() {
      if (DEMO_MODE) {
        if (!LS.get('session')) return null;
        return LS.get('user');
      }
      const { data } = await getClient().auth.getUser();
      return data?.user ?? null;
    },

    async updatePassword(newPassword) {
      if (DEMO_MODE) return;
      const { error } = await getClient().auth.updateUser({ password: newPassword });
      if (error) throw error;
    },
  },

  // ── Profile ─────────────────────────────────────────
  profile: {
    async get() {
      if (DEMO_MODE) return LS.get('user');
      const { data } = await getClient().auth.getUser();
      const uid = data?.user?.id;
      if (!uid) return null;
      const { data: p } = await getClient().from('profiles').select('*').eq('id', uid).single();
      return p;
    },

    async update(updates) {
      if (DEMO_MODE) {
        const u = { ...LS.get('user'), ...updates };
        LS.set('user', u); return u;
      }
      const { data } = await getClient().auth.getUser();
      const { error } = await getClient().from('profiles').upsert({ id: data.user.id, ...updates });
      if (error) throw error;
    },
  },

  // ── Habits ──────────────────────────────────────────
  habits: {
    async getAll() {
      if (DEMO_MODE) return LS.get('habits', []);
      const { data } = await getClient().auth.getUser();
      const { data: h, error } = await getClient().from('habits').select('*').eq('user_id', data.user.id).order('created_at');
      if (error) throw error;
      return h ?? [];
    },

    async create(habit) {
      if (DEMO_MODE) {
        const h = { id: crypto.randomUUID(), ...habit, createdAt: new Date().toISOString().split('T')[0], isActive: true };
        const list = LS.get('habits', []);
        list.push(h); LS.set('habits', list);
        return h;
      }
      const { data } = await getClient().auth.getUser();
      const { data: h, error } = await getClient().from('habits').insert({ user_id: data.user.id, ...habit }).select().single();
      if (error) throw error;
      return h;
    },

    async update(id, updates) {
      if (DEMO_MODE) {
        const list = LS.get('habits', []).map(h => h.id === id ? { ...h, ...updates } : h);
        LS.set('habits', list);
        return list.find(h => h.id === id);
      }
      const { data: h, error } = await getClient().from('habits').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return h;
    },

    async delete(id) {
      if (DEMO_MODE) {
        LS.set('habits', LS.get('habits', []).filter(h => h.id !== id));
        LS.set('logs', LS.get('logs', []).filter(l => l.habitId !== id));
        return;
      }
      const { error } = await getClient().from('habits').delete().eq('id', id);
      if (error) throw error;
    },
  },

  // ── Logs ────────────────────────────────────────────
  logs: {
    async getForDate(date) {
      if (DEMO_MODE) return LS.get('logs', []).filter(l => l.date === date);
      const { data } = await getClient().auth.getUser();
      const { data: l } = await getClient().from('habit_logs').select('*').eq('user_id', data.user.id).eq('completed_at', date);
      return l ?? [];
    },

    async getForMonth(year, month) {
      if (DEMO_MODE) {
        const prefix = `${year}-${String(month).padStart(2,'0')}`;
        return LS.get('logs', []).filter(l => l.date.startsWith(prefix));
      }
      const start = `${year}-${String(month).padStart(2,'0')}-01`;
      const end   = new Date(year, month, 0).toISOString().split('T')[0];
      const { data } = await getClient().auth.getUser();
      const { data: l } = await getClient().from('habit_logs').select('*').eq('user_id', data.user.id).gte('completed_at', start).lte('completed_at', end);
      return l ?? [];
    },

    async getForRange(startDate, endDate) {
      if (DEMO_MODE) return LS.get('logs', []).filter(l => l.date >= startDate && l.date <= endDate);
      const { data } = await getClient().auth.getUser();
      const { data: l } = await getClient().from('habit_logs').select('*').eq('user_id', data.user.id).gte('completed_at', startDate).lte('completed_at', endDate);
      return l ?? [];
    },

    async toggle(habitId, date) {
      if (DEMO_MODE) {
        const logs = LS.get('logs', []);
        const idx  = logs.findIndex(l => l.habitId === habitId && l.date === date);
        let completed;
        if (idx >= 0) { logs.splice(idx, 1); completed = false; }
        else          { logs.push({ id: crypto.randomUUID(), habitId, date }); completed = true; }
        LS.set('logs', logs);
        return completed;
      }
      const { data } = await getClient().auth.getUser();
      const uid = data.user.id;
      const { data: existing } = await getClient().from('habit_logs').select('id').eq('habit_id', habitId).eq('completed_at', date).eq('user_id', uid);
      if (existing?.length) {
        await getClient().from('habit_logs').delete().eq('id', existing[0].id);
        return false;
      } else {
        await getClient().from('habit_logs').insert({ habit_id: habitId, completed_at: date, user_id: uid });
        return true;
      }
    },

    isCompleted(logs, habitId, date) {
      return logs.some(l => (l.habitId || l.habit_id) === habitId && (l.date || l.completed_at) === date);
    },
  },

  // ── Rewards ─────────────────────────────────────────
  rewards: {
    async calculate() {
      const habits = await window.DB.habits.getAll();
      const today  = new Date().toISOString().split('T')[0];
      const todayLogs = await window.DB.logs.getForDate(today);

      const starShells    = todayLogs.length;
      const pearlOysters  = habits.length > 0 && todayLogs.length >= habits.filter(h => h.isActive !== false).length ? 1 : 0;

      // cumulative from all time
      const allLogs = LS.get('logs', []);
      const totalStars = allLogs.length;
      return { starShells, pearlOysters, totalStars };
    },
  },

  // ── Stats ────────────────────────────────────────────
  stats: {
    getStreak(logs, habitId) {
      const dates = [...new Set(
        logs.filter(l => (l.habitId || l.habit_id) === habitId)
            .map(l => l.date || l.completed_at)
      )].sort().reverse();

      if (!dates.length) return 0;
      let streak = 0;
      const today = new Date();
      for (let i = 0; i < dates.length; i++) {
        const expected = new Date(today);
        expected.setDate(today.getDate() - i);
        const exp = expected.toISOString().split('T')[0];
        if (dates[i] === exp) streak++;
        else break;
      }
      return streak;
    },

    getLongestStreak(logs, habitId) {
      const dates = [...new Set(
        logs.filter(l => (l.habitId || l.habit_id) === habitId)
            .map(l => l.date || l.completed_at)
      )].sort();

      if (!dates.length) return 0;
      let max = 1, cur = 1;
      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);
        const diff = (curr - prev) / 86400000;
        cur = diff === 1 ? cur + 1 : 1;
        if (cur > max) max = cur;
      }
      return max;
    },

    getCompletionRate(logs, habitId, days = 30) {
      const start = new Date();
      start.setDate(start.getDate() - days + 1);
      const startDate = start.toISOString().split('T')[0];
      const count = logs.filter(l =>
        (l.habitId || l.habit_id) === habitId &&
        (l.date || l.completed_at) >= startDate
      ).length;
      return Math.round((count / days) * 100);
    },

    async getOverallCurrentStreak() {
      const today = new Date();
      const logs  = LS.get('logs', []);
      const habits = await window.DB.habits.getAll();
      if (!habits.length) return 0;

      let streak = 0;
      for (let d = 0; d < 365; d++) {
        const date = new Date(today);
        date.setDate(today.getDate() - d);
        const ds = date.toISOString().split('T')[0];
        const dayLogs = logs.filter(l => l.date === ds);
        if (dayLogs.length > 0) streak++;
        else if (d > 0) break;
      }
      return streak;
    },
  },
};
