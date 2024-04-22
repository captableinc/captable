<a href="https://captable.inc" alt="Captable, Inc.">
  <img alt="Captable, Inc. cover image" src=".github/images/cover.png?v=0">
</a>


<h1 align="center">Captable, Inc.</h1>
<p align="center">
  An open source alternative to <strong>Carta</strong>, <strong>Pulley</strong>, <strong>Angelist</strong> and others.
</p>
<p align="center">
  <a href="https://captable.inc"><strong>Learn more »</strong></a>
</p>

<p align="center">
  <a href="https://github.com/captableinc/captable/stargazers">
    <img src="https://img.shields.io/github/stars/captableinc/captable??style=flat&label=captable&logo=github&color=2dd4bf&logoColor=fff" alt="Github" />
  </a>
  <a href="https://twitter.com/captableinc">
    <img src="https://img.shields.io/twitter/follow/captableinc?style=flat&label=%40Captable, Inc.&logo=twitter&color=0bf&logoColor=0bf" alt="Twitter" />
  </a>
  <a href="https://github.com/captableinc/captable/actions/workflows/deploy.yml">
    <img src="https://github.com/captableinc/captable/actions/workflows/deploy.yml/badge.svg?branch=main&title=CI" alt="CI" />
  </a>
  <a href="https://github.com/captableinc/captable/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/captableinc/captable?label=license&logo=github&color=f80&logoColor=fff" alt="License" />
  </a>
  <a href="https://discord.gg/rCpqnD6G6p">
    <img src="https://img.shields.io/badge/Discord-Join%20us%20on%20Discord-blue" alt="Join us on Discord" />
  </a>
</p>


<strong>Captable, Inc.</strong> will follow the [Open Cap Table Coalition](https://www.opencaptablecoalition.com/format) format, an open source standard to prevent lock-in and keep lawyer fees low. No promises.

<h2 id="contributors">✨ Contributors</h2>

- Don't forget to leave a star ⭐️
- We ❤️ contributors! Feel free to contribute to this project!.
- Any contributions you make are truly appreciated.
- Let's continue contributing to keep the community active and growing.
- Let's collaborate on [Discord](https://discord.gg/rCpqnD6G6p) community channel.

<a href="https://github.com/captableinc/captable/graphs/contributors">
  <p>
    <img src="https://contrib.rocks/image?repo=captableinc/captable" alt="A table of avatars from the project's contributors" />
  </p>
</a>

## Stack
- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [@shadcn/ui](https://ui.shadcn.com/)

## Developers

### With Docker
Follow the steps below to stand the app up locally.

**1. Install dependencies.**

```sh
npm i
```

**2. Copy `.env.example`**

```sh
cp .env.example .env
```

**3. Run docker to setup**
> If you prefer to run the app without docker, you can skip this step and configure the following services manually:

  * Postgres database
  * Minio storage
  * SMTP server 

```sh
npm run docker:start
```

Generate tables and the Prisma client.

```sh
npx prisma migrate dev
```

To see what's in your database, run Prisma Studio:

```sh
npm run db:studio

```

**4. Seed some data (For dev environment)**

```sh
npm run db:seed
```

**5. Run the web app**

```sh
npm run dev
```

**6. Install and run SMTP server**

> If you have setup database using docker, this step is optional.

> [Mailpit](https://github.com/axllent/mailpit) or something similar can be used intercept emails in development.

```sh
npm run email:dev
```

Open your browser to the URLs given by the web app and studio processes. You're up and running, good job! 🎉

#### Gitpod Setup

- Click the button below to open this project in Gitpod.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/captableinc/captable)

### One-click deploy

_Coming soon to a PaaS near you:_

### Vercel

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/captableinc/captable)

### Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/captableinc/captable)

### Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new?template=)

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/captableinc/captable)
