// export type EventType = "U8" | "U16" | "U32" | "U64" | "I8" | "I16" | "I32" | "I64" | "F32" | "F64" | "ConstString" | "ConstU8List" | "Const"

import { type } from "os"
import { TypeOfTag } from "typescript"

export const EventNames = {
  "Raw": {
      "Empty": {
          "Empty": "Empty",
      },
      "Unsigned Integer": {
          8: "U8",
          16: "U16",
          32: "U32",
          64: "U64",
      },
      "Integer": {
          8: "I8",
          16: "I16",
          32: "I32",
          64: "I64",
      },
      "Float": {
          32: "F32",
          64: "F64",
      },
  },
    "Const": {
        "String": {
            Constant: "ConstString"
        },
        "Unsigned Integer": {
            8: "ConstU8List",
            16: "ConstU16List",
            32: "ConstU32List",
            64: "ConstU64List",
        },
        "Integer": {
            8: "ConstI8List",
            16: "ConstI16List",
            32: "ConstI32List",
            64: "ConstI64List",
        },
        "Float": {
            32: "ConstF32List",
            64: "ConstF64List",
        }
    },
    "Var": {
        "String": {
            Variable: "VarString"
        },
        "Unsigned Integer": {
            8: "VarU8List",
            16: "VarU16List",
            32: "VarU32List",
            64: "VarU64List",
        },
        "Integer": {
            8: "VarI8List",
            16: "VarI16List",
            32: "VarI32List",
            64: "VarI64List",
        },
        "Float": {
            32: "VarF32List",
            64: "VarF64List",
        }
    }
}

export enum StreamConfigKey {
  Log = "Log",
  Debug = "Debug",
  Data = "Data",
  Translation = "Translation",
  Boot = "Boot",
  RightFlank = "Right flank",
  MultipleDiskMaxQueue = "Multiple disk max queue",
  Event = "Event",
  LightweightIndex = "Lightweight index",
  LogicalBlockSize = "LogicalBlock size",
  MacroBlockSize = "MacroBlock size",
  MacroBlockSpare = "MacroBlock spare",
  MacroBlockPreallocation = "MacroBlock preallocation",
  MacroBlockBatchAllocation = "MacroBlock batch allocation",
  MacroBlocksCache = "MacroBlocks cache",
  NodesCache = "Nodes cache",
  Compressor = "Compressor",
  CompressorExtras = "Compressor extras",
  RiverThreads = "River threads",
  MaxDeltaQueue = "Max delta queue",
}



export type HashFunction = {
        a: number,
        b: number,
}


export type IEvent = { [EventType: string]: any };


export type Aggregate = SMA | BloomFilter

export type BloomFilter = {
    "BloomFilter" : {
        bit_set: {bit_array: number[]},
        hash_functions: HashFunction[],
    }
}

export type SMA = {
    "SMA": {
        cnt: number,
        sum: number,
        min: number,
        max: number,
}}


export type LightweightIndex = {
    "aggregate": Aggregate,
    "projector_sequence": "Mono" | "Empty" | {"Slice":number[]},
}

export type StreamConfig = {
    Log: boolean;
    Debug: boolean;
    Data: [string];
    Translation: string;
    Boot: string;
    MultipleDiskMaxQueue: number;
    Event: [IEvent];
    LightweightIndex:LightweightIndex;
    LogicalBlockSize: number;
    MacroBlockSize: "l" | "p" | number;
    MacroBlockSpare: number;
    MacroBlockPreallocation: number;
    MacroBlockBatchAllocation: number;
    MacroBlocksCache: number;
    NodesCache: number;
    Compressor: "none" | "LZ4_Fast_No_Meta" | "LZ4_Fast_With_Meta";
    CompressorExtras: {"Lz4Level": number | "None"};
    RiverThreads: number | string;
    MaxDeltaQueue: number;
};

export const DefaultStreamConfig: StreamConfig = {
  Log: false,
  Debug: false,
  Data: ["data0"],
  Boot: ".boot",
  Translation: "translation",
  MultipleDiskMaxQueue: 100,
  Event: [
    {
      VarCompound: [
        { U64: 0 },
        { I64: 0 },
        { F64: 0.0 },
        { VarString: "Hallo-Welt" },
      ],
    },
  ],
  LightweightIndex: {
    aggregate: { SMA: { cnt: 0, sum: 0.0, min: 0.0, max: 0.0 } },
    projector_sequence: "Mono",
  },
  LogicalBlockSize: 8192,
  MacroBlockSize: 10,
  MacroBlockSpare: 0.1,
  MacroBlockPreallocation: 300,
  MacroBlockBatchAllocation: 300,
  MacroBlocksCache: 2500,
  NodesCache: 3000,
  Compressor: "LZ4_Fast_No_Meta",
  CompressorExtras: { Lz4Level: 12 },
  RiverThreads: "t",
  MaxDeltaQueue: 10,
};

