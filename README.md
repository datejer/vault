# Vault

Vault is a simple, self-hosted, and open-source encrypted data vault. It allows users to securely store and manage their sensitive data with ease.

## Table of Contents

- [Vault](#vault)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Development Server](#running-the-development-server)
    - [Building for Production](#building-for-production)
    - [Database Migrations](#database-migrations)
    - [Linting and Formatting](#linting-and-formatting)
  - [Contributing](#contributing)
  - [License](#license)
  - [Acknowledgements](#acknowledgements)

## Features

- **Encryption**: All data is encrypted to ensure security.
- **Self-Hosted**: Run Vault on your own server.
- **Open Source**: Contributions and collaborations are welcome.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **UI**: [shadcn/ui](https://ui.shadcn.com/) (using [Radix](https://www.radix-ui.com/)), [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Turso (libSQL / SQLite)](https://turso.tech/)
- **Database ORM**: [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm)
- **Authentication**: Custom-built authentication
- **Hashing and Encryption**: [bcrypt](https://www.npmjs.com/package/bcrypt), [crypto](https://nodejs.org/api/crypto.html)
- **Linting**: [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- Node.js (v18 or higher)
- pnpm

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/datejer/vault.git
   cd vault
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Configure your environment variables. Create a `.env` file and add the necessary variables (see `.env.example` for reference).

### Running the Development Server

To start the development server, run:

```sh
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

To build the project for production, run:

```sh
pnpm build
```

Then, to start the production server, run:

```sh
pnpm start
```

### Database Migrations

To generate and run database migrations, use the following commands:

```sh
pnpm db:generate
pnpm db:migrate
```

### Linting and Formatting

To run the linter:

```sh
pnpm lint
```

To fix linting issues:

```sh
pnpm lint:fix
```

To format the code with Prettier:

```sh
pnpm prettier
```

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure your code follows the established linting and formatting guidelines. Contributions are subject to the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

This project is open-source and available under the [MIT License](LICENSE).

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.dev/)
- [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm)
- [Turso (libSQL / SQLite)](https://turso.tech/)
