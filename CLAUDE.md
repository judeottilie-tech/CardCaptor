# CardCaptor

A trading-card binder-page layout editor. NSS fullstack capstone project. Users create "binder pages," each a grid of card slots, and fill them from a live Pokémon card catalog.

**Working directory is named `fullstack-capstone`** but the app/project is called **CardCaptor** (`CardCaptor.csproj`, `CardCaptor` namespace) — the directory itself was deliberately left unrenamed.

## Stack

- **Backend**: ASP.NET Core Web API (net10.0, controllers-style, not minimal APIs), EF Core 8 + Npgsql/Postgres, ASP.NET Identity with cookie auth.
- **Frontend**: `client/` — React + Vite + **Tailwind v3** (not v4 — see Gotchas).
- **Tests**: `CardCaptor.Tests/` (xUnit + `WebApplicationFactory` + Sqlite in-memory), `client/` Vitest + Testing Library.
- **Deploy**: API + Postgres on Render, client on Vercel. Live at `cardcaptor.vercel.app` / `cardcaptor.onrender.com`.

## Data model

- `UserProfile` — `DisplayName`, `IdentityUserId` FK, plus pet fields (`StarterPokemon`, `PetFeedCount`, `PetFullness`, `PetLastFedAt`).
- `BinderPage` — `Title`, `Description?`, `UserProfileId` FK, `CreatedAt`.
- `Card` — a large pre-imported catalog (~1,553 cards from the TCGdex API, see `Services/CardImportService.cs`), **not user-created**.
- `BinderPageCardSlot` — `Position`, `BinderPageId` FK, `CardId` FK **nullable** (null = empty slot).
- `SideboardCard` — per-user holding area for cards not currently placed in any slot (`UserProfileId` FK, `CardId` FK, `AddedAt`). Duplicates of the same card are allowed.

## Core patterns — follow these for any new feature

**Ownership checks, every time.** Every authenticated endpoint resolves the current user server-side from `ClaimTypes.NameIdentifier` (never a client-supplied id), looks up their `UserProfile`, then checks the target entity's owning `UserProfileId` matches before acting. On mismatch, always return `NotFound()`, never `Forbid()` — a wrong id and someone else's id must be indistinguishable to the caller. See `BinderPageController`/`BinderPageCardSlotController`/`SideboardController` for the exact shape to copy.

**Staged changes + explicit Save, not auto-persist.** Anything that resembles "arranging items" (card slot picks, sideboard placement) stages into local React state (`pendingSlots`, `pendingSideboardAdds`/`Removals`) and only hits the API when the user clicks a visible Save button. This was a deliberate, explicit choice after auto-save was tried and rejected — don't reintroduce silent persistence for this kind of interaction.

**Pointer Events for drag, not HTML5 DnD.** Native `draggable`/`dragstart`/`drop` never fires on touch devices. All drag interactions (slot-to-slot swap, slot↔sideboard) are built on `pointerdown`/`pointermove`/`pointerup` with a movement threshold to distinguish a drag from a tap, plus `document.elementFromPoint()` computed fresh at drop time (not an incrementally-tracked target, which can lag on fast drags). See `BinderPageDetail.jsx`'s drag effect. Also: `<img>` elements are draggable by default in every browser and will fight a custom pointer-drag system — always pair with `draggable={false}` and `style={{ WebkitUserDrag: "none" }}`.

## Gotchas — read before touching related code

