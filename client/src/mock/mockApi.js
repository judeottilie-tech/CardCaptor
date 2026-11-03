// In-browser stand-in for the CardCaptor API, used while the real backend is
// offline. It intercepts every fetch to /api/* and answers it from a small
// database kept in localStorage, so each visitor gets their own sandbox that
// survives page reloads. Response shapes mirror the real controllers.

import { LAYOUTS } from "../data/binderPageLayouts";
import { STARTER_LINES } from "../data/pokemonStarters";

// Bump the version suffix whenever the seed data changes, so browsers holding
// an older copy re-seed instead of keeping the stale data.
const STORAGE_KEY = "cardcaptor-mock-db-v2";
const SESSION_KEY = "cardcaptor-mock-session";

const STAGE2_FEED_THRESHOLD = 10;
const STAGE3_FEED_THRESHOLD = 25;
const DECAY_PER_MINUTE = 0.4;
const MIN_FULLNESS = 15;
const FEED_AMOUNT = 22;

let cardsPromise;
const loadCards = () => {
  // Loaded on first use so the ~350KB catalog doesn't bloat the main bundle.
  cardsPromise ??= import("../data/cards.json").then((m) => m.default);
  return cardsPromise;
};

const hashPassword = async (password) => {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
};

// ---------- storage ----------

const readJson = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
};

const writeJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage blocked (private mode etc.) - the in-memory copy still works for this visit.
  }
};

let db;
let sessionUserId = null;

const save = () => writeJson(STORAGE_KEY, db);

const nextId = (table) => {
  db.nextIds[table] = (db.nextIds[table] ?? 0) + 1;
  return db.nextIds[table];
};

// ---------- seed data ----------

const buildSeed = async (cards) => {
  const cardId = (sourceId) => cards.find((c) => c.sourceId === sourceId)?.id ?? null;
  const now = new Date().toISOString();

  db = {
    nextIds: {},
    users: [],
    profiles: [],
    binderPages: [],
    slots: [],
    sideboard: [],
  };

  const addUser = async (userName, password, displayName, starterPokemon, petFeedCount) => {
    const user = { id: crypto.randomUUID(), userName, passwordHash: await hashPassword(password) };
    db.users.push(user);
    const profile = {
      id: nextId("profiles"),
      displayName,
      identityUserId: user.id,
      starterPokemon,
      petFeedCount,
      petFullness: 100,
      petLastFedAt: now,
    };
    db.profiles.push(profile);
    return profile;
  };

  const addPage = (profile, title, description, rows, columns, isPublic, sourceIds) => {
    const page = {
      id: nextId("binderPages"),
      title,
      description,
      rows,
      columns,
      isPublic,
      userProfileId: profile.id,
      createdAt: now,
    };
    db.binderPages.push(page);
    for (let position = 1; position <= rows * columns; position++) {
      const sourceId = sourceIds[position - 1];
      db.slots.push({
        id: nextId("slots"),
        position,
        binderPageId: page.id,
        cardId: sourceId ? cardId(sourceId) : null,
      });
    }
  };

  const demo = await addUser("DemoUser", "Demo1234", "Demo User", "Bulbasaur", 0);
  addPage(demo, "Demo Binder", "Oldies", 3, 3, true, [
    "base1-4", "base1-2", "base1-15",
    "base1-10", "base1-58", "base1-16",
    "base1-1", "base3-5", null,
  ]);
  addPage(demo, "Modern Chase Cards", "SWSH Secret Rares", 2, 2, false, [
    "swsh7-215", "swsh8-269", "swsh3.5-74", "swsh4-188",
  ]);
  for (const sourceId of ["base2-3", "neo4-9", "swsh12-211"]) {
    db.sideboard.push({ id: nextId("sideboard"), userProfileId: demo.id, cardId: cardId(sourceId), addedAt: now });
  }

  const ash = await addUser("AshK", "Pikachu1234", "Ash K.", "Charmander", 12);
  addPage(ash, "Eeveelutions & Friends", "A public page you can browse without logging in.", 2, 2, true, [
    "swsh7-212", "swsh7-214", "base2-3", "swsh12.5-160",
  ]);

  save();
};

const ensureDb = async () => {
  if (db) return;
  db = readJson(STORAGE_KEY);
  sessionUserId = readJson(SESSION_KEY);
  if (!db) await buildSeed(await loadCards());
};

// ---------- helpers ----------

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
const empty = (status) => new Response(null, { status });
const notFound = () => empty(404);

