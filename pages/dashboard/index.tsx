import * as React from "react";
import Box from "@mui/material/Box";

import Masonry from "@mui/lab/Masonry";

import * as dayjs from "dayjs";
import * as relativeTime from "dayjs/plugin/relativeTime"; // import plugin
import { Lists } from "./Lists";
import { RecentItems } from "./RecentItems";
import { ListItems } from "./ListItems";

dayjs.extend(relativeTime);

export default function Dashboard() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mr: -2 }}>
        <Masonry columns={{ xs: 1, sm: 2 }} spacing={2}>
          <div>
            <Lists />
          </div>
          <div>
            <RecentItems />
          </div>
          <div>
            <ListItems
              emptyText="Your shopping list is empty"
              emptyImage="https://ouch-cdn2.icons8.com/9ZkS5oUxGuBU8xmECIcW5iRDv56KpODUsTuuykys3NU/rs:fit:256:252/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvMzk3/LzUxZTU5NjM3LWVk/YzQtNDM0My04ODNl/LWZhMmNkM2EzMmQ4/YS5zdmc.png"
              title={"Shopping List"}
              parent={-2}
            />
          </div>
          <div>
            <ListItems
              emptyText="Great job! You've finished all your tasks!"
              emptyImage="https://ouch-cdn2.icons8.com/ILJ4wkr6UuNv9n7wnbxnxKRGFEvqc0_vKV13mA4Q0wM/rs:fit:256:256/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvNTU5/L2YwMDczNGQ4LWFj/NjQtNGQyNS1hNTU2/LTdjNTdkZTY3ZWQz/MS5zdmc.png"
              title={"Reminders"}
              parent={-1}
            />
          </div>
        </Masonry>
      </Box>
    </Box>
  );
}
