1. System Architecture & Tech Stack
Framework: Next.js (React). Its server-side rendering is perfect for the public registration pages (great for SEO and sharing links), while its API routes can handle your backend logic and webhook ingestion.
Database: PostgreSQL. A relational database is mandatory here for ACID compliance when dealing with financial transactions and ticket inventory. Pair it with an ORM like Prisma or Drizzle for type-safe database queries.
Payments: Stripe or PayMongo (highly recommended if you are targeting the Philippine market). Both handle webhook events cleanly to update ticket statuses asynchronously.
Maps: Mapbox GL JS. It handles GPX/GeoJSON files beautifully for plotting race routes, elevation profiles, and interactive map markers.
2. Core Modules Breakdown
Registration & Ticketing
The Flow: User selects a distance category (e.g., 5K, 10K) -> fills out emergency contact and shirt size -> pays -> receives an email with a QR code.
Inventory Control: Implement a "reservation hold" (e.g., 10 minutes) in your database when a user reaches checkout so tickets don't oversell if a specific category is limited.
Organizer Dashboard
Event Management: Standard CRUD (Create, Read, Update, Delete) operations for creating runs, setting distances, and managing pricing tiers (e.g., Early Bird vs. Regular).
Race Day Ops: A lightweight, mobile-friendly view to scan participant QR codes (using a library like html5-qrcode) to mark runners as "Checked In" and hand over their physical race bib.
Maps & Routing
Visuals: Render the race route by parsing a standard GPX file provided by the race director.
Interactive Layers: Add toggleable markers for hydration stations, medical tents, and portalets so runners can plan their race.
Leaderboards & Timing
Data Ingestion: Professional runs use RFID timing chips that hit an API endpoint when a runner crosses a mat. Your system needs a webhook endpoint to receive these (bib_number, timestamp) payloads.
Live Updates: Use WebSockets, Server-Sent Events (SSE), or polling so the leaderboard updates on the screen without requiring a refresh as runners cross the finish line.
