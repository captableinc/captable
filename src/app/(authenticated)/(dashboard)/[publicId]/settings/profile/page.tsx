import { api } from "@/trpc/server";
import { ProfileSettings } from "@/components/member/member-profile";

const ProfileSettingsPage = async () => {
  const memberProfile = await api.member.getProfile.query();

  return <ProfileSettings memberProfile={memberProfile} />;
};

export default ProfileSettingsPage;