const currentProfile = () => {
  if (!sessionUserId) return null;
  return db.profiles.find((p) => p.identityUserId === sessionUserId) ?? null;
};

const getStage = (feedCount) =>
  feedCount >= STAGE3_FEED_THRESHOLD ? 3 : feedCount >= STAGE2_FEED_THRESHOLD ? 2 : 1;

const getCurrentStagePokemon = (starter, feedCount) => {
  const line = STARTER_LINES.find((l) => l.stage1.toLowerCase() === starter.toLowerCase());
  if (!line) return starter;
  return line[`stage${getStage(feedCount)}`];
};

const nextThresholdFor = (stage) =>
  stage === 1 ? STAGE2_FEED_THRESHOLD : stage === 2 ? STAGE3_FEED_THRESHOLD : null;

const decayedFullness = (profile) => {
  const minutes = (Date.now() - new Date(profile.petLastFedAt).getTime()) / 60000;
  return Math.max(MIN_FULLNESS, profile.petFullness - minutes * DECAY_PER_MINUTE);
};

const pageDto = ({ id, title, description, rows, columns, isPublic, userProfileId, createdAt }) => ({
  id, title, description, rows, columns, isPublic, userProfileId, createdAt,
  userProfile: null,
  binderPageCardSlots: null,
});

const pageWithSlotsDto = async (page) => {
  const cards = await loadCards();
  const slots = db.slots
    .filter((s) => s.binderPageId === page.id)
    .sort((a, b) => a.position - b.position)
    .map((s) => ({ ...s, binderPage: null, card: cards.find((c) => c.id === s.cardId) ?? null }));
  return { ...pageDto(page), binderPageCardSlots: slots };
};

const isValidLayout = (rows, columns) => LAYOUTS.some((l) => l.rows === rows && l.columns === columns);

// ---------- routes ----------

