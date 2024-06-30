import { ReactNode } from "react";

export interface IAction {
    label: string;
    icon?: ReactNode;
    run(...args: unknown[]): unknown;
}