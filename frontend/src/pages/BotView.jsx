import React, { useState, useMemo, useEffect } from 'react';
import { useParams, NavLink, useNavigate, useOutlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Play, Square, Settings, Puzzle, Terminal, Trash2, Users, Download, Loader2, Zap, Sparkles, Wifi, Gamepad2 } from 'lucide-react';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ExportBotDialog from '@/components/ExportBotDialog';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { useAppStore } from '@/stores/appStore';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

import { AnimatePresence, motion } from 'framer-motion';

const EMPTY_EXTENSIONS = [];
const UI_EXTENSION_LABEL_TRANSLATIONS = {
    'Модерация': {
        ru: 'Модерация',
        en: 'Moderation',
    },
};
const TRANSLATABLE_BOT_STATUSES = new Set(['running', 'stopped', 'starting', 'stopping', 'restarting']);

const BOT_STATUS_STYLES = {
    running: {
        badge: 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400',
        dot: 'bg-emerald-400 animate-pulse',
    },
    stopped: {
        badge: 'bg-red-500/15 border-red-500/25 text-red-400',
        dot: 'bg-red-400',
    },
    starting: {
        badge: 'bg-amber-500/15 border-amber-500/25 text-amber-400',
        dot: 'bg-amber-400 animate-pulse',
    },
    stopping: {
        badge: 'bg-orange-500/15 border-orange-500/25 text-orange-400',
        dot: 'bg-orange-400 animate-pulse',
    },
    restarting: {
        badge: 'bg-sky-500/15 border-sky-500/25 text-sky-400',
        dot: 'bg-sky-400 animate-pulse',
    },
};

function resolveUiExtensionLabel(extension, language) {
    const currentLanguage = language?.split('-')[0] || 'ru';
    const fallbackLanguage = currentLanguage === 'ru' ? 'en' : 'ru';

    const tryLocalizedValue = (value) => {
        if (!value) return null;
        if (typeof value === 'string') {
            const mapped = UI_EXTENSION_LABEL_TRANSLATIONS[value.trim()];
            return mapped?.[currentLanguage] || mapped?.[fallbackLanguage] || value;
        }
        if (typeof value === 'object') {
            return (
                value[currentLanguage] ||
                value[language] ||
                value[fallbackLanguage] ||
                value.en ||
                value.ru ||
                Object.values(value).find((item) => typeof item === 'string') ||
                null
            );
        }
        return null;
    };

    return (
        tryLocalizedValue(extension?.label) ||
        tryLocalizedValue(extension?.labels) ||
        tryLocalizedValue(extension?.title) ||
        tryLocalizedValue(extension?.name) ||
        extension?.id ||
        extension?.identifier ||
        `unknown-extension:${extension?.type || 'unknown'}` ||
        ''
    );
}

function resolveBotStatusLabel(status, t) {
    const normalizedStatus = typeof status === 'string' && status.trim() ? status.trim().toLowerCase() : 'stopped';

    if (TRANSLATABLE_BOT_STATUSES.has(normalizedStatus)) {
        return t(`status.${normalizedStatus}`, { defaultValue: normalizedStatus });
    }

    return normalizedStatus;
}

