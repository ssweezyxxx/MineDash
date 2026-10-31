import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  ARG_TYPES,
  CHAT_TYPES,
  REPLY_MODES,
  buildCommandPayload,
  emptyArgument,
  emptyBuilderForm,
  validateBuilderForm,
} from '@/lib/commandBuilder';

const TEXT = {
  title: { ru: 'Конструктор команд', en: 'Command builder' },
  desc: {
    ru: 'Заполните форму, и панель сама соберёт команду. Потом её можно доработать в визуальном редакторе.',
    en: 'Fill in the form and the panel builds the command for you. You can refine it later in the visual editor.',
  },
  name: { ru: 'Название команды', en: 'Command name' },
  description: { ru: 'Описание', en: 'Description' },
  aliases: { ru: 'Псевдонимы (через запятую)', en: 'Aliases (comma separated)' },
  args: { ru: 'Аргументы', en: 'Arguments' },
  addArg: { ru: 'Добавить аргумент', en: 'Add argument' },
  argName: { ru: 'имя (латиницей)', en: 'name (latin)' },
  argType: { string: { ru: 'слово', en: 'word' }, number: { ru: 'число', en: 'number' }, greedy_string: { ru: 'весь остаток текста', en: 'rest of text' } },
  required: { ru: 'обязательный', en: 'required' },
  reply: { ru: 'Ответ бота', en: 'Bot reply' },
  replyHint: { ru: 'Вставляйте значения кликом по меткам:', en: 'Click a tag to insert a value:' },
  replyPlaceholder: { ru: 'Привет, {user}! Ты написал: {text}', en: 'Hi, {user}! You wrote: {text}' },
  replyIn: { ru: 'Куда отвечать', en: 'Reply to' },
  replyModes: { same: { ru: 'туда же, откуда пришла команда', en: 'same chat as the command' }, chat: { ru: 'общий чат', en: 'public chat' }, private: { ru: 'личные сообщения', en: 'private messages' }, clan: { ru: 'клановый чат', en: 'clan chat' }, local: { ru: 'локальный чат', en: 'local chat' } },
  allowed: { ru: 'Где команда работает', en: 'Where the command works' },
  chatTypes: { chat: { ru: 'общий', en: 'public' }, private: { ru: 'личные', en: 'private' }, clan: { ru: 'клан', en: 'clan' }, local: { ru: 'локальный', en: 'local' } },
  cooldown: { ru: 'Перезарядка, сек', en: 'Cooldown, sec' },
  permission: { ru: 'Нужное право', en: 'Required permission' },
  noPermission: { ru: 'без ограничений', en: 'no restriction' },
  preview: { ru: 'Пример вызова', en: 'Example call' },
  create: { ru: 'Создать', en: 'Create' },
  createOpen: { ru: 'Создать и открыть в редакторе', en: 'Create and open in editor' },
  unknown: { ru: 'Неизвестные метки (останутся пустыми):', en: 'Unknown tags (will render empty):' },
  errors: {
    nameRequired: { ru: 'Укажите название команды.', en: 'Enter a command name.' },
    nameInvalid: { ru: 'Название: буквы, цифры, _ и -, без пробелов, до 32 символов.', en: 'Name: letters, digits, _ and -, no spaces, up to 32 chars.' },
    argNameInvalid: { ru: 'Имя аргумента: латиница, цифры и _, не с цифры.', en: 'Argument name: latin letters, digits and _, not starting with a digit.' },
    argNameReserved: { ru: 'Имя «user» зарезервировано для ника игрока.', en: 'The name "user" is reserved for the player nickname.' },
    argNameDuplicate: { ru: 'Имена аргументов не должны повторяться.', en: 'Argument names must be unique.' },
    greedyMustBeLast: { ru: '«Весь остаток текста» может быть только последним аргументом.', en: '"Rest of text" can only be the last argument.' },
    replyRequired: { ru: 'Напишите текст ответа.', en: 'Write the reply text.' },
    chatTypesRequired: { ru: 'Выберите хотя бы один тип чата.', en: 'Pick at least one chat type.' },
  },
};

