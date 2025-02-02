import { checkExceptions, createWaiter, WaiterConfiguration, WaiterResult, WaiterState } from "@aws-sdk/util-waiter";

import { GetStreamingImageCommand, GetStreamingImageCommandInput } from "../commands/GetStreamingImageCommand";
import { NimbleClient } from "../NimbleClient";

const checkState = async (client: NimbleClient, input: GetStreamingImageCommandInput): Promise<WaiterResult> => {
  let reason;
  try {
    const result: any = await client.send(new GetStreamingImageCommand(input));
    reason = result;
    try {
      const returnComparator = () => {
        return result.streamingImage.state;
      };
      if (returnComparator() === "DELETED") {
        return { state: WaiterState.SUCCESS, reason };
      }
    } catch (e) {}
    try {
      const returnComparator = () => {
        return result.streamingImage.state;
      };
      if (returnComparator() === "DELETE_FAILED") {
        return { state: WaiterState.FAILURE, reason };
      }
    } catch (e) {}
  } catch (exception) {
    reason = exception;
  }
  return { state: WaiterState.RETRY, reason };
};
/**
 * Wait until a StreamingImage Deleted. Use this after invoking DeleteStreamingImage
 *  @deprecated Use waitUntilStreamingImageDeleted instead. waitForStreamingImageDeleted does not throw error in non-success cases.
 */
export const waitForStreamingImageDeleted = async (
  params: WaiterConfiguration<NimbleClient>,
  input: GetStreamingImageCommandInput
): Promise<WaiterResult> => {
  const serviceDefaults = { minDelay: 2, maxDelay: 120 };
  return createWaiter({ ...serviceDefaults, ...params }, input, checkState);
};
/**
 * Wait until a StreamingImage Deleted. Use this after invoking DeleteStreamingImage
 *  @param params - Waiter configuration options.
 *  @param input - The input to GetStreamingImageCommand for polling.
 */
export const waitUntilStreamingImageDeleted = async (
  params: WaiterConfiguration<NimbleClient>,
  input: GetStreamingImageCommandInput
): Promise<WaiterResult> => {
  const serviceDefaults = { minDelay: 2, maxDelay: 120 };
  const result = await createWaiter({ ...serviceDefaults, ...params }, input, checkState);
  return checkExceptions(result);
};
