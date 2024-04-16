import {
  Container,
  Heading,
  Link,
  Section,
  Tailwind,
  Text,
  Preview,
  Html,
  Head,
  Body,
  Img,
} from "jsx-email";

interface InvestorUpdateProps {
  companyName: string;
  companyLogo: string;
  title: string;
  html: string;
  authorImage: string;
  authorName: string;
  authorTitle: string;
}
export const InvestorUpdate = ({
  companyName,
  title,
  html,
  authorImage: avatar,
  authorName,
  authorTitle,
  companyLogo,
}: InvestorUpdateProps) => {
  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white">
          <Container className="my-[40px] flex min-h-screen max-w-[700px] justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100 px-5 pb-5 pt-12">
            <Section className="flex min-h-screen justify-center">
              <Section className="flex flex-col">
                <Section
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "start",
                    alignItems: "start",
                  }}
                  className="mb-10 flex w-full flex-row items-center gap-3 space-x-4"
                >
                  <Section>
                    <Img
                      className="h-7 w-7 rounded-full"
                      src={companyLogo}
                      alt="logo"
                    />
                  </Section>
                  <Section>
                    <Text className="text-md font-semibold text-black">
                      {companyName}
                    </Text>
                  </Section>
                </Section>

                <Section>
                  <Heading className="text-2xl font-semibold tracking-tight text-slate-700">
                    {title}
                  </Heading>
                  <Text className="text-sm text-muted-foreground text-slate-500">
                    Last updated 29 minutes ago
                  </Text>
                </Section>

                <Section className="border-separate justify-center rounded border border-solid border-neutral-200 bg-gradient-to-br from-indigo-50 via-white to-cyan-100 px-5 pb-5 pt-6">
                  <Section
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "start",
                      alignItems: "start",
                    }}
                    className="flex w-full flex-row items-center justify-start gap-3 space-x-5"
                  >
                    <Section>
                      <Img
                        className="h-10 w-10 rounded-full"
                        src={avatar}
                        alt="avatar"
                      />
                    </Section>
                    <Section>
                      <Text className="bold text-lg text-black">
                        {authorName}
                      </Text>
                      <Text className="text-md font-thin text-muted-foreground text-slate-400">
                        {authorTitle}
                      </Text>
                    </Section>
                  </Section>

                  <Section className="mt-5">
                    <Text
                      className="prose"
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  </Section>
                </Section>

                <Section className="my-10 text-center text-sm text-muted-foreground">
                  <Text>
                    Powered by{" "}
                    <Link
                      href={`https://opencap.co?utm_source=${companyName}&utm_medium=updates&utm_campaign=powered_by`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-bold text-teal-500 hover:underline"
                    >
                      OpenCap
                    </Link>
                  </Text>
                </Section>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
