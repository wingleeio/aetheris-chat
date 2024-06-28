import { EventEmitter } from "tsee";

type Events = {};

export const events = new EventEmitter<Events>();
