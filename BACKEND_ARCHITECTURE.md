# Wanderpals Backend Architecture Design

You are acting as a senior backend architect. This document outlines the full-scale backend architecture for the Wanderpals travel platform, leveraging Supabase and Next.js.

---

## 🏗️ Architecture Overview (Text Diagram)

```text
[ Clients (Web/PWA) ]
      |
      v
[ Netlify (Hosting) ] <--> [ Next.js Edge / API Routes (Business Logic) ]
      |                             |
      |          +------------------+------------------+
      |          |                  |                  |
      v          v                  v                  v
[ Supabase Auth ] [ Supabase DB ] [ Supabase Storage ] [ Supabase Realtime ]
      |             (PostgreSQL)      (Images/Media)     (Notifications)
      |                  ^
      |                  |
      +------- [ RLS Policies (Security) ] -------+
```

---

## 1️⃣ Database Schema (PostgreSQL)

### Core Tables

#### `users` (Managed by Supabase Auth, but synced to public schema)
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid | Primary Key (references auth.users.id) |
| `email` | text | Unique email address |
| `role` | enum | 'user', 'admin', 'superadmin' |
| `created_at` | timestamp | Creation date |

#### `profiles`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid | Primary Key (references users.id) |
| `full_name` | text | User's full name |
| `avatar_url` | text | Link to profile image |
| `bio` | text | Short bio |
| `whatsapp_number` | text | For notifications |

#### `trips` (Journeys)
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid | Primary Key |
| `title` | text | Journey title |
| `description` | text | Detailed description |
| `region` | text | Geographic region |
| `terrain` | text | Type of environment (mountain, forest, etc.) |
| `duration` | int | Number of days |
| `price` | decimal | Base price |
| `max_group_size`| int | Max travelers |
| `status` | enum | 'draft', 'published', 'archived' |

#### `bookings`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid | Primary Key |
| `user_id` | uuid | Reference to users.id |
| `trip_id` | uuid | Reference to trips.id |
| `status` | enum | 'pending', 'confirmed', 'cancelled', 'completed' |
| `payment_status`| enum | 'unpaid', 'partial', 'paid', 'refunded' |
| `total_amount` | decimal | Final price paid |

#### `memories`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid | Primary Key |
| `user_id` | uuid | Reference to users.id (owner) |
| `trip_id` | uuid | Reference to trips.id |
| `content` | text | Caption/Post text |
| `media_urls` | jsonb | Array of links to storage |
| `visibility` | enum | 'public', 'private', 'friends' |

---

## 2️⃣ Supabase RLS Policies (Security Layers)

### `trips` table
- **SELECT**: `true` (if status = 'published')
- **ALL**: `auth.uid() IN (SELECT id FROM users WHERE role = 'admin')`

### `bookings` table
- **SELECT**: `auth.uid() = user_id` OR `isAdmin()`
- **INSERT**: `auth.uid() IS NOT NULL` (authenticated users only)
- **UPDATE**: `isAdmin()` (users cannot change their own booking status)

### `memories` table
- **SELECT**: 
  - `visibility = 'public'`
  - OR `auth.uid() = user_id`
  - OR (`visibility = 'friends'` AND `isFriend(auth.uid(), user_id)`)
  - OR `isAdmin()`

### Helper Functions (SQL)
```sql
CREATE FUNCTION isAdmin() RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
  );
$$ LANGUAGE sql SECURITY DEFINER;
```

---

## 3️⃣ API Architecture (Next.js Routes)

| Category | Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | POST | `/api/auth/login` | None | Handle session creation |
| **Trips** | GET | `/api/trips` | None | Public trip listing |
| **Trips** | POST | `/api/admin/trips` | Admin | Create new journey |
| **Booking** | POST | `/api/bookings` | User | Create a new booking |
| **Memories**| POST | `/api/memories` | User | Upload new memory |
| **Admin** | GET | `/api/admin/stats` | Admin | Dashboard analytics |

---

## 4️⃣ Security Architecture

1.  **JWT Validation**: Use Supabase Auth middleware to validate every request to `/api/admin/*` and protected user routes.
2.  **Server-Side Guards**: Never rely on `router.push` alone. Every Page must use `getServerSideProps` or Middleware to verify authentication before rendering.
3.  **Direct URL Protection**: Implement RLS on the `memories` table so that even if a URL is leaked, the database returns no data for unauthorized users.
4.  **Rate Limiting**: Implement Netlify Edge Functions or Upstash to limit API requests from single IPs.

---

## 5️⃣ Automation & Background Jobs

-   **Email Automation**: Triggered via Supabase Edge Functions on `bookings` (status change) using Resend/SendGrid.
-   **WhatsApp**: Use Twilio/Interakt API to send booking confirmations.
-   **AI Itineraries**: Background worker that processes `trip` descriptions to generate day-by-day AI guides.

---

## 6️⃣ DevOps & Implementation Order

### Phase 1: Security Hardening (COMPLETED)
1.  Enable RLS on all tables. (Done via `supabase_setup.sql`)
2.  Implement `isAdmin()` helper function. (Done)
3.  Apply strict SELECT policies on `memories` and `bookings`. (Done)

### Phase 2: API Refactoring (COMPLETED)
1.  Move sensitive logic from frontend to `app/api/`. (Done: Auth, Bookings, Profile APIs created)
2.  Setup Middleware for `/admin` and `/memories` routes. (Done)

### Phase 3: Automation (CURRENT FOCUS)
1.  Connect Edge Functions / API routes for emails (Resend).
2.  Integrate WhatsApp notification triggers (Interakt/Twilio).
3.  Setup Storage buckets with protected access.


---

## 7️⃣ Future Scalability

-   **Search**: Integrate **Algolia** or **Typesense** for high-performance trip search if `trips` table exceeds 1000 entries.
-   **Caching**: Implement **Redis** (Upstash) for Frequently Accessed public trip data to save Supabase read units.
-   **Microservices**: If booking logic becomes complex (tax, multi-currency), spin off a dedicated Node.js microservice.
