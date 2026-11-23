// The /planejamento skill text: it names only real tools of this marketplace's connectors and no write tool.
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(import.meta.dirname, '..', '..', '..', '..');
const SKILL = join(ROOT, 'connectors', 'canvas-puc', 'plugin', 'skills', 'planejamento');
const TEXT = [
  readFileSync(join(SKILL, 'SKILL.md'), 'utf8'),
  ...readdirSync(join(SKILL, 'references')).map((f) =>
    readFileSync(join(SKILL, 'references', f), 'utf8'),
  ),
].join('\n');

interface ContractTool {
  name: string;
  readOnly: boolean;
}

function contract(connector: string): ContractTool[] {
  const file = join(ROOT, 'connectors', connector, 'tool-contract.json');
  return (JSON.parse(readFileSync(file, 'utf8')) as { tools: ContractTool[] }).tools;
}

const CONNECTORS = ['canvas-puc', 'gmail', 'whatsapp'] as const;
const TOOLS = new Map(CONNECTORS.map((c) => [c, contract(c)]));
const ALL = [...TOOLS.values()].flat();

describe('/planejamento skill text', () => {
  it('has the skill frontmatter of the plugin', () => {
    expect(TEXT).toMatch(/^---\nname: planejamento\ndescription: .*\/planejamento.*\n---/);
  });
  it('names only tools that exist in the connector contracts', () => {
    const prefixed = [...TEXT.matchAll(/mcp__(canvas-puc|gmail|whatsapp)__([a-z_]+)/g)];
    expect(prefixed.length).toBeGreaterThan(0);
    for (const [, server, tool] of prefixed) {
      expect(TOOLS.get(server as (typeof CONNECTORS)[number])?.map((t) => t.name)).toContain(tool);
    }
  });
  it('asks for every Canvas read tool the plan needs', () => {
    const needed = [
      'list_courses',
      'get_grades',
      'upcoming_assignments',
      'list_assignments',
      'get_assignment',
      'list_announcements',
      'get_calendar',
      'list_modules',
      'list_files',
      'read_file_text',
      'list_conversations',
      'get_conversation',
      'search_threads',
      'get_thread',
      'list_chats',
      'get_messages',
    ];
    for (const tool of needed) {
      expect(ALL.find((t) => t.name === tool)?.readOnly).toBe(true);
      expect(TEXT).toContain(`\`${tool}\``);
    }
  });
  it('never names a write tool of the connectors', () => {
    const writes = ALL.filter((t) => !t.readOnly).map((t) => t.name);
    expect(writes.length).toBeGreaterThan(5);
    for (const tool of writes) expect(TEXT).not.toMatch(new RegExp(`\`${tool}\`|__${tool}\\b`));
  });
  it('degrades without Gmail and WhatsApp and lists them as not connected', () => {
    expect(TEXT).toContain('skipped silently and added to\n   `missingSources`');
    expect(TEXT).toContain('Fontes não conectadas');
  });
});
