import { Paginator } from "@aws-sdk/types";

import {
  ListFuotaTasksCommand,
  ListFuotaTasksCommandInput,
  ListFuotaTasksCommandOutput,
} from "../commands/ListFuotaTasksCommand";
import { IoTWireless } from "../IoTWireless";
import { IoTWirelessClient } from "../IoTWirelessClient";
import { IoTWirelessPaginationConfiguration } from "./Interfaces";

/**
 * @private
 */
const makePagedClientRequest = async (
  client: IoTWirelessClient,
  input: ListFuotaTasksCommandInput,
  ...args: any
): Promise<ListFuotaTasksCommandOutput> => {
  // @ts-ignore
  return await client.send(new ListFuotaTasksCommand(input), ...args);
};
/**
 * @private
 */
const makePagedRequest = async (
  client: IoTWireless,
  input: ListFuotaTasksCommandInput,
  ...args: any
): Promise<ListFuotaTasksCommandOutput> => {
  // @ts-ignore
  return await client.listFuotaTasks(input, ...args);
};
export async function* paginateListFuotaTasks(
  config: IoTWirelessPaginationConfiguration,
  input: ListFuotaTasksCommandInput,
  ...additionalArguments: any
): Paginator<ListFuotaTasksCommandOutput> {
  // ToDo: replace with actual type instead of typeof input.NextToken
  let token: typeof input.NextToken | undefined = config.startingToken || undefined;
  let hasNext = true;
  let page: ListFuotaTasksCommandOutput;
  while (hasNext) {
    input.NextToken = token;
    input["MaxResults"] = config.pageSize;
    if (config.client instanceof IoTWireless) {
      page = await makePagedRequest(config.client, input, ...additionalArguments);
    } else if (config.client instanceof IoTWirelessClient) {
      page = await makePagedClientRequest(config.client, input, ...additionalArguments);
    } else {
      throw new Error("Invalid client, expected IoTWireless | IoTWirelessClient");
    }
    yield page;
    token = page.NextToken;
    hasNext = !!token;
  }
  // @ts-ignore
  return undefined;
}
