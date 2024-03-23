"use server";

import { db } from "@/server/db";
import { dayjsExt } from "@/common/dayjs";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const PublicUpdatePage = async ({
  params: { publicId },
}: {
  params: { publicId: string };
}) => {
  const update = await db.update.findFirst({
    where: {
      publicId,
    },

    include: {
      company: {
        select: {
          name: true,
          logo: true,
        },
      },

      author: {
        select: {
          title: true,
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!update) {
    return {
      status: 404,
      redirect: "/404",
    };
  }

  const company = update?.company;
  const author = update?.author;

  return (
    <div className="flex min-h-screen justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100 px-5 pb-5 pt-12">
      <div className="flex flex-col">
        <div className="mb-16 flex items-center gap-3">
          <Avatar className="h-12 w-12 rounded">
            <AvatarImage
              src={
                "https://pbs.twimg.com/profile_images/1686033387482464257/Dk2qBvtc_400x400.jpg" ||
                "/placeholders/company.svg"
              }
            />

            {/* <AvatarImage src={company.logo || "/placeholders/company.svg"} /> */}
          </Avatar>

          <span className="text-lg font-semibold">{company.name}</span>
        </div>

        <div className="mb-5">
          <h1 className="text-2xl font-semibold tracking-tight">
            {update.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated {dayjsExt().to(update.updatedAt)}
          </p>
        </div>

        <Card className="max-w-4xl p-10">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 rounded-full">
              <AvatarImage
                src={author.user.image || "/placeholders/user.svg"}
              />
            </Avatar>

            <div>
              <p className="text-lg font-semibold">{author.user.name}</p>
              <p className="text-sm text-muted-foreground">{author.title}</p>
            </div>
          </div>

          <div
            className="mt-5"
            dangerouslySetInnerHTML={{ __html: update.html }}
          />
        </Card>
      </div>
    </div>
  );
};

export default PublicUpdatePage;
