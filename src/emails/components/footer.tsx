import { constants } from "@/lib/constants";
import { Hr, Link, Section } from "@react-email/components";

export function Footer() {
  return (
    <Section className="w-full">
      <Hr />

      <br />
      <Link href={constants.url} className="text-[#707070] text-[14px]">
        {constants.title}
      </Link>
    </Section>
  );
}
