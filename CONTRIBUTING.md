# Contribution Guidelines

## Table of contents

- <a href="#stack">Stack</a>
- <a href="#start">Getting started</a>
- <a href="#setup">Setup development environment</a>
- <a href="#changes">Implement your changes</a>
- <a href="#pr">Open a pull request</a>
- <a href="#community">Join our community</a>


<h2 id="stack">Stack</h2>
- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [@shadcn/ui](https://ui.shadcn.com/)

---

<h2 id="start">Getting started</h2>
When contributing to **Captable, Inc.**, whether on GitHub or in other community spaces:

- Be respectful, civil, and open-minded.
- Before opening a new pull request, try searching through the [issue tracker](https://github.com/captableinc/captable/issues) for known issues or fixes.
- If you want to make code changes based on your personal opinion(s), make sure you open an issue first describing the changes you want to make, and open a pull request only when your suggestions get approved by maintainers.

In order to not waste your time implementing a change that has already been declined, or is generally not needed, start by [opening an issue](https://github.com/captableinc/captable/issues/new) describing the problem you would like to solve.


<h2 id="setup">Setup development environment</h2>

- <a href="#with-docker">Development environment with Docker</a>
- <a href="#without-docker">Development environment without Docker</a>
- <a href="#commands">Frequently used commands</a>

<h3 id="with-docker">Development environment with Docker</h3>

- [Install Docker](https://docs.docker.com/get-docker/) on your machine.
- [Install Docker Compose](https://docs.docker.com/compose/install/) on your machine.
- [Fork the repository](https://github.com/captableinc/captable/fork)
- [Install node and pnpm](https://pnpm.io/installation) on your machine. (optional)

- Clone the repository

  ```bash
  git clone https://github.com/<your-github-name>/captable.git
  ```

- Copy `.env.example` to `.env`

  ```bash
  cp .env.example .env`
  ```

- Run the following command to start the development environment

  ```bash
  # With pnpm installed
  pnpm dx

  # Without pnpm installed
  docker compose up
  ```

  > **Note**
  > Everytime you make changes to Dockerfile.dev or compose.yml, you need to rebuild the docker image by running `docker compose up --build`

- Running `docker compose up` will start all the services on their respective ports.
  - App will be running on [http://localhost:3000](http://localhost:3000)
  - Emails will be intercepted: [http://localhost:8025](http://localhost:8025)
  - SMTP will be on PORT `http://localhost:1025`
  - Postgres will be on PORT `http://localhost:5432`

---

<h3 id="without-docker">Development environment without Docker</h3>

> This has been tested on Mac OS and works really well. If you are using Linux/Windows/WSL, you might need to install some additional dependencies.

- [Fork the repository](https://github.com/captableinc/captable/fork)

- Clone the repository

  ```bash
  git clone https://github.com/<your-github-name>/envless.git
  ```

- Copy `.env.example` to `.env`

  ```bash
  cp .env.example .env
  ```

- Install latest version of node and pnpm
- Install latest version of postgres database
- Install [mailpit](https://mailpit.axllent.org/docs/install/) for SMTP and email interception
- Create database `captable` in postgres database
- Update `.env` file's `DATABASE_URL` with database credentials
- For a quick start, you can use [Supabase](https://supabase.com/) or [Neon](https://neon.tech/) as well.
- Run the following command to install dependencies

  ```bash
  pnpm install
  ```

- Run the following command to migrate and seed the database

  ```bash
  pnpm db:migrate
  pnpm db:seed
  ```

- Run the following command to start the development server

  ```bash
  pnpm dev

  # On a different terminal, run the following command to start the mail server
  pnpm email:dev
  ```

  - App will be running on [http://localhost:3000](http://localhost:3000)
  - Emails will be intercepted: [http://localhost:8025](http://localhost:8025)
  - SMTP will be on PORT `http://localhost:1025`
  - Postgres will be on PORT `http://localhost:5432`

---

<h3 id="commands">Frequently used commands</h3>

> TODO - Please take a look at the `package.json` file for more commands.

---


<h2 id="changes">Implement your changes</h2>

When making commits, make sure to follow the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) guidelines, i.e. prepending the message with `feat:`, `fix:`, `chore:`, `docs:`, etc...

```bash
git add <file> && git commit -m "feat/fix/chore/docs: commit message"
```

---

<h2 id="pr">Open a pull request</h2>

### When you're done

Make a commit and push your code to your github fork and make a pull-request.

Thanks for your contributions. Much ❤️

---

<h2 id="community">Community</h2>

Please join us on our discord to get help, discuss features, or just hang out.

- [Join Captable on Discord](https://discord.gg/rCpqnD6G6p)
- [Follow Captable on Twitter](https://twitter.com/captableinc)

---

<h2 id="contributors">Contributors</h2>
<a href="https://github.com/captableinc/captable/graphs/contributors">
  <p>
    <img src="https://contrib.rocks/image?repo=captableinc/captable" alt="A table of avatars from the project's contributors" />
  </p>
</a>