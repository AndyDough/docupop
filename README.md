# Project Overview

This is a Next.js project called "Docupop". Based on the homepage, it appears to be a tool for parsing and organizing documents.

The project is built with:

- **Framework:** [Next.js](https://nextjs.org/) (using the App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) with Google Provider
- **Database:** [PostgreSQL](https://www.postgresql.org/) (via Docker)

The project structure follows the standard Next.js App Router conventions.

# Building and Running

To get the project running locally, follow these steps:

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Start the database:**
    Make sure you have [Docker](https://www.docker.com/) installed and running. Then, start the PostgreSQL database with:

    ```bash
    docker-compose up -d
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the following variables:

    ```
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/docupop"
    ```

    You can get the Google credentials from the [Google API Console](https.console.developers.google.com/).

4.  **Set up the database table:**

    ```bash
    npm run db:setup
    ```

    This will create the `documents` table in your database.

5.  **Run the development server:**

    ```bash
    npm run dev
    ```

    This will start the development server on [http://localhost:3000](http://localhost:3000).

6.  **Build for production:**

    ```bash
    npm run build
    ```

7.  **Start the production server:**
    ```bash
    npm run start
    ```

# Development Conventions

- **Linting:** The project uses ESLint for code quality. You can run the linter with:
  ```bash
  npm run lint
  ```
- **Formatting:** The project uses Prettier for code formatting. It's recommended to set up your editor to format on save.
- **Component Structure:** UI components are located in the `components` directory, with `shadcn/ui` components in `components/ui`.
- **API Routes:** API routes are located in the `app/api` directory.
- **Authentication:** Authentication is handled by NextAuth.js. The configuration is in `app/api/auth/[...nextauth]/route.ts`.
- **Database:** The project uses a PostgreSQL database running in a Docker container. The configuration for the container is in `docker-compose.yml`. The database connection is managed in `lib/db.ts`. The table creation script is in `scripts/create-table.js`.
