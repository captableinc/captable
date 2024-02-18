import { PageLayout } from "@/components/dashboard/page-layout";
import { Card } from "@/components/ui/card";

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PageLayout title="Settings">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-4">
          <Card className="p-5">Settings sidebar</Card>
        </div>
        <div className="col-span-12 md:col-span-8 md:hidden">
          <Card className="p-5">{children}</Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default SettingsLayout;