export const ip: string = "http://127.0.0.1:8000";

export const configString: string= `##########################################################################################
##########################################################################################
##########################################################################################
##########################################################################################
#####\t\t\t\t\t\t\t  \t\t\t\t\t\t\t\t\t\t\t\t\t #####
##### Created by   Amir El-Shaikh on 11.03.2021.\t\t\t\t\t\t\t\t\t #####
##### E-Mail: elshaikh@mathematik.uni-marburg.de\t\t\t\t\t\t\t   \t\t #####
#####\t\t\t\t\t\t\t  \t\t\t\t\t\t\t\t\t\t\t\t\t #####
##### @Author: Amir El-Shaikh\t\t\t\t\t\t\t  \t\t\t\t\t \t   \t #####
#####\t\t\t\t\t\t\t  \t\t\t\t\t\t\t\t\t\t\t\t\t #####
#####\t\t\t\t\t\t\t  \t\t\t\t\t\t\t\t\t\t\t\t\t #####
##### --> Compatible with version: 0.9.2\t\t\t\t\t\t\t  \t\t\t\t #####
##########################################################################################
##########################################################################################
##########################################################################################
##########################################################################################
############################# ChronicleDB Configuration File #############################
#############################      Format -> KEY = VALUE     #############################

[Debug]#
\t# Enables logs across the system, if log set to true
\t# Otherwise logs are disabled.
\tLog\t\t\t\t\t\t\t\t= false

\t# All the dynamic TAB+Index optimized sizes are discarded and
\t# the minimum size for the nodes is used instead, if set to true. 
\t# These minimum sizes are:
\t# \t- Index Data Size \t\t\t:= 3 Keys   / Node.
\t# \t- Leaf Data Size  \t\t\t:= 2 Events / Node.
\t# Otherwise, calculates the most suitable TAB+Index sizes.
\tDebug\t\t\t\t\t\t\t= false

[I/O]#
# streamid is deprecated!
\t# The Stream ID of this configuration.
\t# <number> \t\t\t\t\t\t:= The synchronous constant number of this StreamID.
\t# Use with caution, this might fail, if is already in use or concurrent requests made!
\t# Highly recommended not use the constant number configuration, but let the system assign an ID.
\t
\t# n\t\t\t\t\t\t\t\t:= Optimal configuration.
\t# The system will assign a StreamID and is guaranteed to be valid.
\t# This is valid for revoering operations like-wise.
\t#streamid\t\t\t\t\t\t= 0
\t
# schema is deprecated!
\t# Schema file.
\t# This is used on start-up, denoting the specific stream meta information.
\t#schema\t\t\t\t\t\t\t= N:\\schema
\t
\t# Data files.
\t# data = C:\\dataFile1
\t# data = I:\\dataFile2
\t# data = H:\\dataFile3
\t# ...
\tData \t\t\t\t\t\t\t= N:\\data
\t#Data \t\t\t\t\t\t\t= I:\\data
\tBoot = .boot
\t
\t# Translation file.
\t# This is used to serialize the rightFlank on a clean system shutdown.
\tTranslation\t\t\t\t\t\t= N:\\translation
\t
\t# Right flank file.
\t# This is used to serialize the rightFlank on a clean system shutdown.
\tRight flank\t\t\t\t\t\t= N:\\flank
\t
\t# Multiple Disk Queue Checkpoint.
\t# The number of MacroBlocks allowed to be queued on disk writer thread(s).
\t# This number must be much lower than MacroBlock Cache * number of data files.
\tMultiple disk max queue \t\t= 100
\t
[Stream Event Layout]#
\t# You must declare the layout in a valid json format.
\t
\t# Note: The layout must be valid, hence a dummy event layout is expected.
\t# Note: For a variable type, the upper limit must be defined.
\t
\t# E.g. (Event) for a variable string length, the dummy layout must contain the max expected string length.
\t
\t# The following list declares possible types for an event layout:
\t# Internal:
\t\t# Empty
\t# JSON:
\t\t# "Empty"
\t
\t# Internal:
\t\t# Float(0f64),
\t# JSON:
\t\t# {"Float":0.0}
\t\t
\t# Internal:
\t\t# Integer(0u64),
\t# JSON:
\t\t# {"Integer":0}
\t\t
\t# Internal:
\t\t# ConstString(StringBuff::from("This is joe, sleepy joe!".to_string().into_bytes())),
\t# JSON:
\t\t# {"ConstString":[84,104,105,115,32,105,115,32,106,111,101,44,32,115,108,101,101,112,121,32,106,111,101,33]}
\t\t
\t# Internal:
\t\t# VarString(StringBuff::from("Kamala!".to_string().into_bytes()))
\t# JSON:
\t\t# {"VarString":[75,97,109,97,108,97,33]}
\t\t
\t# Internal:
\t\t# ConstIntegerList(IntegerArray::from(vec![1, 2, 3]))
\t# JSON:
\t\t# {"ConstIntegerList":[1,2,3]}
\t
\t# Internal:
\t\t# VarIntegerList(IntegerArray::from(vec![4, 5, 6, 7]))
\t# JSON:
\t\t# {"VarIntegerList":[4,5,6,7]}
\t\t
\t# Internal:
\t\t# ConstFloatList(FloatArray::from(vec![8f64, 9f64]))
\t# JSON:
\t\t# {"ConstFloatList":[8.0,9.0]}
\t\t
\t# Internal:
\t\t# VarFloatList(FloatArray::from(vec![10f64, 11f64]))
\t# JSON:
\t\t# {"VarFloatList":[10.0,11.0]}
\t\t
\t# Internal:
\t\t# ConstStringList(StringArray::from(vec![StringBuff::from("Mini".to_string().into_bytes()), StringBuff::from("Mike".to_string().into_bytes())]))
\t# JSON:
\t\t# {"ConstStringList":[[77,105,110,105],[77,105,107,101]]}
\t\t
\t# Internal:
\t\t# VarStringList(StringArray::from(vec![StringBuff::from("Trump".to_string().into_bytes()), StringBuff::from("Pence".to_string().into_bytes())]))
\t# JSON:
\t\t# {"VarStringList":[[84,114,117,109,112],[80,101,110,99,101]]}
\t\t
\t# Internal:
\t\t# Compound(DataArray::from(vec![Empty, Float(12f64), Integer(13u64), ConstString(StringBuff::from("Pompeo".to_string().into_bytes()))]))
\t# JSON:
\t\t# {"Compound":["Empty",{"Float":12.0},{"Integer":13},{"ConstString":[80,111,109,112,101,111]}]}

\t# Event Layout in JSON format for this Stream.
\tEvent\t\t\t\t\t\t\t= {"Float":0.0}
\t
[Lightweight Index]#
\t# The lightweight index layout must follow similar JSON notes as for for event layout.
\t# The following list declares possible types for \`aggregate\` value:
\t
\t# Internal:
\t\t# Empty
\t# JSON:
\t\t# "Empty"
\t\t
\t# Internal:
\t\t# SMA { cnt: 0, sum: 0f64, min: 0f64, max: 0f64 }
\t# JSON:
\t\t# {"SMA":{"cnt":0,"sum":0.0,"min":0.0,"max":0.0}}
\t\t
\t# Internal:
\t\t# BloomFilter(BloomFilter::new(8, 32))
\t# JSON:
\t\t# {"BloomFilter":{"bit_set":{"bit_array":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},"hash_functions":[{"a":24309,"b":42942},{"a":16260,"b":39300},{"a":14853,"b":45314},{"a":42661,"b":55560},{"a":9686,"b":36492},{"a":785,"b":4537},{"a":13599,"b":16258},{"a":8815,"b":7937}]}}

\t# The following list declares possible types for \`projector_sequence\` value:
\t# "Mono"\t\t\t\t\t\t\t:= efficient attribute unwrap of events of a single attribute in total.
\t# "Empty"\t\t\t\t\t\t\t:= no mapping to an attribute.
\t# {"Slice":[n1,n2,n3,..]}\t\t\t:= sequence of projections, ideal for complex attributes e.g. for Compound(..) or mapping on a char of a String.
\t# The "Mono" value is equivalent to {"Slice":[0]}.
\t# The "Empty" value is equivalent to {"Slice":[]}.
\t
\t# Note: SMA/Bloomfilter require a projection on a float value.
\t# You can add unlimited \`lightweight index\` by defining new ones in new lines, similar to the \`data\` key earlier.
\t# The index layouts:
\tLightweight index\t\t\t\t= {"aggregate":{"SMA":{"cnt":0,"sum":0.0,"min":0.0,"max":0.0}},"projector_sequence":"Mono"}
\t#Lightweight index\t\t\t\t= {"aggregate":{"SMA":{"cnt":0,"sum":0.0,"min":0.0,"max":0.0}},"projector_sequence":"Empty"}
\t
[Block]#
\t# Number of bytes for an uncompressed serialized node.
\t# Generally, this should match the I/O block size of the data files.
\t# Can be an arbitrary numeric value like-wise.
\t# l\t\t\t\t\t\t\t\t:= Logical IO Block Size.
\t# p\t\t\t\t\t\t\t\t:= Phsysical IO Block Size.
\t# <number> \t\t\t\t\t\t:= <number> of bytes.
\t# WARNING: l and p not supported yet!
\tLogicalBlock size \t\t\t\t= 8192
\t
\t# Number of bytes for a MacroBlock.
\t# Denoted in a multiply of Logical Block Size.
\t# The multiply value must be a decimal number and never 0.
\tMacroBlock size \t\t\t\t= 10
\t
\t# Percent of spare space in a MacroBlock.
\tMacroBlock spare\t\t\t\t= 0.1
\t
\t# Number of MacroBlocks to preallocate at start.
\tMacroBlock preallocation \t\t= 300
\t
\t# Allocates a number of MacroBlocks, when MacroBlockPreallocation
\t# is exhausted.
\t# 0\t\t\t\t\t\t\t\t:= Batch allocator disabled.
\t# n, where n is greater or equal to MacroBlockPreallocation.
\tMacroBlock batch allocation\t\t= 300
\t
[Cache]#
\t# Number of MacroBlocks to keep in memory in LRU i.e. cache.
\tMacroBlocks cache\t\t\t\t= 2500
\t
\t# Number of Nodes to keep in memory in LRU i.e. cache.
\tNodes cache\t\t\t\t\t\t= 3000
\t
[Compressor]#
\t# The compression algorithm used.
\t# List of compressors is\t\t:= [none, LZ4_Fast_No_Meta, LZ4_Fast_With_Meta].
\t# none\t\t\t\t\t\t\t:= Compression disabled.
\t
\t# LZ4_fast_no_meta\t\t\t\t:= Official LZ4 library is used with options: Fast and no Meta size information.
\t# This version is ideal when using fixed sized l-blocks, which can not overflow.
\t# Additionally, a c-block may never exceed the l-block size by any means, hence it uses a fixed allocation for 
\t# a decompression buffer and may never overflow consequently.
\t
\t# LZ4_Fast_With_Meta\t\t\t:= Official LZ4 library is used with options: Fast and includes Meta size information.
\t# Note: This version will guarantee at any sizes, that the compressor/decompressor allocates sufficient space,
\t# even if provided with less allocation. This ensures dynamic l-blocks of any sizes and allows different l-block sizes across
\t# the "cold" vs. "warm" regions.
\t# This guarantee comes with a small penalty, hence should only be used with caution.
\t# Later it is planned to switch dynamically between compressors, to ensure cold regions benefit from wider l-blocks
\t# and the warm regions stay fast with aligned l-blocks.
\t# The system does not support switching between compressors dynamically, yet.
\tCompressor\t\t\t\t\t\t= LZ4_Fast_No_Meta
\t
\t# For lz4 the extra parameter is the compression level.
\t# Use of the the wrapped variants:
\t\t# {"I32":<Signed Integer>}
\t\t# {"I32":"None"}
\t# Note: LZ4 variants expect an extra of i32.
\tCompressor extras\t\t\t\t= {"I32":12}
\t
\t# Number of river threads in the delta.
\t# 0\t\t\t\t\t\t\t\t:= Pipeline bypassed.
\t# t \t\t\t\t\t\t\t:= Number of CPU threads.
\t# c \t\t\t\t\t\t\t:= Number of CPU cores.
\t# d \t\t\t\t\t\t\t:= Default number threads.
\t# <number> \t\t\t\t\t\t:= <number> of threads.
\t# [t|c] - <number>\t\t\t\t:= [t|c] - <number> of threads.
\tRiver threads \t\t\t\t\t= t

\t# Number of jobs to queue in the delta before blocking.
\t# Larger queues may enhance performance, but require longer syncing, when shutdown. 
\t# This value * number of disks must be always smaller than MacroBlocksCache.
\tMax delta queue\t\t\t\t\t= 10
\t
\t
\t
\t
########################### End ChronicleDB Configuration File ###########################\t
##########################################################################################
##########################################################################################
##########################################################################################
##########################################################################################`;
