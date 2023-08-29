import { DispatchedFunctionResult } from "./dispatched-function";
import ActionType from "./e-action-type";
// export type Action = "add" | "getPosts" | "action1" | "action2" | "action3";

export type Action = ActionType;
export type Payload = unknown; 

export type OnDispatchResult = (
    res: DispatchedFunctionResult,
    action: Action
  ) => void;