import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate, useLocation, useOutlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    LayoutDashboard,
    Clock,
    PlusCircle,
    Upload,
    LogOut,
    Menu,
    ChevronsLeft,
    ChevronsRight,
    Server,
    ShieldCheck,
    Key,
    Globe,
} from 'lucide-react';
import ImportBotDialog from '@/components/ImportBotDialog';
import { cn } from "@/lib/utils";
import BotForm from "@/components/BotForm";
import GlobalSearch from '@/components/GlobalSearch';
import { useToast } from "@/hooks/use-toast";
import { apiHelper } from '@/lib/api';
import { useAppStore } from '@/stores/appStore';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import PanelUpdateDialog from '@/components/PanelUpdateDialog';
import PresenceButton from '@/components/PresenceButton';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TelegramWidget from '@/components/TelegramWidget';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const SIDEBAR_TRANSITION = 'duration-300 ease-out';

const sidebarLabelClasses = (isCollapsed, className = '') =>
    cn(
        "overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform,margin] " + SIDEBAR_TRANSITION,
        isCollapsed ? "ml-0 max-w-0 opacity-0 -translate-x-2" : "ml-0 max-w-[180px] opacity-100 translate-x-0",
        className
    );

const sidebarTextStackClasses = (isCollapsed, className = '') =>
    cn(
        "flex min-w-0 flex-col overflow-hidden transition-[max-width,opacity,transform] " + SIDEBAR_TRANSITION,
        isCollapsed ? "max-w-0 opacity-0 -translate-x-2" : "max-w-[200px] opacity-100 translate-x-0",
        className
    );

const sidebarAvatarBadgeClasses = (isCollapsed) =>
    cn(
        "overflow-hidden transition-[width,opacity,transform] " + SIDEBAR_TRANSITION,
        isCollapsed ? "w-6 opacity-100 scale-100" : "w-0 opacity-0 scale-90"
    );

const sidebarBrandLogoClasses = (isHidden) =>
    cn(
        "h-9 shrink-0 overflow-hidden rounded-2xl transition-[width,opacity,transform] " + SIDEBAR_TRANSITION,
        isHidden ? "w-0 opacity-0 scale-90" : "w-9 opacity-100 scale-100"
    );

