import { api } from "@/trpc/server";
import { ProfileSettings } from "@/components/member/member-profile";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

const ProfileSettingsPage = async () => {
  const memberProfile = await api.member.getProfile.query();

  return <ProfileSettings memberProfile={memberProfile} />;
};

export default ProfileSettingsPage;
