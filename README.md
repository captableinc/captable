<a href="https://captable.inc" alt="Captable, Inc.">
  <img alt="Captable, Inc. cover image" src="https://captable.inc/og.png">
</a>


<h1 align="center">Captable, Inc.</h1>
<p align="center">
  #1 Open-source Cap table management platform, an alternative to Carta, Pulley, Angelist and others.
</p>
<p align="center">
  <a href="https://captable.inc"><strong>Learn more »</strong></a>
</p>

<p align="center">
  <a href="https://github.com/captableinc/captable/stargazers">
    <img src="https://img.shields.io/github/stars/captableinc/captable??style=flat&label=captable&logo=Github&color=2dd4bf&logoColor=fff" alt="Github" />
  </a>
  
  <a href="https://twitter.com/captableinc">
    <img src="https://img.shields.io/twitter/follow/captableinc?style=flat&label=%40Captable, Inc.&logo=twitter&color=0bf&logoColor=0bf" alt="Twitter" />
  </a>
  <a href="https://github.com/captableinc/captable/actions/workflows/release.yml">
    <img src="https://github.com/captableinc/captable/actions/workflows/release.yml/badge.svg?branch=main&title=CI" alt="CI" />
  </a>
  <a href="https://github.com/captableinc/captable/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/captableinc/captable?label=license&logo=github&color=f80&logoColor=fff" alt="License" />
  </a>
  <a href="https://discord.gg/rCpqnD6G6p">
    <img src="https://img.shields.io/badge/Discord-Join%20us%20on%20Discord-blue" alt="Join us on Discord" />
  </a>
</p>

<h3 id="toc">Table of contents</h3>

- <a href="#features">Features</a>
- <a href="#community">Community</a>
- <a href="#contributing">Contibuting</a>
- <a href="https://github.com/captableinc/captable/blob/main/SELF-HOSTING.md" target="_blank">Self hosting</a>

<h2 id="features">✨ Key features</h2>

> [!IMPORTANT]  
> We envision a world where cap table management is accessible, secure, and empowering for all. Captable, Inc. aims to democratize the handling of cap tables, securities, and stakeholder interactions. Through cutting-edge technology and a commitment to openness, we strive to be the catalyst for positive change in financial ecosystems.

👷 **Incorporation** (wip) - Captable, Inc. helps you incorporate your company in minutes, with all the necessary legal documents and filings taken care of.

👷 **Cap table management** (wip) - Captable, Inc. helps you keep track of your company’s ownership structure, including who owns what percentage of the company, how much stock/options has been issued, and more.

✅ **Fundraise** - Captable, Inc. can help you raise capital, whether its signing standard or custom SAFE or creating and managing fundraising rounds, tracking investor commitments, and more.

✅ **Investor updates** - Delight your investors and team members by sending them regular updates on your company’s progress.

✅ **eSign Documents** - Sign SAFE, NDA, contracts, offere letters or any type of documents with Captable Sign.

✅ **Data rooms** - Captable, Inc. provides a secure virtual data room where you can store important documents and share them with investors, employees, and other stakeholders.


<h2 id="community">🤝 Community</h2>
We have a community of developers, designers, and entrepreneurs who are passionate about building the future of finance. Join us on Discord to connect with like-minded individuals, share your ideas, and collaborate on projects.

* [Join us on Discord](https://discord.gg/rCpqnD6G6p)
* [Follow us on Twitter](https://twitter.com/captableinc)
* [Meet the Founder](https://captable.inc/schedule)


<h2 id="contributing">🫡 Contributing</h2>

- Please show us some support by giving it a ⭐️
- We are looking for contributors to help us build the future of cap table management.
- Let's collaborate on [Discord](https://discord.gg/rCpqnD6G6p) community channel.
- Any contributions you make are truly appreciated.


<h3 id="stack">Stack</h3>

- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [@shadcn/ui](https://ui.shadcn.com/)

---

<h3 id="start">Getting started</h3>
When contributing to **Captable, Inc.**, whether on GitHub or in other community spaces:

- Be respectful, civil, and open-minded.
- Before opening a new pull request, try searching through the [issue tracker](https://github.com/captableinc/captable/issues) for known issues or fixes.


<h3 id="setup">Setup development environment</h3>

- <a href="#gitpod">Development environment on Gitpod</a>
- <a href="#with-docker">Development environment with Docker</a>
- <a href="#without-docker">Development environment without Docker</a>

<h4 id="gitpod">Development environment on Gitpod</h4>

- Click the button below to open this project in Gitpod.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/captableinc/captable)

---

<h4 id="with-docker">Development environment with Docker</h4>

- <a href="https://docs.docker.com/get-docker/" target="_blank">Install Docker</a> & <a href="https://docs.docker.com/compose/install/" target="_blank">Docker Compose</a>
- <a href="https://github.com/captableinc/captable/fork" target="_blank">Fork</a> & clone the forked repository
- <a href="https://pnpm.io/installation" target="_blank">Install node and pnpm</a>. (optional)
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

- Run the following command to migrate and seed the database

  ```bash
  
  docker compose run app pnpm db:migrate
  docker compose run app pnpm db:seed

  ```

  > **Note**
  > Everytime you make changes to Dockerfile.dev or compose.yml, you need to rebuild the docker image by running `docker compose up --build`

- Running `docker compose up` will start all the services on their respective ports.
  - App will be running on [http://localhost:3000](http://localhost:3000)
  - Emails will be intercepted: [http://localhost:8025](http://localhost:8025)
  - SMTP will be on PORT `http://localhost:1025`
  - Postgres will be on PORT `http://localhost:5432`

- Frequently used commands
  - `docker compose up` - Start the development environment
  - `docker compose down` - Stop the development environment
  - `docker compose logs -f` - View logs of the running services
  - `docker compose up --build` - Rebuild the docker image
  - `docker compose run app pnpm db:migrate` - Run database migrations
  - `docker compose run app pnpm db:seed` - Seed the database

---

<h4 id="without-docker">Development environment without Docker</h4>

> This has been tested on Mac OS and works really well. If you are using Linux/Windows/WSL, you might need to install some additional dependencies.

- [Fork the repository](https://github.com/captableinc/captable/fork)

- Clone the repository

  ```bash
  git clone https://github.com/<your-github-name>/captable.git
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

- Frequently used commands
  - `pnpm dev` - Start the development server
  - `pnpm email:dev` - Start the mail server
  - `pnpm db:migrate` - Run database migrations
  - `pnpm db:seed` - Seed the database

<h4 id="changes">Implement your changes</h4>

When making commits, make sure to follow the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) guidelines, i.e. prepending the message with `feat:`, `fix:`, `chore:`, `docs:`, etc...

```bash
git add <file> && git commit -m "feat/fix/chore/docs: commit message"
```

<h4 id="pr">Open a pull request</h4>

> When you're done

Make a commit and push your code to your github fork and make a pull-request.

Thanks for your contributions. Much ❤️

---

<h2 id="contributors">💌 Contributors</h2>
<a href="https://github.com/captableinc/captable/graphs/contributors">
  <p>
    <img src="https://contrib.rocks/image?repo=captableinc/captable" alt="A table of avatars from the project's contributors" />
  </p>
</a>

---

![Alt](https://repobeats.axiom.co/api/embed/a8fc8a167d33eec78a71953a2b9e58985ca4b3b6.svg "Captable repo activity")