- **Tailwind is pinned to v3, deliberately.** v4 had a severe bug where utility classes never generated. Do not suggest upgrading.
- **Flex items default to shrink-to-fit width, not fill-available-width.** A panel that used to be a plain block element (where `width: auto` fills available space up to `max-width`) behaves differently once it becomes a flex item (`width: auto` becomes shrink-to-content instead) — its resolved width can then vary based on content size (e.g. an image-heavy grid vs an empty one). If a panel needs a stable size inside a flex row, give it an explicit `width`, not just `max-width`.
- **CSS Grid items default to `min-width: auto`**, which lets a child with large intrinsic content (e.g. a real card `<img>`) overflow past its grid track's share. Add `min-w-0 min-h-0` to any grid-cell wrapper that contains an image.
- **The backend needs `--launch-profile https`** (`dotnet run --launch-profile https`) to bind `https://localhost:7257`, which is what the Vite dev proxy (`vite.config.js`) targets. Running plain `dotnet run` binds only the http-only default profile on port 5077 and the frontend proxy will fail with `ECONNREFUSED`.
- **The API process locks its build output while running** — `dotnet build`/`dotnet ef migrations`/`dotnet ef database update` will fail if the API is still running. Stop it first (`Stop-Process` the `dotnet`/`CardCaptor` process).
- **`Migrations/CardCaptorDbContextModelSnapshot.cs` can silently drift from the real database** (this happened once via a bad merge conflict resolution). If `dotnet ef migrations add` scaffolds unexpected `InsertData`/`UpdateData` against tables you didn't touch, stop and check for snapshot drift before applying — ground-truth against the live DB via `psql`, don't assume either the snapshot or `OnModelCreating` is correct. `dotnet ef migrations remove` reverts hand-edits to the snapshot, so fix it fresh right before the `migrations add` you intend to keep.
- **Don't run the full test suites after every small edit.** A `dotnet build` / `npm run build` compile check is enough while iterating. Run the full `dotnet test` / `npm test` suites at real milestones (end of a phase, before calling something done).

## Status as of 2026-08-10

Full MVP is live and has been for weeks: auth, binder pages, card slots, the live TCGdex card catalog, search/filter/paginated picker, a Pokémon starter-pet feature, the current "Michi-method" dark navy/neon kawaii theme, drag-and-drop slot rearranging, and a demo account that resets on login. Branch `feature/stretchy` is where new feature work is happening now.

**In progress — a 4-phase plan** (full design in the session that wrote it; ask if you need the original plan doc): sideboard → configurable grid layouts → public/private pages + profiles → likes.

- ✅ **Phase 1: Sideboard** — done and verified. Backend (`SideboardCard`, `SideboardController`), frontend (`Sideboard.jsx`, right-side panel on desktop, wrapping-grid layout with a fixed viewport-derived height so it never grows/scrolls or affects the main grid's size), and real Pointer Events drag both slot→sideboard and sideboard→slot (plus click-to-select as an accessible fallback). 32 backend tests, 29 frontend tests passing.
- ⏳ **Phase 2: Configurable layouts** — not started. `BinderPage` gains `Rows`/`Columns` from a fixed whitelist (3×3, 4×2, 4×8). Changeable after creation via a new `PUT /api/binderpage/{id}/layout` endpoint. **Depends on Phase 1**: when a layout shrinks, cards in the removed slots get moved to the sideboard automatically rather than deleted or blocking the resize.
- ⏳ **Phase 3: Public/private pages + profiles** — not started. `BinderPage.IsPublic`, a new `[AllowAnonymous]` `GET /api/binderpage/{id}/public`, and a new `ProfileController` for a public no-login profile page at `/u/{userName}` showing a user's public pages.
- ⏳ **Phase 4: Likes** — not started. `BinderPageLike` join entity (unique per page+user), like/unlike endpoints, self-likes blocked, a public "liked pages" list on the profile.

## Longer-term roadmap (not scoped in detail yet)

- Card-sleeve borders on slots, colored from an imported real sleeve-brand database (Dragon Shield etc.)
- An official Pokémon illustration image database as an additional card-art source
- Exporting a binder layout for external reference
- Importing from external collection trackers (e.g. TCGcollector) — highest-uncertainty item, needs research before design
- A cleaner, more specific card category system (by color/theme)

## Working agreements

- **Never push to `main` without explicit sign-off** — the user reviews and merges themself.
- **No AI co-author/contributor trailer on any commit**, ever, for this repo — sole authorship matters (portfolio/capstone submission).
- Keep code clean and simple; avoid premature abstraction.
- For Models/DTOs/controllers with real design decisions, default to asking who writes it (user vs. Claude) rather than assuming — the split has gone both ways across sessions depending on the feature.
