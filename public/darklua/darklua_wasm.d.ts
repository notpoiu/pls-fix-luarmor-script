/* tslint:disable */
/* eslint-disable */
export function process_code(code: string, opt_config: any): string;
export function get_all_rule_names(): any[];
export function get_serialized_default_rules(): string;
export class Configuration {
  free(): void;
  constructor();
  column_width: number;
  line_endings: string;
  indentation_type: string;
  indentation_width: number;
  quote_style: string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_configuration_free: (a: number, b: number) => void;
  readonly configuration_new: () => number;
  readonly configuration_column_width: (a: number) => number;
  readonly configuration_line_endings: (a: number, b: number) => void;
  readonly configuration_indentation_type: (a: number, b: number) => void;
  readonly configuration_indentation_width: (a: number) => number;
  readonly configuration_quote_style: (a: number, b: number) => void;
  readonly configuration_set_column_width: (a: number, b: number) => void;
  readonly configuration_set_line_endings: (a: number, b: number, c: number) => void;
  readonly configuration_set_indentation_type: (a: number, b: number, c: number) => void;
  readonly configuration_set_indentation_width: (a: number, b: number) => void;
  readonly configuration_set_quote_style: (a: number, b: number, c: number) => void;
  readonly process_code: (a: number, b: number, c: number, d: number) => void;
  readonly get_all_rule_names: (a: number) => void;
  readonly get_serialized_default_rules: (a: number) => void;
  readonly __wbindgen_export_0: (a: number) => void;
  readonly __wbindgen_export_1: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_2: (a: number, b: number) => number;
  readonly __wbindgen_export_3: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