const SortableBotItem = ({ bot, isCollapsed, botStatuses, onLinkClick, isDragging: globalIsDragging }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: bot.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleClick = (e) => {
        if (isDragging || globalIsDragging) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        onLinkClick(e);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onMouseDown={(e) => {
                if (isDragging || globalIsDragging) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }}
        >
            <NavLink
                to={`/bots/${bot.id}`}
                onClick={handleClick}
                data-bot-id={bot.id}
                className={({ isActive }) => cn(
                    "relative flex items-center gap-2.5 rounded-full px-3.5 py-2 text-xs transition-[background-color,color,gap,padding] " + SIDEBAR_TRANSITION,
                    isActive
                        ? "bg-secondary text-secondary-foreground font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/80",
                    isCollapsed && "mx-auto h-10 w-12 justify-center gap-0 px-0 py-0"
                )}
            >
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={cn(
                        "w-2 h-2 rounded-full transition-all duration-200",
                        botStatuses[bot.id] === 'running'
                            ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse'
                            : 'bg-muted-foreground/45'
                    )} />
                    <div className={sidebarAvatarBadgeClasses(isCollapsed)}>
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                            <span className="text-xs font-bold">
                                {bot.username.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className={sidebarTextStackClasses(isCollapsed)}>
                    <span className="font-medium truncate text-xs">{bot.username}</span>
                    <span className="text-[11px] opacity-75 truncate leading-tight">{bot.note || `${bot.server.host}:${bot.server.port}`}</span>
                </div>
            </NavLink>
        </div>
    );
};

const BotItem = ({ bot, isCollapsed, botStatuses, onLinkClick }) => {
    return (
        <NavLink
            to={`/bots/${bot.id}`}
            onClick={onLinkClick}
            data-bot-id={bot.id}
            className={({ isActive }) => cn(
                "relative flex items-center gap-2.5 rounded-full px-3.5 py-2 text-xs transition-[background-color,color,gap,padding] " + SIDEBAR_TRANSITION,
                isActive
                    ? "bg-secondary text-secondary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80",
                isCollapsed && "mx-auto h-10 w-12 justify-center gap-0 px-0 py-0"
            )}
        >
            <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className={cn(
                    "w-2 h-2 rounded-full transition-all duration-200",
                    botStatuses[bot.id] === 'running'
                        ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse'
                        : 'bg-muted-foreground/45'
                )} />
                <div className={sidebarAvatarBadgeClasses(isCollapsed)}>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <span className="text-xs font-bold">
                            {bot.username.charAt(0).toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>
            <div className={sidebarTextStackClasses(isCollapsed)}>
                <span className="font-medium truncate text-xs">{bot.username}</span>
                <span className="text-[11px] opacity-75 truncate leading-tight">{bot.note || `${bot.server.host}:${bot.server.port}`}</span>
            </div>
        </NavLink>
    );
};

const OutletViewport = React.memo(function OutletViewport({ children }) {
    return (
        <main
            className="min-w-0 overflow-y-auto bg-background md:my-2 md:mr-2 md:rounded-[28px] md:border md:border-border/50 md:shadow-sm"
            style={{ contain: 'layout paint' }}
        >
            {children}
        </main>
    );
});

const SidebarNav = ({ onLinkClick, isCollapsed, isSheetOpen }) => {
    const { t } = useTranslation(['sidebar', 'common']);
    const bots = useAppStore(state => state.bots);
    const botStatuses = useAppStore(state => state.botStatuses);
    const hasPermission = useAppStore(state => state.hasPermission);
    const updateBotOrder = useAppStore(state => state.updateBotOrder);
    const location = useLocation();
    const { toast } = useToast();
    const [isDragging, setIsDragging] = useState(false);

    const activeBotId = location.pathname.match(/\/bots\/(\d+)/)?.[1];

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 12,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = useCallback(() => {
        if (isSheetOpen) return;
        setIsDragging(true);
    }, [isSheetOpen]);

    const handleDragEnd = useCallback(async (event) => {
        const { active, over } = event;

        setTimeout(() => setIsDragging(false), 100);

        if (over && active.id !== over.id) {
            const oldIndex = bots.findIndex(bot => bot.id === active.id);
            const newIndex = bots.findIndex(bot => bot.id === over.id);

            const oldBots = [...bots];

            try {
                await new Promise(resolve => setTimeout(resolve, 50));

                const newBots = arrayMove(bots, oldIndex, newIndex);
                updateBotOrder(newBots);

                const targetBot = bots[newIndex];
                const newSortOrder = targetBot.sortOrder;

                await apiHelper(`/api/bots/${active.id}/sort-order`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        newPosition: newSortOrder,
                        oldIndex: oldIndex,
                        newIndex: newIndex
                    }),
                });

            } catch (error) {
                console.error('[Drag] Error:', error);
                updateBotOrder(oldBots);
                toast({
                    title: t('messages.error', { ns: 'common' }),
                    description: t('botOrderError'),
                    variant: "destructive",
                });
            }
        }
    }, [bots, updateBotOrder, toast, t]);

    useEffect(() => {
        if (isSheetOpen) {
            setIsDragging(false);
        }
    }, [isSheetOpen]);

    useEffect(() => {
        if (activeBotId) {
            const activeBotElement = document.querySelector(`[data-bot-id="${activeBotId}"]`);
            const scrollContainer = activeBotElement?.closest('.custom-scrollbar');

            if (activeBotElement && scrollContainer) {
                setTimeout(() => {
                    const containerRect = scrollContainer.getBoundingClientRect();
                    const elementRect = activeBotElement.getBoundingClientRect();

                    const isVisible = (
                        elementRect.top >= containerRect.top &&
                        elementRect.bottom <= containerRect.bottom
                    );

                    if (!isVisible) {
                        activeBotElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });
                    }
                }, 100);
            }
        }
    }, [activeBotId, bots]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDragging && !isSheetOpen) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        };

        const handleClick = (e) => {
            if (isDragging && !isSheetOpen) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        };

        const handleMouseDown = (e) => {
            if (isDragging && !isSheetOpen) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        };

        if (isDragging && !isSheetOpen) {
            window.addEventListener('beforeunload', handleBeforeUnload);
            document.addEventListener('click', handleClick, true);
            document.addEventListener('mousedown', handleMouseDown, true);
            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
                document.removeEventListener('click', handleClick, true);
                document.removeEventListener('mousedown', handleMouseDown, true);
            };
        }
    }, [isDragging, isSheetOpen]);

    const navLinkClasses = ({ isActive }) => cn(
        "relative flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-[background-color,color,gap,padding] " + SIDEBAR_TRANSITION,
        isActive
            ? "bg-secondary text-secondary-foreground font-semibold shadow-xs"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/80",
        isCollapsed && "mx-auto h-10 w-12 justify-center gap-0 px-0"
    );

    const iconAndText = (icon, text) => (
        <>
            {icon}
            <span className={sidebarLabelClasses(isCollapsed, "truncate")}>{text}</span>
        </>
    );

    return (
        <nav className="flex-1 flex flex-col gap-1 px-3 py-3 min-h-0 overflow-y-auto md:overflow-visible pb-20 md:pb-0 overscroll-contain">
            <NavLink to="/" end onClick={onLinkClick} className={navLinkClasses}>
                {iconAndText(<LayoutDashboard className="h-4 w-4 flex-shrink-0" />, t('dashboard'))}
            </NavLink>

            {hasPermission('task:list') && (
                <NavLink to="/tasks" onClick={onLinkClick} className={navLinkClasses}>
                    {iconAndText(<Clock className="h-4 w-4 flex-shrink-0" />, t('scheduler'))}
                </NavLink>
            )}

            {hasPermission('bot:update') && (
                <NavLink to="/proxy-config" onClick={onLinkClick} className={navLinkClasses}>
                    {iconAndText(<Globe className="h-4 w-4 flex-shrink-0" />, t('proxy'))}
                </NavLink>
            )}

            <TelegramWidget isCollapsed={isCollapsed} />

            <Separator className="my-2.5 bg-border/60" />

            <div className={cn(
                "overflow-hidden px-4 text-xs font-medium tracking-wide text-muted-foreground transition-[max-height,opacity,transform,padding] " + SIDEBAR_TRANSITION,
                isCollapsed ? "max-h-0 opacity-0 -translate-y-1 py-0" : "max-h-9 opacity-100 translate-y-0 py-1.5"
            )}>
                <div className="flex min-h-[15px] items-start">
                    <p className="block -translate-y-[6px] text-[11px] font-semibold leading-none text-muted-foreground uppercase tracking-wider">{t('bots')}</p>
                </div>
            </div>

            <div
                className={cn(
                    "min-h-0 custom-scrollbar transition-[max-height,padding] " + SIDEBAR_TRANSITION,
                    "flex-1 overflow-y-auto",
                    bots.length > 0 && "min-h-[96px]"
                )}
                style={{
                    maxHeight: bots.length > 4 ? '50vh' : 'auto',
                }}
            >
                {isSheetOpen ? (
                    <div className="space-y-1">
                        {bots.map((bot) => (
                            <BotItem key={bot.id} bot={bot} isCollapsed={isCollapsed} botStatuses={botStatuses} onLinkClick={onLinkClick} />
                        ))}
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={bots.map(bot => bot.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div
                                className="space-y-1"
                                onMouseDown={(e) => {
                                    if (isDragging) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }
                                }}
                                onClick={(e) => {
                                    if (isDragging) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }
                                }}
                            >
                                {bots.map((bot) => (
                                    <SortableBotItem key={bot.id} bot={bot} isCollapsed={isCollapsed} botStatuses={botStatuses} onLinkClick={onLinkClick} isDragging={isDragging} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
                <div className="pb-1"></div>
            </div>
        </nav>
    );
};

export default function Layout() {
    const { t } = useTranslation(['sidebar', 'common']);
    const navigate = useNavigate();
    const location = useLocation();
    const outlet = useOutlet();
    const { toast } = useToast();

    const user = useAppStore(state => state.user);
    const servers = useAppStore(state => state.servers);
    const proxies = useAppStore(state => state.proxies);
    const logout = useAppStore(state => state.logout);
    const createBot = useAppStore(state => state.createBot);
    const fetchInitialData = useAppStore(state => state.fetchInitialData);
    const hasPermission = useAppStore(state => state.hasPermission);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        return JSON.parse(localStorage.getItem('sidebar-collapsed')) || false;
    });
    const [isSidebarBrandHidden, setIsSidebarBrandHidden] = useState(() => {
        return JSON.parse(localStorage.getItem('sidebar-brand-hidden')) || false;
    });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const sessionId = params.get('github_session');
        if (!sessionId) return undefined;
        let stopped = false;
        apiHelper(`/api/github/connect/${sessionId}`)
            .then((status) => {
                if (stopped) return;
                if (status?.status === 'ready' && status.token) {
                    localStorage.setItem('blockmine_github_token', status.token);
                    toast({ title: t('github.connected', { ns: 'plugins', defaultValue: 'GitHub подключён' }) });
                } else {
                    toast({
                        variant: 'destructive',
                        title: t('github.failed', { ns: 'plugins', defaultValue: 'GitHub не подключился' }),
                    });
                }
            })
            .catch((error) => {
                if (stopped) return;
                toast({ variant: 'destructive', title: error.message || 'GitHub не подключился' });
            })
            .finally(() => {
                if (stopped) return;
                params.delete('github_session');
                const next = `${location.pathname}${params.toString() ? `?${params}` : ''}${location.hash || ''}`;
                navigate(next, { replace: true });
            });
        return () => {
            stopped = true;
        };
    }, [location.hash, location.pathname, location.search, navigate, t, toast]);

    useEffect(() => {
        if (location.state?.openCreateBotModal) {
            setIsCreateModalOpen(true);
            navigate(location.pathname, { replace: true, state: {} });
        }
        if (location.state?.openImportBotModal) {
            setIsImportModalOpen(true);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate, location.pathname]);

    useEffect(() => {
        localStorage.setItem('sidebar-collapsed', JSON.stringify(isSidebarCollapsed));
    }, [isSidebarCollapsed]);

    useEffect(() => {
        localStorage.setItem('sidebar-brand-hidden', JSON.stringify(isSidebarBrandHidden));
    }, [isSidebarBrandHidden]);

    const handleCreateBot = async (botData) => {
        setIsSaving(true);
        try {
            const newBot = await createBot(botData);
            if (newBot) {
                setIsCreateModalOpen(false);
                setIsSheetOpen(false);
                navigate(`/bots/${newBot.id}`);
            }
        } catch (error) {
            console.error("Не удалось создать бота:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleImportSuccess = (newBot) => {
        setIsImportModalOpen(false);
        setIsSheetOpen(false);
        fetchInitialData().then(() => {
            toast({ title: t('messages.success', { ns: 'common' }), description: t('botImported', { name: newBot.username }) });
            navigate(`/bots/${newBot.id}`);
        });
    };

    const handleLogout = () => {
        setIsLogoutDialogOpen(false);
        setIsSheetOpen(false);
        logout();
    };

    const bottomNavLinkClasses = (isCollapsed) => ({ isActive }) => cn(
        "relative flex items-center gap-2.5 rounded-full px-3.5 py-2 text-xs font-medium transition-[background-color,color,gap,padding] " + SIDEBAR_TRANSITION,
        isActive
            ? "bg-secondary text-secondary-foreground font-semibold shadow-xs"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/80",
        isCollapsed && "mx-auto h-9 w-12 justify-center gap-0 px-0"
    );

    const sidebarContent = (isCollapsed) => (
        <div className="flex flex-col h-full bg-card/85 overflow-hidden">
            <div className="px-4 pt-4 pb-2">
                <div className={cn(
                    "relative overflow-hidden transition-[height] " + SIDEBAR_TRANSITION,
                    isCollapsed ? "h-[76px]" : "h-[92px]"
                )}>
                    <div className={cn(
                        "absolute inset-0 flex flex-col justify-center gap-1.5 transition-all " + SIDEBAR_TRANSITION,
                        isCollapsed ? "pointer-events-none opacity-0 -translate-y-2 scale-95" : "opacity-100 translate-y-0 scale-100"
                    )}>
                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => setIsSidebarBrandHidden((previous) => !previous)}
                                aria-label={t(isSidebarBrandHidden ? 'brandToggle.show' : 'brandToggle.hide')}
                                title={t(isSidebarBrandHidden ? 'brandToggle.show' : 'brandToggle.hide')}
                                className={cn(
                                    "flex min-w-0 flex-1 items-center rounded-2xl px-2 py-1.5 text-left transition-[gap,background-color] " + SIDEBAR_TRANSITION,
                                    isSidebarBrandHidden ? "gap-0" : "gap-3",
                                    "hover:bg-muted/70"
                                )}
                            >
                                <div className={sidebarBrandLogoClasses(isSidebarBrandHidden)}>
                                    <img src="/logo.png" alt="MineDash Logo" className="h-9 w-9 rounded-2xl" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h2 className="font-display text-base font-semibold leading-tight tracking-tight">
                                        MineDash
                                    </h2>
                                    <p className="truncate text-xs leading-tight text-muted-foreground">
                                        {user?.username}
                                    </p>
                                </div>
                            </button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                className="hidden md:flex h-9 w-9 rounded-full hover:bg-muted/70"
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex items-center gap-1 px-1">
                            <ThemeToggle compact />
                            <LanguageSwitcher compact />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70"
                                onClick={() => {
                                    setIsSheetOpen(false);
                                    setIsLogoutDialogOpen(true);
                                }}
                                title={t('logout')}
                                aria-label={t('logout')}
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className={cn(
                        "absolute inset-0 flex flex-col items-center justify-center gap-2 transition-all " + SIDEBAR_TRANSITION,
                        isCollapsed ? "opacity-100 translate-y-0 scale-100" : "pointer-events-none opacity-0 translate-y-2 scale-95"
                    )}>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarCollapsed(false)}
                            className="h-9 w-9 rounded-full hover:bg-secondary"
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                        <button
                            type="button"
                            onClick={() => setIsSidebarBrandHidden((previous) => !previous)}
                            aria-label={t(isSidebarBrandHidden ? 'brandToggle.show' : 'brandToggle.hide')}
                            title={t(isSidebarBrandHidden ? 'brandToggle.show' : 'brandToggle.hide')}
                            className="relative mx-auto flex h-9 w-9 items-center justify-center rounded-2xl transition-colors duration-200 hover:bg-secondary"
                        >
                            <div className={cn(
                                "absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl transition-[opacity,transform] " + SIDEBAR_TRANSITION,
                                isSidebarBrandHidden ? "opacity-0 scale-90" : "opacity-100 scale-100"
                            )}>
                                <img src="/logo.png" alt="MineDash Logo" className="h-8 w-8 rounded-xl" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <SidebarNav onLinkClick={() => setIsSheetOpen(false)} isCollapsed={isCollapsed} isSheetOpen={isSheetOpen} />

            <div className="mt-auto p-3 sm:p-4 border-t border-border/50 space-y-1.5">
                {hasPermission('panel:user:list') && (
                    <NavLink
                        to="/admin"
                        onClick={() => setIsSheetOpen(false)}
                        className={bottomNavLinkClasses(isCollapsed)}
                    >
                        <ShieldCheck className="h-4 w-4 flex-shrink-0" />
                        <span className={sidebarLabelClasses(isCollapsed)}>{t('admin')}</span>
                    </NavLink>
                )}
                {hasPermission('api_key:list') && (
                    <NavLink
                        to="/api-keys"
                        onClick={() => setIsSheetOpen(false)}
                        className={bottomNavLinkClasses(isCollapsed)}
                    >
                        <Key className="h-4 w-4 flex-shrink-0" />
                        <span className={sidebarLabelClasses(isCollapsed)}>{t('apiKeys')}</span>
                    </NavLink>
                )}
                {hasPermission('server:list') && (
                    <NavLink
                        to="/servers"
                        onClick={() => setIsSheetOpen(false)}
                        className={bottomNavLinkClasses(isCollapsed)}
                    >
                        <Server className="h-4 w-4 flex-shrink-0" />
                        <span className={sidebarLabelClasses(isCollapsed)}>{t('servers')}</span>
                    </NavLink>
                )}

                {hasPermission('proxy:list') && (
                    <NavLink
                        to="/proxies"
                        onClick={() => setIsSheetOpen(false)}
                        className={bottomNavLinkClasses(isCollapsed)}
                    >
                        <Globe className="h-4 w-4 flex-shrink-0" />
                        <span className={sidebarLabelClasses(isCollapsed)}>{t('proxies')}</span>
                    </NavLink>
                )}

                <div className="flex flex-col gap-2 pt-1.5 px-1">
                    {hasPermission('bot:create') && (
                        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    className={cn(
                                        "w-full rounded-2xl shadow-sm transition-[padding,gap,background-color,box-shadow] duration-200 ease-out hover:shadow-md " + SIDEBAR_TRANSITION,
                                        isCollapsed ? "mx-auto h-10 w-10 rounded-2xl justify-center px-0 gap-0 self-center" : "h-10 justify-center"
                                    )}
                                    size="sm"
                                >
                                    <PlusCircle className="h-4 w-4 shrink-0" />
                                    <span className={sidebarLabelClasses(isCollapsed, "text-center")}>{t('createBot')}</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="h-[90vh] flex flex-col">
                                <VisuallyHidden>
                                    <DialogTitle>{t('createBotTitle')}</DialogTitle>
                                    <DialogDescription>
                                        {t('createBotDescription')}
                                    </DialogDescription>
                                </VisuallyHidden>
                                <BotForm servers={servers} proxies={proxies} onFormSubmit={handleCreateBot} isSaving={isSaving} isCreation={true} />
                            </DialogContent>
                        </Dialog>
                    )}
                    {hasPermission('bot:import') && (
                        <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="secondary"
                                    className={cn(
                                        "w-full rounded-2xl transition-[padding,gap,background-color,border-color,box-shadow] duration-200 ease-out " + SIDEBAR_TRANSITION,
                                        isCollapsed ? "mx-auto h-10 w-10 rounded-2xl justify-center px-0 gap-0 self-center" : "h-9 justify-center"
                                    )}
                                    size="sm"
                                >
                                    <Upload className="h-4 w-4 shrink-0" />
                                    <span className={sidebarLabelClasses(isCollapsed, "text-center")}>{t('importBot')}</span>
                                </Button>
                            </DialogTrigger>
                            <ImportBotDialog
                                onImportSuccess={handleImportSuccess}
                                onCancel={() => setIsImportModalOpen(false)}
                                servers={servers}
                            />
                        </Dialog>
                    )}
                </div>

                {isCollapsed && (
                    <div className="flex flex-col items-center gap-1 pt-1">
                        <ThemeToggle isCollapsed compact />
                        <LanguageSwitcher isCollapsed compact />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="mx-auto h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70"
                            onClick={() => {
                                setIsSheetOpen(false);
                                setIsLogoutDialogOpen(true);
                            }}
                            title={t('logout')}
                            aria-label={t('logout')}
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div
            className={cn(
                "grid h-[100dvh] md:h-screen bg-card/85 transition-[grid-template-columns] duration-300 ease-out",
                isSidebarCollapsed ? "md:grid-cols-[84px_1fr]" : "md:grid-cols-[280px_1fr]"
            )}
            style={{ willChange: 'grid-template-columns' }}
        >
            <div className="fixed z-40 flex items-center gap-2" style={{ top: 'max(14px, env(safe-area-inset-top))', right: 'max(16px, env(safe-area-inset-right))' }}>
                <GlobalSearch />
                <PresenceButton />
            </div>
            <div className="md:hidden fixed z-50 top-[max(0.5rem,env(safe-area-inset-top))] left-[max(0.5rem,env(safe-area-inset-left))]">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full bg-card/90 backdrop-blur border border-border/60 shadow-sm"
                            aria-label={t('openMenu')}
                        >
                            <Menu className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-full max-w-[85vw] sm:max-w-xs h-[100dvh] flex rounded-r-[28px] border-r-border/60">
                        {sidebarContent(false)}
                    </SheetContent>
                </Sheet>
            </div>

            <aside className="hidden overflow-hidden md:block">
                {sidebarContent(isSidebarCollapsed)}
            </aside>

            <OutletViewport>
                {outlet}
            </OutletViewport>

            <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('logoutDialog.title')}</AlertDialogTitle>
                        <AlertDialogDescription>{t('logoutDialog.description')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('logoutDialog.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout}>{t('logoutDialog.confirm')}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <PanelUpdateDialog />
        </div>
    );
}
