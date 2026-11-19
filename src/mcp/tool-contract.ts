/**
 * Tool contract of a connector: the tools it must list (name and whether it is read-only), compared with what a
 * server really lists — in unit tests and in the post-deploy smoke test — plus the check that no tool
 * description mentions a tool that is not registered.
 */

/** One expected tool: its name and whether it is read-only. */
export interface ToolContractEntry {
  readonly name: string;
  readonly readOnly: boolean;
}

/** A tool as `tools/list` returns it (only the fields the contract uses). */
export interface ListedTool {
  readonly name: string;
  readonly annotations?: { readonly readOnlyHint?: boolean } | undefined;
}

/** A tool as the registry describes it: name, description and argument schemas (with their descriptions). */
export interface DescribedTool {
  readonly name: string;
  readonly description: string;
  readonly shape: Readonly<Record<string, { readonly description?: string | undefined }>>;
}

/** Reads a contract file (`{ "tools": [{ "name", "readOnly" }] }`); throws when it does not have that shape. */
export function readToolContract(json: unknown): ToolContractEntry[] {
  const tools = (json as { tools?: unknown } | null)?.tools;
  const valid =
    Array.isArray(tools) &&
    tools.every((t: unknown) => {
      const entry = t as Partial<ToolContractEntry> | null;
      return typeof entry?.name === 'string' && typeof entry.readOnly === 'boolean';
    });
  if (!valid)
    throw new Error('Invalid tool contract: expected { "tools": [{ "name", "readOnly" }] }.');
  return toolContractOf((tools as ToolContractEntry[]).map(contractEntryAsListed));
}

/** A contract entry in the `tools/list` shape, so both sides are normalized the same way. */
export function contractEntryAsListed(entry: ToolContractEntry): ListedTool {
  return { name: entry.name, annotations: { readOnlyHint: entry.readOnly } };
}

/** Tools of a JSON-RPC `tools/list` response; throws when it is an error or has no tool list. */
export function toolsFromListResponse(json: unknown): ListedTool[] {
  const tools = (json as { result?: { tools?: unknown } } | null)?.result?.tools;
  if (!Array.isArray(tools))
    throw new Error(`tools/list did not return tools: ${JSON.stringify(json).slice(0, 300)}`);
  return tools as ListedTool[];
}

/** Turns a `tools/list` answer into contract entries, sorted by name. */
export function toolContractOf(tools: readonly ListedTool[]): ToolContractEntry[] {
  return tools
    .map((t) => ({ name: t.name, readOnly: t.annotations?.readOnlyHint === true }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Differences between the expected and the listed tools (missing, unexpected, read-only flag); empty if equal. */
export function toolContractDiff(
  expected: readonly ToolContractEntry[],
  listed: readonly ToolContractEntry[],
): string[] {
  const actual = new Map(listed.map((t) => [t.name, t.readOnly]));
  const wanted = new Map(expected.map((t) => [t.name, t.readOnly]));
  const problems = expected.flatMap((t) => {
    if (!actual.has(t.name)) return [`missing tool: ${t.name}`];
    const got = actual.get(t.name);
    return got === t.readOnly
      ? []
      : [`${t.name}: readOnly is ${String(got)}, expected ${String(t.readOnly)}`];
  });
  const extra = listed.filter((t) => !wanted.has(t.name)).map((t) => `unexpected tool: ${t.name}`);
  return [...problems, ...extra];
}

/** Distinct snake_case words of a text (the shape of a tool name, e.g. `send_message`). */
export function snakeCaseWords(text: string): string[] {
  return [...new Set(text.match(/\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b/g) ?? [])];
}

/** Every text the model reads about a tool: its description and its arguments' descriptions. */
export function toolTexts(tool: DescribedTool): string[] {
  const args = Object.values(tool.shape).map((schema) => schema.description ?? '');
  return [tool.description, ...args];
}

/**
 * Tool-like words in descriptions that are not registered tools, as `tool → word`; argument names and the
 * `ignore` list (API terms such as `online_upload`) are not tool names. Empty when every mention is registered.
 */
export function unregisteredToolMentions(
  tools: readonly DescribedTool[],
  ignore: readonly string[],
): string[] {
  const known = new Set([...tools.map((t) => t.name), ...ignore]);
  for (const t of tools) for (const arg of Object.keys(t.shape)) known.add(arg);
  return tools.flatMap((t) =>
    snakeCaseWords(toolTexts(t).join(' '))
      .filter((word) => !known.has(word))
      .map((word) => `${t.name} → ${word}`),
  );
}
