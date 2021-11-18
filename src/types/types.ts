export type EventType = "Float" | "Integer" | "Compound" | "VarStringList" | "ConstStringList" | "VarFloatList" | "ConstFloatList" | "VarIntegerList" | "ConstIntegerList" | "VarString" | "ConstString";

export type StreamConfig = {
    Log: boolean
    Debug: boolean
    Data: [string]
    Translation: string
    RightFlank:  string
    MultipleDiskMaxQueue: number
    Event: [{[key in EventType]?: any}]
    LightweightIndex: {"aggregate": any, "projector_sequence": "Mono" | "Empty"}
    LogicalBlockSize: number
    MacroBlockSize: number
    MacroBlockSpare: number
    MacroBlockPreallocation: number
    MacroBlockBatchAllocation: number
    MacroBlockCache: number
    NodesCache: number
    Compressor: "none" | "LZ4_Fast_No_Meta" | "LZ4_Fast_With_Meta"
    CompressorExtras: {"I32": number | "None"}
    RiverThreads: number | string
    MaxDeltaQueue: number
}

export const DefaultStreamConfig: StreamConfig = {
    Log: false,
    Debug: false,
    Data: ["data0"],
    Translation: "translation",
    RightFlank: "flank",
    MultipleDiskMaxQueue: 100,
    Event: [{"Float": 0.0}],
    LightweightIndex: {"aggregate":{"SMA":{"cnt":0,"sum":0.0,"min":0.0,"max":0.0}},"projector_sequence":"Mono"},
    LogicalBlockSize: 8192,
    MacroBlockSize: 10,
    MacroBlockSpare: 0.1,
    MacroBlockPreallocation: 300,
    MacroBlockBatchAllocation: 300,
    MacroBlockCache: 2500,
    NodesCache: 3000,
    Compressor: "LZ4_Fast_No_Meta",
    CompressorExtras:  {"I32":12},
    RiverThreads: "t",
    MaxDeltaQueue: 10
}
