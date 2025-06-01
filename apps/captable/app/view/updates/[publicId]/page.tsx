"use server";

import { SharePageLayout } from "@/components/share/page-layout";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import UpdateRenderer from "@/components/update/renderer";
import { dayjsExt } from "@/lib/common/dayjs";
import type { JWTVerifyResult } from "@/lib/jwt";
import { decode } from "@/lib/jwt";
import {
  and,
  companies,
  db,
  eq,
  members,
  updateRecipients,
  updates,
  users,
} from "@captable/db";
import { RiLock2Line } from "@remixicon/react";
import { notFound } from "next/navigation";
import { Fragment } from "react";

const PublicUpdatePage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ publicId: string }>;
  searchParams: Promise<{ token: string }>;
}) => {
  const { publicId } = await params;
  const { token } = await searchParams;
  let decodedToken: JWTVerifyResult | null = null;

  try {
    decodedToken = await decode(token);
  } catch (error) {
    console.error(error);
    return notFound();
  }

  const { payload } = decodedToken;

  if (
    payload.publicId !== publicId ||
    !payload.companyId ||
    !payload.recipientId
  ) {
    return notFound();
  }

  // Extract payload values to ensure proper typing
  const companyId = payload.companyId as string;
  const recipientId = payload.recipientId as string;

  const [result] = await db
    .select({
      // Update fields
      id: updates.id,
      publicId: updates.publicId,
      title: updates.title,
      content: updates.content,
      html: updates.html,
      public: updates.public,
      status: updates.status,
      authorId: updates.authorId,
      companyId: updates.companyId,
      createdAt: updates.createdAt,
      updatedAt: updates.updatedAt,
      // Company fields
      companyName: companies.name,
      companyLogo: companies.logo,
      // Member fields
      authorTitle: members.title,
      // User fields
      authorName: users.name,
      authorEmail: users.email,
      authorImage: users.image,
    })
    .from(updates)
    .innerJoin(companies, eq(updates.companyId, companies.id))
    .innerJoin(members, eq(updates.authorId, members.id))
    .innerJoin(users, eq(members.userId, users.id))
    .where(
      and(eq(updates.publicId, publicId), eq(updates.companyId, companyId)),
    )
    .limit(1);

  const update = result
    ? {
        ...result,
        company: {
          name: result.companyName,
          logo: result.companyLogo,
        },
        author: {
          title: result.authorTitle,
          user: {
            name: result.authorName,
            email: result.authorEmail,
            image: result.authorImage,
          },
        },
      }
    : null;

  if (!update) {
    return notFound();
  }

  const canRenderInPublic = update.status === "PUBLIC" && update.public;

  if (!canRenderInPublic) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <div className="flex items-center space-x-5">
          <RiLock2Line className="h-10 w-10" />
          <p className="text-lg font-semibold text-muted-foreground">
            Public access denied
          </p>
        </div>
      </div>
    );
  }

  const [recipients] = await db
    .select()
    .from(updateRecipients)
    .where(
      and(
        eq(updateRecipients.id, recipientId),
        eq(updateRecipients.updateId, update.id),
      ),
    )
    .limit(1);

  if (!recipients) {
    return notFound();
  }

  const company = update?.company;
  const author = update?.author;

  return (
    <SharePageLayout
      medium="updates"
      company={{
        name: company.name,
        logo: company.logo,
      }}
      title={
        <Fragment>
          <h1 className="text-2xl font-semibold tracking-tight">
            {update.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated {dayjsExt().to(update.updatedAt)}
          </p>
        </Fragment>
      }
    >
      <Fragment>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-full">
            <AvatarImage src={author.user.image || "/placeholders/user.svg"} />
          </Avatar>

          <div>
            <p className="text-lg font-semibold">{author.user.name}</p>
            <p className="text-sm text-muted-foreground">{author.title}</p>
          </div>
        </div>

        <div className="mt-5">
          <UpdateRenderer html={update.html} />
        </div>
      </Fragment>
    </SharePageLayout>
  );
};

export default PublicUpdatePage;