export function CommandBuilderDialog({ open, onOpenChange, onCreate, permissions = [] }) {
  const { i18n } = useTranslation();
  const lang = i18n?.language?.startsWith('ru') ? 'ru' : 'en';
  const tx = (entry) => entry[lang];

  const [form, setForm] = useState(emptyBuilderForm);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = (patch) => setForm((prev) => ({ ...prev, ...patch }));
  const setArg = (id, patch) => set({ args: form.args.map((a) => (a.id === id ? { ...a, ...patch } : a)) });
  const toggleChat = (type, on) =>
    set({ allowedChatTypes: on ? [...new Set([...form.allowedChatTypes, type])] : form.allowedChatTypes.filter((t) => t !== type) });

  const { errors, unknownPlaceholders } = useMemo(() => validateBuilderForm(form), [form]);
  const tags = ['user', ...form.args.map((a) => a.name.trim()).filter((n) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(n))];
  const example = `@${form.name.trim() || 'name'}${form.args.map((a) => ` <${a.name.trim() || '?'}>`).join('')}`;

  const submit = async (openEditor) => {
    setSubmitted(true);
    if (errors.length) return;
    setBusy(true);
    try {
      const ok = await onCreate(buildCommandPayload(form), openEditor);
      if (ok !== false) {
        setForm(emptyBuilderForm());
        setSubmitted(false);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{tx(TEXT.title)}</DialogTitle>
          <DialogDescription>{tx(TEXT.desc)}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>{tx(TEXT.name)}</Label>
            <Input value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="hello" />
            <p className="text-xs text-muted-foreground">{tx(TEXT.preview)}: <code>{example}</code></p>
          </div>

          <div className="grid gap-2">
            <Label>{tx(TEXT.description)}</Label>
            <Input value={form.description} onChange={(e) => set({ description: e.target.value })} />
          </div>

          <div className="grid gap-2">
            <Label>{tx(TEXT.aliases)}</Label>
            <Input value={form.aliases} onChange={(e) => set({ aliases: e.target.value })} placeholder="hi, hey" />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>{tx(TEXT.args)}</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => set({ args: [...form.args, emptyArgument()] })}>
                <Plus className="mr-1 h-4 w-4" />{tx(TEXT.addArg)}
              </Button>
            </div>
            {form.args.map((arg) => (
              <div key={arg.id} className="grid gap-2 rounded-md border p-2">
                <div className="flex gap-2">
                  <Input className="flex-1" value={arg.name} placeholder={tx(TEXT.argName)} onChange={(e) => setArg(arg.id, { name: e.target.value })} />
                  <Select value={arg.type} onValueChange={(v) => setArg(arg.id, { type: v })}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ARG_TYPES.map((type) => <SelectItem key={type} value={type}>{tx(TEXT.argType[type])}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="ghost" size="icon" onClick={() => set({ args: form.args.filter((a) => a.id !== arg.id) })}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Switch checked={arg.required} onCheckedChange={(v) => setArg(arg.id, { required: v })} />
                  <span>{tx(TEXT.required)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-2">
            <Label>{tx(TEXT.reply)}</Label>
            <Textarea rows={3} value={form.reply} onChange={(e) => set({ reply: e.target.value })} placeholder={tx(TEXT.replyPlaceholder)} />
            <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              <span>{tx(TEXT.replyHint)}</span>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="rounded border px-1.5 py-0.5 font-mono hover:bg-muted"
                  onClick={() => set({ reply: `${form.reply}{${tag}}` })}
                >
                  {`{${tag}}`}
                </button>
              ))}
            </div>
            {unknownPlaceholders.length > 0 && (
              <p className="text-xs text-amber-500">{tx(TEXT.unknown)} {unknownPlaceholders.map((p) => `{${p}}`).join(' ')}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>{tx(TEXT.replyIn)}</Label>
            <Select value={form.replyMode} onValueChange={(v) => set({ replyMode: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {REPLY_MODES.map((mode) => <SelectItem key={mode} value={mode}>{tx(TEXT.replyModes[mode])}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>{tx(TEXT.allowed)}</Label>
            <div className="flex flex-wrap gap-4">
              {CHAT_TYPES.map((type) => (
                <label key={type} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={form.allowedChatTypes.includes(type)} onCheckedChange={(v) => toggleChat(type, Boolean(v))} />
                  {tx(TEXT.chatTypes[type])}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>{tx(TEXT.cooldown)}</Label>
              <Input type="number" min={0} value={form.cooldown} onChange={(e) => set({ cooldown: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>{tx(TEXT.permission)}</Label>
              <Select value={form.permissionId ? String(form.permissionId) : 'none'} onValueChange={(v) => set({ permissionId: v === 'none' ? '' : v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{tx(TEXT.noPermission)}</SelectItem>
                  {permissions.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {submitted && errors.length > 0 && (
            <ul className="list-disc space-y-1 pl-5 text-sm text-destructive">
              {errors.map((code) => <li key={code}>{tx(TEXT.errors[code])}</li>)}
            </ul>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" disabled={busy} onClick={() => submit(true)}>{tx(TEXT.createOpen)}</Button>
          <Button type="button" disabled={busy} onClick={() => submit(false)}>{tx(TEXT.create)}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CommandBuilderDialog;
