import { Paginator } from "@aws-sdk/types";

import {
  ListIncidentRecordsCommand,
  ListIncidentRecordsCommandInput,
  ListIncidentRecordsCommandOutput,
} from "../commands/ListIncidentRecordsCommand";
import { SSMIncidents } from "../SSMIncidents";
import { SSMIncidentsClient } from "../SSMIncidentsClient";
import { SSMIncidentsPaginationConfiguration } from "./Interfaces";

/**
 * @private
 */
const makePagedClientRequest = async (
  client: SSMIncidentsClient,
  input: ListIncidentRecordsCommandInput,
  ...args: any
): Promise<ListIncidentRecordsCommandOutput> => {
  // @ts-ignore
  return await client.send(new ListIncidentRecordsCommand(input), ...args);
};
/**
 * @private
 */
const makePagedRequest = async (
  client: SSMIncidents,
  input: ListIncidentRecordsCommandInput,
  ...args: any
): Promise<ListIncidentRecordsCommandOutput> => {
  // @ts-ignore
  return await client.listIncidentRecords(input, ...args);
};
export async function* paginateListIncidentRecords(
  config: SSMIncidentsPaginationConfiguration,
  input: ListIncidentRecordsCommandInput,
  ...additionalArguments: any
): Paginator<ListIncidentRecordsCommandOutput> {
  // ToDo: replace with actual type instead of typeof input.nextToken
  let token: typeof input.nextToken | undefined = config.startingToken || undefined;
  let hasNext = true;
  let page: ListIncidentRecordsCommandOutput;
  while (hasNext) {
    input.nextToken = token;
    input["maxResults"] = config.pageSize;
    if (config.client instanceof SSMIncidents) {
      page = await makePagedRequest(config.client, input, ...additionalArguments);
    } else if (config.client instanceof SSMIncidentsClient) {
      page = await makePagedClientRequest(config.client, input, ...additionalArguments);
    } else {
      throw new Error("Invalid client, expected SSMIncidents | SSMIncidentsClient");
    }
    yield page;
    token = page.nextToken;
    hasNext = !!token;
  }
  // @ts-ignore
  return undefined;
}
