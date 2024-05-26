import { SettingsHeader } from "@/components/security/SettingHeader";

export default function TwoFactorAuthPage() {
  return (
    <div className="flex flex-col mt-12 gap-y-3">
      <SettingsHeader
        title="Manage 2FA config"
        subtitle="Use your authenticator app for extra layer of security"
      />
    </div>
  );
}
