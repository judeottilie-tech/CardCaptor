# CardCaptor

a trading-card binder-page layout editor. create "binder pages" (grids of
card slots) and fill them from a live Pokémon card catalog. built as a
solo full-stack capstone project.

**live app:** [cardcaptor.vercel.app](https://cardcaptor.vercel.app)
-click **try Demo** on the login page for a no-signup walkthrough (the demo account resets itself on every login).

## Screenshots

<table>
<tr>
<td width="50%">

**login**
<img src="docs/screenshots/login.png" alt="login screen with a try demo option">

</td>
<td width="50%">

**dashboard**
<img src="docs/screenshots/dashboard.png" alt="dashboard listing a user's binder pages, with a pet Pokémon starter">

</td>
</tr>
<tr>
<td width="50%">

**card catalog search**
<img src="docs/screenshots/card-picker.png" alt="card picker modal searching the Pokémon card catalog">

</td>
<td width="50%">

**binder editor + sideboard**
<img src="docs/screenshots/binder-editor.png" alt="binder page grid filled with cards, with one card set aside in the sideboard panel">

</td>
</tr>
<tr>
<td width="50%">

**public profile**
<img src="docs/screenshots/public-profile.png" alt="a public, no-login-required profile page listing a user's public binder pages">

</td>
<td width="50%">

**public binder page**
<img src="docs/screenshots/public-binder.png" alt="a publicly shared, read-only binder page view">

</td>
</tr>
</table>

## features

- **binder pages** with configurable grid layouts (3×3, 4×2, 4×8), backed by a live catalog of ~1,553 real Pokémon cards imported from the [TCGdex API](https://tcgdex.dev/).
- **search & filter** the card catalog by name, category, and rarity in a paginated picker.
- **sideboard** — a per-user holding area for cards not currently placed in any slot, so rearranging a page doesn't mean losing cards.
- **drag-and-drop rearranging**, slot↔slot and slot↔sideboard, built on pointer Events so it works on touch as well as mouse (native HTML5 drag-and-drop doesn't fire on touch devices at all). click-to-select works as an accessible fallback.
- **staged changes with an explicit save** — arranging cards edits local state only. nothing hits the server until you save, so a change of mind is easy.
- **public profiles** at `/u/{username}` — showing a user's binder pages marked public, plus a read-only public view of each page.
- **a starter Pokémon pet** that levels up as you feed it (and evolves!).
- shrinking a layout doesn't delete cards, displaced cards move to the sideboard automatically.

## tech stack

**backend** — ASP.NET Core Web API (.NET 10, controller-style), EF Core 8 with Npgsql/Postgres, ASP.NET Identity with cookie auth.

**frontend** — React 19 + Vite, Tailwind CSS v3.

**tests** — xUnit + `WebApplicationFactory` + SQLite in-memory (backend), Vitest + Testing Library (frontend).

**deploy** — API + Postgres on AWS (ECS Fargate + RDS), client on Vercel.

## data model

- `UserProfile` — display name, linked Identity user, plus pet-related fields.
- `BinderPage` — title, description, layout (rows/columns), public/private flag, owned by a `UserProfile`.
- `Card` — the pre-imported catalog; not user-created.
- `BinderPageCardSlot` — one grid position on a binder page, optionally holding a `Card`.
- `SideboardCard` — a card a user has set aside outside of any binder page; duplicates allowed.

every authenticated endpoint resolves the current user server-side from their auth cookie, then checks that the resource being acted on actually belongs to them. a wrong ID and someone else's ID always look the same to the caller

## running it locally

**Prerequisites:** .NET 10 SDK, Node.js, a local Postgres instance.

```bash
# Backend (from the repo root) — the https profile is required, the
# frontend's Vite dev proxy targets https://localhost:7257
dotnet user-secrets set "CardCaptorDbConnectionString" "<your Postgres connection string>"
dotnet user-secrets set "FrontendUrl" "http://localhost:5173"
dotnet run --launch-profile https

# One-time: seed the card catalog from the TCGdex API (~1,553 cards)
dotnet run -- --import-cards

# Frontend (from client/)
npm install
npm run dev
```

Run the test suites with `dotnet test` (backend) and `npm test` (from `client/`, frontend).

## Roadmap

- **likes** — a like/unlike system on public binder pages (self-likes blocked), with a "liked pages" list on the profile.
- card-sleeve borders on slots, colored from an imported real sleeve-brand database.
- an official Pokémon illustration database as an additional card-art source.
- exporting a binder layout for external reference.
- importing from external collection trackers.
- a more specific card category system (by color/theme).