export default function BotView() {
    const { t, i18n } = useTranslation('bots');
    const { botId } = useParams();
    const navigate = useNavigate();
    const outlet = useOutlet();

    if (!botId) {
        return null;
    }

    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    const bots = useAppStore(state => state.bots);
    const botStatuses = useAppStore(state => state.botStatuses);
    const startBot = useAppStore(state => state.startBot);
    const stopBot = useAppStore(state => state.stopBot);
    const restartBot = useAppStore(state => state.restartBot);
    const deleteBot = useAppStore(state => state.deleteBot);
    const hasPermission = useAppStore(state => state.hasPermission);
    const fetchUIExtensions = useAppStore(state => state.fetchUIExtensions);

    const uiExtensions = useAppStore(state => state.botUIExtensions[botId] || EMPTY_EXTENSIONS);

    const bot = useMemo(() => {
        return bots.find(b => b.id === parseInt(botId));
    }, [bots, botId]);

    useEffect(() => {
        if (Array.isArray(bots) && bots.length > 0 && !bot) {
            navigate('/', { replace: true });
        }
    }, [bots, bot, navigate]);

    useEffect(() => {
        if (botId) {
            fetchUIExtensions(parseInt(botId, 10));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [botId]);

    const handleDeleteConfirm = async () => {
        if (!bot) return;
        try {
            await deleteBot(bot.id);
            navigate('/', { replace: true });
        } catch (e) {
            console.error(t('view.deleteError'), e);
        }
    };

    if (!bot) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                {t('view.loading')}
            </div>
        );
    }

    const rawBotStatus = botStatuses[bot.id] || 'stopped';
    const isRunning = rawBotStatus === 'running';
    const botStatusLabel = resolveBotStatusLabel(rawBotStatus, t);
    const botStatusStyle = BOT_STATUS_STYLES[rawBotStatus] || BOT_STATUS_STYLES.stopped;
    const botTabLinkClasses = ({ isActive }) =>
        cn(
            "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shrink-0 transition-[background-color,color,box-shadow,opacity] duration-200 ease-out",
            isActive
                ? "bg-secondary text-secondary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
        );

    return (
        <>
            <div className="flex flex-col h-full w-full overflow-hidden">
                <header className="shrink-0 px-5 pt-4 pb-3 border-b border-border/50">
                    <div className="flex items-center justify-between gap-3 mb-3.5 md:pr-12 lg:pr-16 xl:pr-20">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2.5 flex-wrap">
                                    <h1 className="font-display text-2xl font-semibold tracking-tight leading-none truncate">
                                        {bot.username}
                                    </h1>
                                    <span className="inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full bg-card border border-border/60 px-3 text-xs leading-none text-muted-foreground">
                                        <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 animate-pulse" />
                                        {bot.server.host}:{bot.server.port}
                                    </span>
                                    {bot.note && (
                                        <span className="inline-flex h-6 max-w-[200px] shrink-0 items-center rounded-full bg-secondary/70 text-secondary-foreground px-3 text-xs leading-none truncate">
                                            {bot.note}
                                        </span>
                                    )}
                                    <AnimatePresence mode="wait" initial={false}>
                                        <div className="inline-flex h-6 shrink-0 self-center">
                                            <motion.div
                                                key={rawBotStatus}
                                                initial={{ opacity: 0, scale: 0.96 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.98 }}
                                                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                                                className={cn(
                                                    "inline-flex h-6 items-center gap-1.5 rounded-full border px-3 text-[11px] font-medium",
                                                    botStatusStyle.badge
                                                )}
                                            >
                                                <div className={cn("h-1.5 w-1.5 rounded-full", botStatusStyle.dot)} />
                                                <span className="font-semibold uppercase leading-none tracking-wide">
                                                    {botStatusLabel}
                                                </span>
                                            </motion.div>
                                        </div>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <nav className="flex items-center gap-1 bg-card border border-border/60 rounded-full p-1 overflow-x-auto whitespace-nowrap -mx-2 px-2 md:mx-0 md:px-1.5">
                            <NavLink
                                to="console"
                                className={botTabLinkClasses}
                            >
                                <Terminal className="h-4 w-4" />
                                {t('tabs.console')}
                            </NavLink>
                            <NavLink
                                to="minecraft-viewer"
                                className={botTabLinkClasses}
                            >
                                <Gamepad2 className="h-4 w-4" />
                                {t('tabs.minecraftViewer')}
                            </NavLink>
                            <NavLink
                                to="plugins"
                                end
                                className={botTabLinkClasses}
                            >
                                <Puzzle className="h-4 w-4" />
                                {t('tabs.plugins')}
                            </NavLink>
                            {uiExtensions.map(ext => {
                                const IconComponent = Icons[ext.icon] || Icons.Puzzle;
                                const extensionLabel = resolveUiExtensionLabel(ext, i18n.language);
                                return (
                                    <NavLink
                                        key={ext.id}
                                        to={`plugins/ui/${ext.pluginName}/${ext.path}`}
                                        className={botTabLinkClasses}
                                    >
                                        <IconComponent className="h-4 w-4" />
                                        {extensionLabel}
                                    </NavLink>
                                );
                            })}
                            <NavLink
                                to="settings"
                                className={botTabLinkClasses}
                            >
                                <Settings className="h-4 w-4" />
                                {t('tabs.settings')}
                            </NavLink>
                            <NavLink
                                to="events"
                                className={botTabLinkClasses}
                            >
                                <Zap className="h-4 w-4" />
                                {t('tabs.events')}
                            </NavLink>
                            <NavLink
                                to="management"
                                className={botTabLinkClasses}
                            >
                                <Users className="h-4 w-4" />
                                {t('tabs.management')}
                            </NavLink>
                            <NavLink
                                to="websocket"
                                className={botTabLinkClasses}
                            >
                                <Wifi className="h-4 w-4" />
                                {t('tabs.websocket')}
                            </NavLink>
                        </nav>

                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                            {hasPermission('bot:start_stop') && (
                                <>
                                    <Button
                                        variant="outline"
                                        size="xs"
                                        onClick={() => startBot(bot.id)}
                                        disabled={isRunning}
                                        className="h-8 px-3.5 text-xs rounded-full bg-emerald-500/15 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/25 hover:text-emerald-300"
                                    >
                                        <Play className="h-3.5 w-3.5 mr-1" />
                                        <span className="hidden sm:inline">{t('actions.start')}</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="xs"
                                        onClick={() => stopBot(bot.id)}
                                        disabled={!isRunning}
                                        className="h-8 px-3.5 text-xs rounded-full bg-red-500/15 border-red-500/25 text-red-400 hover:bg-red-500/25 hover:text-red-300"
                                    >
                                        <Square className="h-3.5 w-3.5 mr-1" />
                                        <span className="hidden sm:inline">{t('actions.stop')}</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="xs"
                                        onClick={() => restartBot(bot.id)}
                                        disabled={!isRunning}
                                        className="h-8 px-3.5 text-xs rounded-full bg-amber-500/15 border-amber-500/25 text-amber-400 hover:bg-amber-500/25 hover:text-amber-300"
                                    >
                                        <Sparkles className="h-3.5 w-3.5 mr-1" />
                                        <span className="hidden sm:inline">{t('actions.restart')}</span>
                                    </Button>
                                </>
                            )}
                            {hasPermission('bot:export') && (
                                <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="secondary"
                                            size="xs"
                                            title={t('actions.export')}
                                            className="h-8 w-8 p-0 rounded-full"
                                        >
                                            <Download className="h-3.5 w-3.5" />
                                        </Button>
                                    </DialogTrigger>
                                    <ExportBotDialog bot={bot} onCancel={() => setIsExportModalOpen(false)} />
                                </Dialog>
                            )}
                            {hasPermission('bot:delete') && (
                                <Button
                                    variant="ghost"
                                    size="xs"
                                    onClick={() => setIsDeleteConfirmOpen(true)}
                                    disabled={isRunning}
                                    title={t('actions.delete')}
                                    className="h-8 w-8 p-0 rounded-full text-red-400 hover:text-red-300 hover:bg-red-500/15"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            )}
                        </div>
                    </div>
                </header>

                <main className="relative flex-grow min-h-0 overflow-hidden">
                    <div className="h-full min-h-0">
                        {outlet}
                    </div>
                </main>
            </div>

            <ConfirmationDialog
                open={isDeleteConfirmOpen}
                onOpenChange={setIsDeleteConfirmOpen}
                title={t('deleteDialog.title', { username: bot.username })}
                description={t('deleteDialog.description')}
                onConfirm={handleDeleteConfirm}
                confirmText={t('deleteDialog.confirm')}
            />
        </>
    );
}
