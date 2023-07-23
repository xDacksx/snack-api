import { TypedResponse } from "..";
import { RoleModel } from "../models";
import { ServerResponse } from "../server.interface";

export type ResGetRole = TypedResponse<ServerResponse<RoleModel | null>>;
