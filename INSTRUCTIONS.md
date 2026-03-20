
# Supabase Migration Instructions

We have successfully migrated the frontend code to use Supabase. To finalize the setup, please follow these steps:

## 1. Run Database Schema
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your project (`reviewwithai-saas`).
3. Go to the **SQL Editor** (sidebar icon with `>_`).
4. Click **New Query**.
5. Copy the entire content of `supabase_schema.sql` from your project root.
6. Paste it into the SQL Editor and click **Run**.

## 2. Verify Connection
1. Open a new terminal in VS Code.
2. Run the verification script:
   ```bash
   node scripts/verify-schema.js
   ```
3. You should see a table showing **OK** for all tables.

## 3. Run the Application
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open the app in your browser.
3. Try **Login** (use any email/password to register a new user, or use the sample business if you manually create a user linked to it).
   - *Note: Since we migrated auth, previous local accounts are gone. You need to Register again.*

## 4. Admin Access
To access the Admin Panel:
1. Register a new user.
2. Go to Supabase **Table Editor** > `profiles`.
3. Find your user row and change the `role` column from `OWNER` to `ADMIN`.
4. Refresh the app and log in again. You will be redirected to the Admin Panel.
