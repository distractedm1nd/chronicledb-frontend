export type EventType = "Float" | "Integer" | "Compound" | "VarStringList" | "ConstStringList" | "VarFloatList" | "ConstFloatList" | "VarIntegerList" | "ConstIntegerList" | "VarString" | "ConstString";

export type StreamConfig = {
    Event: {[key in EventType]?: any}
}
