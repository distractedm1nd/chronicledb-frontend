import { StreamConfig } from "./types/types";

export type ValidationType = {
  isValid: boolean;
  errorMessage: string | null;
};

export const validateConfigState = (
  configState: StreamConfig
): ValidationType => {
  let {
    MaxDeltaQueue,
    MultipleDiskMaxQueue,
    MacroBlocksCache,
    Data,
    RiverThreads,
  } = configState;
  // Multiple Disk Queue Checkpoint validation
  let invalidMultipleDiskQueue =
    MultipleDiskMaxQueue >= MacroBlocksCache * Data.length;
  // River threads validation
  let invalidRiverThreads = !["0", "t", "c", "d"].includes(
    RiverThreads.toString()
  );
  // Max delta queue validation
  let invalidMaxDeltaQueue =
    MaxDeltaQueue * MultipleDiskMaxQueue >= MacroBlocksCache;

  switch (true) {
    case invalidMultipleDiskQueue:
      return {
        isValid: false,
        errorMessage:
          "The number of Multiple Disk Queue Checkpoint must be much lower than MacroBlock Cache * number of data files.",
      };
    case invalidRiverThreads:
      return {
        isValid: false,
        errorMessage:
          "Please provide a river threads value which is one of the following: 0, t, c, d",
      };
    case invalidMaxDeltaQueue:
      return {
        isValid: false,
        errorMessage:
          "The Max delta queue value * number of disks must be always smaller than MacroBlocksCache.",
      };
    default:
      return {
        isValid: true,
        errorMessage: null,
      };
  }
};