const handlers = {
  // auth
  "POST /auth/login": async ({ headers }) => {
    const auth = headers.get("Authorization") ?? "";
    let creds;
    try {
      creds = atob(auth.slice(6).trim());
    } catch {
      return empty(401);
    }
    const separator = creds.indexOf(":");
    const userName = creds.slice(0, separator);
    const password = creds.slice(separator + 1);
    const user = db.users.find((u) => u.userName === userName);
    if (!user || user.passwordHash !== (await hashPassword(password))) return empty(401);
    sessionUserId = user.id;
    writeJson(SESSION_KEY, sessionUserId);
    return empty(200);
  },

  "GET /auth/logout": () => {
    sessionUserId = null;
    writeJson(SESSION_KEY, null);
    return empty(200);
  },

  "GET /auth/me": () => {
    const profile = currentProfile();
    if (!profile) return empty(401);
    const user = db.users.find((u) => u.id === profile.identityUserId);
    return json({
      id: profile.id,
      displayName: profile.displayName,
      userName: user.userName,
      identityUserId: user.id,
    });
  },

  "POST /auth/register": async ({ body }) => {
    const { userName, password, displayName, starterPokemon } = body ?? {};
    if (!STARTER_LINES.some((l) => l.stage1.toLowerCase() === String(starterPokemon).toLowerCase())) {
      return json("Invalid starter Pokemon.", 400);
    }
    let plain;
    try {
      plain = atob(password);
    } catch {
      return json("Invalid password encoding.", 400);
    }
    if (!userName || !plain || db.users.some((u) => u.userName.toLowerCase() === userName.toLowerCase())) {
      return empty(500);
    }
    const user = { id: crypto.randomUUID(), userName, passwordHash: await hashPassword(plain) };
    db.users.push(user);
    db.profiles.push({
      id: nextId("profiles"),
      displayName,
      identityUserId: user.id,
      starterPokemon,
      petFeedCount: 0,
      petFullness: 100,
      petLastFedAt: new Date().toISOString(),
    });
    sessionUserId = user.id;
    writeJson(SESSION_KEY, sessionUserId);
    save();
    return empty(200);
  },

  // binder pages
  "GET /binderpage": ({ profile }) =>
    json(db.binderPages.filter((p) => p.userProfileId === profile.id).map(pageDto)),

  "GET /binderpage/:id": async ({ profile, id }) => {
    const page = db.binderPages.find((p) => p.id === id);
    if (!page || page.userProfileId !== profile.id) return notFound();
    return json(await pageWithSlotsDto(page));
  },

  "GET /binderpage/:id/public": async ({ id }) => {
    const page = db.binderPages.find((p) => p.id === id);
    if (!page || !page.isPublic) return notFound();
    return json(await pageWithSlotsDto(page));
  },

  "POST /binderpage": ({ profile, body }) => {
    const { title, description = null, rows = 3, columns = 3, isPublic = false } = body ?? {};
    if (!title || !title.trim()) return json("Title is required.", 400);
    if (!isValidLayout(rows, columns)) return json("Invalid layout.", 400);
    const page = {
      id: nextId("binderPages"),
      title,
      description,
      rows,
      columns,
      isPublic,
      userProfileId: profile.id,
      createdAt: new Date().toISOString(),
    };
    db.binderPages.push(page);
    for (let position = 1; position <= rows * columns; position++) {
      db.slots.push({ id: nextId("slots"), position, binderPageId: page.id, cardId: null });
    }
    save();
    return json(pageDto(page), 201);
  },

  "PUT /binderpage/:id": ({ profile, id, body }) => {
    const { title, description = null, isPublic = false } = body ?? {};
    if (!title || !title.trim()) return json("Title is required.", 400);
    const page = db.binderPages.find((p) => p.id === id);
    if (!page || page.userProfileId !== profile.id) return notFound();
    Object.assign(page, { title, description, isPublic });
    save();
    return empty(204);
  },

  "PUT /binderpage/:id/layout": async ({ profile, id, body }) => {
    const { rows, columns } = body ?? {};
    if (!isValidLayout(rows, columns)) return json("Invalid layout.", 400);
    const page = db.binderPages.find((p) => p.id === id);
    if (!page || page.userProfileId !== profile.id) return notFound();

    const newSlotCount = rows * columns;
    const pageSlots = db.slots.filter((s) => s.binderPageId === id);

    // Shrinking: cards in removed slots move to the sideboard instead of vanishing.
    const toRemove = pageSlots.filter((s) => s.position > newSlotCount);
    for (const slot of toRemove) {
      if (slot.cardId != null) {
        db.sideboard.push({
          id: nextId("sideboard"),
          userProfileId: profile.id,
          cardId: slot.cardId,
          addedAt: new Date().toISOString(),
        });
      }
    }
    db.slots = db.slots.filter((s) => !toRemove.includes(s));

    // Growing: add empty slots to fill out the new capacity.
    for (let position = pageSlots.length + 1; position <= newSlotCount; position++) {
      db.slots.push({ id: nextId("slots"), position, binderPageId: id, cardId: null });
    }

    page.rows = rows;
    page.columns = columns;
    save();
    return json(await pageWithSlotsDto(page));
  },

  "DELETE /binderpage/:id": ({ profile, id }) => {
    const page = db.binderPages.find((p) => p.id === id);
    if (!page || page.userProfileId !== profile.id) return notFound();
    db.binderPages = db.binderPages.filter((p) => p.id !== id);
    db.slots = db.slots.filter((s) => s.binderPageId !== id);
    save();
    return empty(204);
  },

  // card slots
  "PUT /binderpagecardslot/:id/card": ({ profile, id, body }) => {
    const slot = db.slots.find((s) => s.id === id);
    const page = slot && db.binderPages.find((p) => p.id === slot.binderPageId);
    if (!page || page.userProfileId !== profile.id) return notFound();
    slot.cardId = body?.cardId ?? null;
    save();
    return empty(204);
  },

  "DELETE /binderpagecardslot/:id/card": ({ profile, id }) => {
    const slot = db.slots.find((s) => s.id === id);
    const page = slot && db.binderPages.find((p) => p.id === slot.binderPageId);
    if (!page || page.userProfileId !== profile.id) return notFound();
    slot.cardId = null;
    save();
    return empty(204);
  },

  // card catalog
  "GET /card": async ({ query }) => {
    const cards = await loadCards();
    const search = query.get("search")?.trim().toLowerCase();
    const category = query.get("category");
    const rarity = query.get("rarity");
    const era = query.get("era");
    const page = Math.max(1, parseInt(query.get("page")) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(query.get("pageSize")) || 60));

    const filtered = cards.filter(
      (c) =>
        (!search || c.name.toLowerCase().includes(search)) &&
        (!category || c.category === category) &&
        (!rarity || c.rarity === rarity) &&
        (!era || c.era === era),
    );
    return json({
      totalCount: filtered.length,
      cards: filtered.slice((page - 1) * pageSize, page * pageSize),
    });
  },

  // pet
  "GET /pet": ({ profile }) => {
    const stage = getStage(profile.petFeedCount);
    return json({
      starterPokemon: profile.starterPokemon,
      currentPokemon: getCurrentStagePokemon(profile.starterPokemon, profile.petFeedCount),
      stage,
      feedCount: profile.petFeedCount,
      fullness: decayedFullness(profile),
      nextThreshold: nextThresholdFor(stage),
    });
  },

  "POST /pet/feed": ({ profile }) => {
    const stageBefore = getStage(profile.petFeedCount);
    profile.petFullness = Math.min(100, decayedFullness(profile) + FEED_AMOUNT);
    profile.petLastFedAt = new Date().toISOString();
    profile.petFeedCount += 1;
    save();
    const stageAfter = getStage(profile.petFeedCount);
    return json({
      starterPokemon: profile.starterPokemon,
      currentPokemon: getCurrentStagePokemon(profile.starterPokemon, profile.petFeedCount),
      stage: stageAfter,
      feedCount: profile.petFeedCount,
      fullness: profile.petFullness,
      nextThreshold: nextThresholdFor(stageAfter),
      evolved: stageAfter > stageBefore,
    });
  },

  // public profile
  "GET /profile/:userName": ({ userName }) => {
    const user = db.users.find((u) => u.userName === userName);
    const profile = user && db.profiles.find((p) => p.identityUserId === user.id);
    if (!profile) return notFound();
    return json({
      displayName: profile.displayName,
      userName: user.userName,
      currentPokemon: getCurrentStagePokemon(profile.starterPokemon, profile.petFeedCount),
      stage: getStage(profile.petFeedCount),
      binderPages: db.binderPages
        .filter((p) => p.userProfileId === profile.id && p.isPublic)
        .map(({ id, title, description, rows, columns, createdAt }) => ({
          id, title, description, rows, columns, createdAt,
        })),
    });
  },

  // sideboard
  "GET /sideboard": async ({ profile }) => {
    const cards = await loadCards();
    return json(
      db.sideboard
        .filter((sc) => sc.userProfileId === profile.id)
        .map((sc) => ({ ...sc, userProfile: null, card: cards.find((c) => c.id === sc.cardId) ?? null })),
    );
  },

  "POST /sideboard": ({ profile, body }) => {
    const entry = {
      id: nextId("sideboard"),
      userProfileId: profile.id,
      cardId: body?.cardId,
      addedAt: new Date().toISOString(),
    };
    db.sideboard.push(entry);
    save();
    return json({ ...entry, userProfile: null, card: null }, 201);
  },

  "DELETE /sideboard/:id": ({ profile, id }) => {
    const entry = db.sideboard.find((sc) => sc.id === id);
    if (!entry || entry.userProfileId !== profile.id) return notFound();
    db.sideboard = db.sideboard.filter((sc) => sc.id !== id);
    save();
    return empty(204);
  },
};

