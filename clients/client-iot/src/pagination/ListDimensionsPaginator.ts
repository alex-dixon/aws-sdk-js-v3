import { Paginator } from "@aws-sdk/types";

import {
  ListDimensionsCommand,
  ListDimensionsCommandInput,
  ListDimensionsCommandOutput,
} from "../commands/ListDimensionsCommand";
import { IoT } from "../IoT";
import { IoTClient } from "../IoTClient";
import { IoTPaginationConfiguration } from "./Interfaces";

/**
 * @private
 */
const makePagedClientRequest = async (
  client: IoTClient,
  input: ListDimensionsCommandInput,
  ...args: any
): Promise<ListDimensionsCommandOutput> => {
  // @ts-ignore
  return await client.send(new ListDimensionsCommand(input), ...args);
};
/**
 * @private
 */
const makePagedRequest = async (
  client: IoT,
  input: ListDimensionsCommandInput,
  ...args: any
): Promise<ListDimensionsCommandOutput> => {
  // @ts-ignore
  return await client.listDimensions(input, ...args);
};
export async function* paginateListDimensions(
  config: IoTPaginationConfiguration,
  input: ListDimensionsCommandInput,
  ...additionalArguments: any
): Paginator<ListDimensionsCommandOutput> {
  // ToDo: replace with actual type instead of typeof input.nextToken
  let token: typeof input.nextToken | undefined = config.startingToken || undefined;
  let hasNext = true;
  let page: ListDimensionsCommandOutput;
  while (hasNext) {
    input.nextToken = token;
    input["maxResults"] = config.pageSize;
    if (config.client instanceof IoT) {
      page = await makePagedRequest(config.client, input, ...additionalArguments);
    } else if (config.client instanceof IoTClient) {
      page = await makePagedClientRequest(config.client, input, ...additionalArguments);
    } else {
      throw new Error("Invalid client, expected IoT | IoTClient");
    }
    yield page;
    token = page.nextToken;
    hasNext = !!token;
  }
  // @ts-ignore
  return undefined;
}
