import dayjs from "dayjs";

import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export type Dayjs = dayjs.Dayjs;

export type { ConfigType } from "dayjs";

const dayjsExt = dayjs;

export { dayjsExt };
