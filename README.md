# TransViet Analytics

Nền tảng Analytics SaaS chuyên nghiệp cho hiệu suất marketing Facebook — không phải dashboard nội bộ, mà là sản phẩm production-ready.

## Tính năng

- **Dashboard**: Hero, Filter Bar, KPI Grid, Performance Chart, Comparison, Radar, Insights, Data Table
- **KPI Engine**: Completion, Remaining, Forecast, Status, Recommendation tự động
- **AI Report**: Sinh báo cáo điều hành tiếng Việt — dùng AI Provider thật (Claude/OpenAI/Gemini) hoặc fallback rule-based khi chưa cấu hình key
- **Export**: Excel (KPI, Weekly Data), PDF (AI Report — có cover page, brand, header/footer, page number), PNG (Dashboard snapshot), Print
- **Settings**: Theme, Brand color, Logo, Data Source (Apps Script URL runtime-configurable), Backup/Restore cấu hình
- **Authentication**: Session ký HMAC (httpOnly cookie), middleware bảo vệ route
- Responsive, Dark Mode mặc định, Glassmorphism, Framer Motion animation

## Tech Stack

Next.js 15 (App Router) · TypeScript strict · TailwindCSS v4 · Shadcn UI (Radix primitives) · Framer Motion · TanStack Query + Table · Zustand · Recharts · React Hook Form + Zod · xlsx · @react-pdf/renderer · html-to-image

## Kiến trúc

```
Google Sheet → Apps Script (apps-script/) → Repository → Transformer → Service → Hook → Component
```

- **Repository Pattern**: mọi nguồn dữ liệu (Dashboard, KPI) đều có Mock Repository (demo ngay không cần setup) và Google Sheet Repository (thật) — chọn tự động qua `NEXT_PUBLIC_APPS_SCRIPT_URL` hoặc override runtime trong Settings.
- **Feature-first structure**: `src/features/{dashboard,kpi,report,authentication,settings,insights,export}` — mỗi feature có `components/hooks/services/types/utils/config` riêng.
- **Chart Engine**: `src/components/charts/` — Area/Bar/Radar/Donut/Sparkline dùng chung, không trùng lặp code giữa các section.
- **AI Provider abstraction**: `src/features/report/services/providers/` — Claude/OpenAI/Gemini implement chung 1 interface, secrets chỉ tồn tại server-side.

## Cấu trúc thư mục

```
src/
  app/                    # Routes (App Router), route groups (auth)/(dashboard), API routes
  components/
    ui/                   # Design system primitives
    charts/                # Chart Engine (Area/Bar/Radar/Donut/Sparkline)
    layout/                # Sidebar, Topbar, MobileSidebar
    shared/                # EmptyState, ErrorState, ChartContainer...
  features/               # Feature-first modules
  layouts/                # Layout compositions
  providers/              # Theme, Query, App providers
  stores/                 # Zustand UI state
  config/                 # Design tokens, routes, navigation, env
  lib/                    # Shared utilities (cn, session, export engines)
  styles/                 # globals.css — Design Tokens
apps-script/              # Google Apps Script backend (deploy riêng, xem apps-script/README.md)
```

## Bắt đầu

```bash
pnpm install
cp .env.example .env.local   # điền AUTH_USERNAME, AUTH_PASSWORD, AUTH_SESSION_SECRET
pnpm dev
```

Mặc định app chạy với **dữ liệu mẫu** (Mock Repository) — không cần Google Sheet để demo ngay.

### Kết nối Google Sheet thật

Xem hướng dẫn đầy đủ trong [`apps-script/README.md`](./apps-script/README.md). Sau khi deploy, điền `NEXT_PUBLIC_APPS_SCRIPT_URL` vào `.env.local` (hoặc cấu hình runtime trong trang Settings).

### Bật AI Report thật

Thêm vào `.env.local`:

```
AI_PROVIDER=claude   # hoặc openai | gemini
AI_API_KEY=sk-...
AI_MODEL=claude-sonnet-4-5
```

Không cấu hình → AI Report tự dùng bộ sinh báo cáo rule-based (vẫn đầy đủ 8 phần, dữ liệu thật).

## Scripts

```bash
pnpm dev            # Development server
pnpm build           # Production build
pnpm start           # Chạy bản production đã build
pnpm typecheck       # TypeScript strict check
pnpm lint            # ESLint
pnpm lint:fix        # ESLint tự sửa
pnpm format          # Prettier format
pnpm format:check    # Kiểm tra format
```

## Deploy lên Vercel

1. Push code lên GitHub.
2. Import repository vào Vercel.
3. Thêm Environment Variables (xem `.env.example`): `AUTH_USERNAME`, `AUTH_PASSWORD`, `AUTH_SESSION_SECRET` (bắt buộc), `NEXT_PUBLIC_APPS_SCRIPT_URL`, `AI_PROVIDER`/`AI_API_KEY`/`AI_MODEL` (tuỳ chọn).
4. Deploy — Vercel tự nhận diện Next.js, không cần cấu hình build thêm.

## License

Private
