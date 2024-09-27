import { Img, Section } from "@react-email/components";

type LogoProps = {
  baseUrl: string;
};

export function Logo({ baseUrl }: LogoProps) {
  return (
    <Section className="mt-[32px] mb-[16px]">
      <Img
        src={`${baseUrl}/assets/logo.png`}
        width="25"
        height="25"
        alt="Midday"
        className="my-0 mx-auto block bg-black p-2 rounded-md"
      />
    </Section>
  );
}
