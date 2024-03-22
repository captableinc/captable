import { RiPieChartLine } from "@remixicon/react";

const Loading = () => {
  return (
    <div className="fixed left-0 top-0 z-50 h-full w-full bg-white/80 opacity-75">
      <div className="mt-[50vh] flex items-center justify-center">
        <RiPieChartLine className="h-6 w-6 animate-ping text-gray-500" />
      </div>
    </div>
  );
};

export default Loading;
