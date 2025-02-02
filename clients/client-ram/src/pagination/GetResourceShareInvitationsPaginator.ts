import { Paginator } from "@aws-sdk/types";

import {
  GetResourceShareInvitationsCommand,
  GetResourceShareInvitationsCommandInput,
  GetResourceShareInvitationsCommandOutput,
} from "../commands/GetResourceShareInvitationsCommand";
import { RAM } from "../RAM";
import { RAMClient } from "../RAMClient";
import { RAMPaginationConfiguration } from "./Interfaces";

/**
 * @private
 */
const makePagedClientRequest = async (
  client: RAMClient,
  input: GetResourceShareInvitationsCommandInput,
  ...args: any
): Promise<GetResourceShareInvitationsCommandOutput> => {
  // @ts-ignore
  return await client.send(new GetResourceShareInvitationsCommand(input), ...args);
};
/**
 * @private
 */
const makePagedRequest = async (
  client: RAM,
  input: GetResourceShareInvitationsCommandInput,
  ...args: any
): Promise<GetResourceShareInvitationsCommandOutput> => {
  // @ts-ignore
  return await client.getResourceShareInvitations(input, ...args);
};
export async function* paginateGetResourceShareInvitations(
  config: RAMPaginationConfiguration,
  input: GetResourceShareInvitationsCommandInput,
  ...additionalArguments: any
): Paginator<GetResourceShareInvitationsCommandOutput> {
  // ToDo: replace with actual type instead of typeof input.nextToken
  let token: typeof input.nextToken | undefined = config.startingToken || undefined;
  let hasNext = true;
  let page: GetResourceShareInvitationsCommandOutput;
  while (hasNext) {
    input.nextToken = token;
    input["maxResults"] = config.pageSize;
    if (config.client instanceof RAM) {
      page = await makePagedRequest(config.client, input, ...additionalArguments);
    } else if (config.client instanceof RAMClient) {
      page = await makePagedClientRequest(config.client, input, ...additionalArguments);
    } else {
      throw new Error("Invalid client, expected RAM | RAMClient");
    }
    yield page;
    token = page.nextToken;
    hasNext = !!token;
  }
  // @ts-ignore
  return undefined;
}
