import OptionModal from "@/components/securities/options/option-modal";
import OptionTable from "@/components/securities/options/option-table";
import { Card } from "@/components/ui/card";
import { api } from "@/trpc/server";

const OptionsPage = async () => {
  const options = await api.securities.getOptions.query();

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between gap-y-3 ">
        <div className="gap-y-3">
          <h3 className="font-medium">Options</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add stock options for stakeholders
          </p>
        </div>
        <div>
          <OptionModal />
        </div>
      </div>
      <Card className="mx-auto mt-3 w-[28rem] sm:w-[38rem] md:w-full">
        <OptionTable options={options.data} />
      </Card>
    </div>
  );
};

export default OptionsPage;
