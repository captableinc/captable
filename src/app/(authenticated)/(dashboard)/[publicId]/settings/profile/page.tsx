import { api } from "@/trpc/server";
import { ProfileSettings } from "@/components/member/member-profile";

const ProfileSettingsPage = async () => {
  const _memberProfile = await api.member.getProfile.query();

  if (!_memberProfile) return;

  return <ProfileSettings memberProfile={_memberProfile} />;
};

export default ProfileSettingsPage;
