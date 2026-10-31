// CopyMinePanel: pure helpers behind the "easy command builder".
// The builder produces exactly the data the panel already stores for a visual command
// (argumentsJson + graphJson), so a command made here opens in the normal visual editor.
import { randomUUID } from '@/lib/uuid';

export const ARG_TYPES = ['string', 'number', 'greedy_string'];
export const CHAT_TYPES = ['chat', 'private', 'clan', 'local'];
export const REPLY_MODES = ['same', ...CHAT_TYPES];

const NAME_RE = /^[\p{L}\p{N}_-]{1,32}$/u;
const ARG_NAME_RE = /^[a-zA-Z_][a-zA-Z0-9_]{0,31}$/;
const PLACEHOLDER_RE = /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g;

export function emptyArgument() {
  return { id: randomUUID(), name: '', type: 'string', required: true, description: '' };
}

export function emptyBuilderForm() {
  return {
    name: '',
    description: '',
    aliases: '',
    cooldown: 0,
    permissionId: '',
    allowedChatTypes: ['chat', 'private'],
    replyMode: 'same',
    reply: '',
    args: [],
  };
}

export function extractPlaceholders(text) {
  if (typeof text !== 'string') return [];
  return [...new Set([...text.matchAll(PLACEHOLDER_RE)].map((m) => m[1]))];
}

export function parseAliases(raw) {
  return [...new Set(
    String(raw || '')
      .split(/[,\s]+/)
      .map((a) => a.trim().replace(/^[@!/]+/, ''))
      .filter(Boolean),
  )];
}

/** Returns { errors: string[] (codes), unknownPlaceholders: string[] } */
export function validateBuilderForm(form) {
  const errors = [];
  const name = String(form.name || '').trim();
  if (!name) errors.push('nameRequired');
  else if (!NAME_RE.test(name)) errors.push('nameInvalid');

  const seen = new Set();
  for (const arg of form.args || []) {
    const argName = String(arg.name || '').trim();
    if (!ARG_NAME_RE.test(argName)) { errors.push('argNameInvalid'); break; }
    if (argName === 'user') { errors.push('argNameReserved'); break; }
    if (seen.has(argName)) { errors.push('argNameDuplicate'); break; }
    seen.add(argName);
  }

  const args = (form.args || []).map((a) => String(a.name || '').trim());
  const greedyIdx = (form.args || []).findIndex((a) => a.type === 'greedy_string');
  if (greedyIdx !== -1 && greedyIdx !== form.args.length - 1) errors.push('greedyMustBeLast');

  if (!String(form.reply || '').trim()) errors.push('replyRequired');

  if (!(form.allowedChatTypes || []).length) errors.push('chatTypesRequired');

  const known = new Set(['user', ...args]);
  const unknownPlaceholders = extractPlaceholders(form.reply).filter((p) => !known.has(p));
  return { errors, unknownPlaceholders };
}

/**
 * Graph in the panel's native format: { nodes, connections, variables }.
 *   start (event:command) --exec--> msg (action:send_message)
 * Every {placeholder} in the reply gets a data node wired into msg's `var_<name>` pin:
 *   {user}   -> data:get_user_field(user from start).username
 *   {<arg>}  -> data:get_argument(argumentName = <arg>).value
 * Unknown placeholders are left as plain text (the engine renders them empty).
 */
export function buildReplyGraph({ reply, replyMode = 'same', args = [] }) {
  const argNames = new Set(args.map((a) => String(a.name || '').trim()).filter(Boolean));
  const placeholders = extractPlaceholders(reply);

  const nodes = [{ id: 'start', type: 'event:command', position: { x: 80, y: 120 }, data: {} }];
  const connections = [];
  let edge = 0;
  const link = (sourceNodeId, sourcePinId, targetNodeId, targetPinId) =>
    connections.push({ id: `e${++edge}`, sourceNodeId, targetNodeId, sourcePinId, targetPinId });

  const msgData = { message: reply };
  if (replyMode !== 'same') msgData.chat_type = replyMode; // omitted => engine replies in the chat the command came from
  nodes.push({ id: 'reply', type: 'action:send_message', position: { x: 620, y: 120 }, data: msgData });
  link('start', 'exec', 'reply', 'exec');

  let row = 0;
  for (const name of placeholders) {
    const y = 330 + row * 130;
    if (name === 'user') {
      nodes.push({ id: 'ph_user', type: 'data:get_user_field', position: { x: 340, y }, data: {} });
      link('start', 'user', 'ph_user', 'user');
      link('ph_user', 'username', 'reply', 'var_user');
      row++;
    } else if (argNames.has(name)) {
      const id = `ph_${name}`;
      nodes.push({ id, type: 'data:get_argument', position: { x: 340, y }, data: { argumentName: name } });
      link(id, 'value', 'reply', `var_${name}`);
      row++;
    }
  }
  return { nodes, connections, variables: [] };
}

/** Body for POST /api/bots/:botId/commands (same endpoint the existing "create command" dialog uses). */
export function buildCommandPayload(form) {
  const args = (form.args || []).map((a) => ({
    id: a.id || randomUUID(),
    name: String(a.name).trim(),
    type: ARG_TYPES.includes(a.type) ? a.type : 'string',
    required: Boolean(a.required),
    description: String(a.description || '').trim() || String(a.name).trim(),
  }));
  const cooldown = Math.max(0, Math.floor(Number(form.cooldown) || 0));
  return {
    name: String(form.name).trim(),
    description: String(form.description || '').trim(),
    aliases: parseAliases(form.aliases),
    cooldown,
    permissionId: form.permissionId ? Number(form.permissionId) : null,
    allowedChatTypes: form.allowedChatTypes.filter((t) => CHAT_TYPES.includes(t)),
    isVisual: true,
    argumentsJson: JSON.stringify(args),
    graphJson: JSON.stringify(buildReplyGraph({ reply: form.reply, replyMode: form.replyMode, args })),
  };
}
