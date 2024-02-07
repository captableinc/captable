import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export type Dayjs = dayjs.Dayjs;

export type { ConfigType } from "dayjs";

const dayjsExt = dayjs;

export { dayjsExt };
