import { Paginator } from "@aws-sdk/types";

import { CloudDirectory } from "../CloudDirectory";
import { CloudDirectoryClient } from "../CloudDirectoryClient";
import {
  ListTypedLinkFacetNamesCommand,
  ListTypedLinkFacetNamesCommandInput,
  ListTypedLinkFacetNamesCommandOutput,
} from "../commands/ListTypedLinkFacetNamesCommand";
import { CloudDirectoryPaginationConfiguration } from "./Interfaces";

/**
 * @private
 */
const makePagedClientRequest = async (
  client: CloudDirectoryClient,
  input: ListTypedLinkFacetNamesCommandInput,
  ...args: any
): Promise<ListTypedLinkFacetNamesCommandOutput> => {
  // @ts-ignore
  return await client.send(new ListTypedLinkFacetNamesCommand(input), ...args);
};
/**
 * @private
 */
const makePagedRequest = async (
  client: CloudDirectory,
  input: ListTypedLinkFacetNamesCommandInput,
  ...args: any
): Promise<ListTypedLinkFacetNamesCommandOutput> => {
  // @ts-ignore
  return await client.listTypedLinkFacetNames(input, ...args);
};
export async function* paginateListTypedLinkFacetNames(
  config: CloudDirectoryPaginationConfiguration,
  input: ListTypedLinkFacetNamesCommandInput,
  ...additionalArguments: any
): Paginator<ListTypedLinkFacetNamesCommandOutput> {
  // ToDo: replace with actual type instead of typeof input.NextToken
  let token: typeof input.NextToken | undefined = config.startingToken || undefined;
  let hasNext = true;
  let page: ListTypedLinkFacetNamesCommandOutput;
  while (hasNext) {
    input.NextToken = token;
    input["MaxResults"] = config.pageSize;
    if (config.client instanceof CloudDirectory) {
      page = await makePagedRequest(config.client, input, ...additionalArguments);
    } else if (config.client instanceof CloudDirectoryClient) {
      page = await makePagedClientRequest(config.client, input, ...additionalArguments);
    } else {
      throw new Error("Invalid client, expected CloudDirectory | CloudDirectoryClient");
    }
    yield page;
    token = page.NextToken;
    hasNext = !!token;
  }
  // @ts-ignore
  return undefined;
}
