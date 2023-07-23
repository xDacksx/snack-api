import { TypedResponse } from "..";
import { GenderModel } from "../models";
import { ServerResponse } from "../server.interface";

export type ResGetGender = TypedResponse<ServerResponse<GenderModel | null>>;