// Endpoints the real API serves without [Authorize].
const ANONYMOUS = new Set([
  "POST /auth/login",
  "POST /auth/register",
  "GET /binderpage/:id/public",
  "GET /profile/:userName",
]);

const routes = Object.keys(handlers).map((key) => {
  const [method, pattern] = key.split(" ");
  const paramNames = [];
  const regex = new RegExp(
    "^" +
      pattern.replace(/:(\w+)/g, (_, name) => {
        paramNames.push(name);
        return "([^/]+)";
      }) +
      "/?$",
    "i",
  );
  return { key, method, regex, paramNames };
});

const handle = async (method, path, query, headers, body) => {
  await ensureDb();
  for (const route of routes) {
    if (route.method !== method) continue;
    const match = path.match(route.regex);
    if (!match) continue;

    const params = {};
    route.paramNames.forEach((name, i) => {
      const raw = decodeURIComponent(match[i + 1]);
      params[name] = name === "id" ? Number(raw) : raw;
    });

    const profile = currentProfile();
    if (!ANONYMOUS.has(route.key) && !profile) return empty(401);

    return handlers[route.key]({ ...params, profile, query, headers, body });
  }
  return notFound();
};

export const installMockApi = () => {
  const realFetch = window.fetch.bind(window);

  window.fetch = async (input, init = {}) => {
    const url = new URL(typeof input === "string" ? input : input.url, window.location.origin);
    if (url.origin !== window.location.origin || !url.pathname.toLowerCase().startsWith("/api/")) {
      return realFetch(input, init);
    }

    init.signal?.throwIfAborted();

    const method = (init.method ?? "GET").toUpperCase();
    const headers = new Headers(init.headers);
    let body = null;
    if (typeof init.body === "string") {
      try {
        body = JSON.parse(init.body);
      } catch {
        body = null;
      }
    }

    return handle(method, url.pathname.slice(4), url.searchParams, headers, body);
  };
};
