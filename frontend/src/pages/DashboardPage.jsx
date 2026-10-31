import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Bot,
    Play,
    Square,
    Upload,
    Activity,
    Zap,
    Server,
    Circle,
    Cpu,
    MemoryStick,
    Settings,
    CalendarClock,
    MessageSquarePlus,
    Github,
} from 'lucide-react';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import ImportBotDialog from '@/components/ImportBotDialog';
import ResourceUsageWidget from '@/components/ResourceUsageWidget';
import { useAppStore } from '@/stores/appStore';
import { cn } from '@/lib/utils';
import { apiHelper } from '@/lib/api';

export default function DashboardPage() {
    const { t } = useTranslation(['dashboard', 'common']);
    const bots = useAppStore(state => state.bots);
    const botStatuses = useAppStore(state => state.botStatuses);
    const resourceUsage = useAppStore(state => state.resourceUsage);
    const fetchInitialData = useAppStore(state => state.fetchInitialData);
    const startAllBots = useAppStore(state => state.startAllBots);
    const stopAllBots = useAppStore(state => state.stopAllBots);
    const hasPermission = useAppStore(state => state.hasPermission);

    const { toast } = useToast();
    const navigate = useNavigate();
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const [systemHealth, setSystemHealth] = useState({
        panel: true,
        websocket: true,
        database: true,
        uptime: '0ч',
        uptimeSeconds: 0,
        systemCpu: 0,
        systemMemory: 0,
        systemMemoryPercent: 0,
        systemMemoryTotal: 0
    });

    const stats = useMemo(() => {
        const running = bots.filter(bot => botStatuses[bot.id] === 'running').length;
        const totalCpu = Object.values(resourceUsage).reduce((sum, usage) => sum + (usage.cpu || 0), 0);
        const totalMemory = Object.values(resourceUsage).reduce((sum, usage) => sum + (usage.memory || 0), 0);
        const avgCpu = running > 0 ? (totalCpu / running).toFixed(1) : 0;
        const avgMemory = running > 0 ? (totalMemory / running).toFixed(0) : 0;

        return {
            totalBots: bots.length,
            runningBots: running,
            stoppedBots: bots.length - running,
            avgCpu,
            avgMemory,
            uptime: systemHealth.uptime,
            totalCpu,
            totalMemory,
            systemCpu: systemHealth.systemCpu || 0,
            systemMemory: systemHealth.systemMemory || 0,
            systemMemoryPercent: systemHealth.systemMemoryPercent || 0,
            systemMemoryTotal: systemHealth.systemMemoryTotal || 0
        };
    }, [bots, botStatuses, resourceUsage, systemHealth]);

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const data = await apiHelper('/api/system/health');
                setSystemHealth({
                    panel: data.services.panel,
                    websocket: data.services.websocket,
                    database: data.services.database,
                    uptime: data.uptime,
                    uptimeSeconds: data.uptimeSeconds,
                    systemCpu: data.cpu?.usage || 0,
                    systemMemory: data.memory?.used || 0,
                    systemMemoryPercent: data.memory?.usedPercent || 0,
                    systemMemoryTotal: data.memory?.total || 0
                });
            } catch (error) {
                console.error('Failed to fetch system health:', error);
                const wsWorking = bots.length > 0;
                setSystemHealth(prev => ({
                    ...prev,
                    panel: true,
                    websocket: wsWorking,
                    database: true
                }));
            }
        };

        checkHealth();
        const interval = setInterval(checkHealth, 30000);

        return () => clearInterval(interval);
    }, [bots]);

    const handleMassAction = async (action) => {
        const actionName = action === 'start'
            ? t('actions.start')
            : t('actions.stop');
        if (!window.confirm(t('confirmMassAction', { action: actionName }))) return;

        if (action === 'start') {
            await startAllBots();
        } else {
            await stopAllBots();
        }
    };

    const handleImportSuccess = (newBot) => {
        setIsImportModalOpen(false);
        fetchInitialData();
        toast({
            title: t('messages.success', { ns: 'common' }),
            description: t('botImported', { name: newBot.username })
        });
        navigate(`/bots/${newBot.id}`);
    };

    return (
        <div className="flex flex-col h-full w-full overflow-y-auto">
            <div className="px-6 pt-6 pb-4 sm:px-8 sm:pt-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-1.5">
                            {t('title')}
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            {t('subtitle')}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {hasPermission('bot:import') && (
                            <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="secondary">
                                        <Upload className="mr-1.5 h-4 w-4" />
                                        {t('import')}
                                    </Button>
                                </DialogTrigger>
                                <ImportBotDialog onImportSuccess={handleImportSuccess} onCancel={() => setIsImportModalOpen(false)} />
                            </Dialog>
                        )}

                        {hasPermission('bot:start_stop') && (
                            <>
                                <Button onClick={() => handleMassAction('start')} variant="default">
                                    <Play className="mr-1.5 h-3.5 w-3.5" />
                                    {t('startAll')}
                                </Button>
                                <Button variant="outline" onClick={() => handleMassAction('stop')}>
                                    <Square className="mr-1.5 h-3.5 w-3.5" />
                                    {t('stopAll')}
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricCard
                        label={t('metrics.totalBots')}
                        value={stats.totalBots}
                        icon={Bot}
                    />
                    <MetricCard
                        label={t('metrics.active')}
                        value={stats.runningBots}
                        icon={Activity}
                        accentColor="text-emerald-400"
                    />
                    <MetricCard
                        label={t('metrics.systemCpu')}
                        value={`${stats.systemCpu.toFixed(1)}%`}
                        icon={Cpu}
                        accentColor={stats.systemCpu > 80 ? 'text-red-400' : undefined}
                    />
                    <MetricCard
                        label={t('metrics.systemRam')}
                        value={`${stats.systemMemoryPercent}%`}
                        icon={MemoryStick}
                        accentColor={stats.systemMemoryPercent > 80 ? 'text-red-400' : undefined}
                    />
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-2 pb-6 sm:px-8 sm:pb-8">
                <div className="grid items-start gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                                        <Activity className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle>{t('resourceMonitoring.title')}</CardTitle>
                                        <CardDescription>{t('resourceMonitoring.description')}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ResourceUsageWidget bots={bots} resourceUsage={resourceUsage} />
                            </CardContent>
                        </Card>

                        <Card className="flex flex-col">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                                        <Zap className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle>{t('quickActions.title')}</CardTitle>
                                        <CardDescription>{t('quickActions.description')}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-1 pt-0">
                                <div className="grid h-full flex-1 auto-rows-fr grid-cols-1 sm:grid-cols-2 gap-3 md:grid-cols-3">
                                    <QuickActionButton
                                        icon={<CalendarClock className="h-5 w-5" />}
                                        label={t('quickActions.scheduler')}
                                        onClick={() => navigate('/tasks')}
                                    />
                                    <QuickActionButton
                                        icon={<Settings className="h-5 w-5" />}
                                        label={t('quickActions.settings')}
                                        onClick={() => hasPermission('panel:user:list') && navigate('/admin')}
                                        disabled={!hasPermission('panel:user:list')}
                                    />
                                    <QuickActionButton
                                        icon={<Server className="h-5 w-5" />}
                                        label={t('quickActions.servers')}
                                        onClick={() => navigate('/servers')}
                                    />
                                    <QuickActionButton
                                        icon={<Github className="h-5 w-5" />}
                                        label="GitHub"
                                        description="ssweezyxxx/MineDash"
                                        onClick={() => window.open('https://github.com/ssweezyxxx/MineDash', '_blank', 'noopener,noreferrer')}
                                    />
                                    <QuickActionButton
                                        icon={<MessageSquarePlus className="h-5 w-5" />}
                                        label={t('quickActions.suggest')}
                                        onClick={() => window.open('https://github.com/ssweezyxxx/MineDash/issues/new', '_blank', 'noopener,noreferrer')}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-4 flex flex-col gap-5">
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-base flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-primary">
                                        <Activity className="h-4 w-4" />
                                    </div>
                                    {t('systemHealth.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3.5">
                                <SystemStatusItem
                                    label={t('systemHealth.panel')}
                                    status={systemHealth.panel ? "operational" : "error"}
                                />
                                <SystemStatusItem
                                    label={t('systemHealth.websocket')}
                                    status={systemHealth.websocket ? "operational" : "error"}
                                />
                                <SystemStatusItem
                                    label={t('systemHealth.database')}
                                    status={systemHealth.database ? "operational" : "error"}
                                />
                                <div className="pt-3 border-t border-border/50">
                                    <SystemStatusItem
                                        label={t('systemHealth.uptime')}
                                        status="operational"
                                        value={stats.uptime}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-base">{t('resources.title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ResourceBar
                                    label="CPU"
                                    value={stats.systemCpu}
                                    max={100}
                                    unit="%"
                                />
                                <ResourceBar
                                    label="RAM"
                                    value={stats.systemMemory}
                                    max={stats.systemMemoryTotal || 1000}
                                    unit="MB"
                                />
                                <div className="pt-3 border-t border-border/50 space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">{t('resources.activeBots')}</span>
                                        <span className="font-medium">{stats.runningBots}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">{t('resources.totalMemory')}</span>
                                        <span className="font-medium">{stats.systemMemoryTotal}MB</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="flex flex-col">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">{t('botDistribution.title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                            <span className="text-sm">{t('botDistribution.running')}</span>
                                        </div>
                                        <span className="text-sm font-medium">{stats.runningBots}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-3 h-3 rounded-full bg-muted-foreground/50" />
                                            <span className="text-sm">{t('botDistribution.stopped')}</span>
                                        </div>
                                        <span className="text-sm font-medium">{stats.stoppedBots}</span>
                                    </div>
                                    <div className="pt-2 border-t border-border/50">
                                        <div className="w-full h-2.5 bg-secondary/60 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all duration-500"
                                                style={{ width: `${stats.totalBots > 0 ? (stats.runningBots / stats.totalBots) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon: Icon, accentColor }) {
    return (
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-md group">
            <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-muted-foreground tracking-wide">{label}</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground transition-transform duration-200 group-hover:scale-105">
                    <Icon className={cn("h-4 w-4", accentColor || "text-primary")} />
                </div>
            </div>
            <p className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">{value}</p>
        </div>
    );
}

function QuickActionButton({ icon, label, description, onClick, disabled, count }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="group relative flex h-full min-h-[76px] items-center gap-3.5 rounded-[24px] border border-border/50 bg-secondary/45 px-4 py-3.5 text-left transition-all duration-200 hover:bg-secondary hover:border-primary/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
            {count !== undefined && count > 0 && (
                <Badge className="absolute -top-1.5 -right-1.5 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {count}
                </Badge>
            )}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {icon}
            </div>
            <div className="flex min-w-0 flex-col">
                <span className="font-display text-sm font-medium truncate text-foreground">{label}</span>
                {description && (
                    <span className="text-xs text-muted-foreground truncate">{description}</span>
                )}
            </div>
        </button>
    );
}

function SystemStatusItem({ label, status, value }) {
    const isOperational = status === 'operational';

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
                <Circle className={cn(
                    "h-2 w-2 fill-current",
                    isOperational ? "text-emerald-400" : "text-red-400"
                )} />
                <span className="text-sm">{label}</span>
            </div>
            {value ? (
                <span className="text-sm font-medium">{value}</span>
            ) : (
                <span className={cn(
                    "text-xs font-medium px-2.5 py-0.5 rounded-full",
                    isOperational ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
                )}>
                    {isOperational ? "OK" : "Error"}
                </span>
            )}
        </div>
    );
}

function ResourceBar({ label, value, max, unit }) {
    const percentage = (value / max) * 100;
    const isHigh = percentage > 80;
    const isMedium = percentage > 50;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-mono font-medium">{value}{unit}</span>
            </div>
            <div className="w-full h-2.5 bg-secondary/60 rounded-full overflow-hidden">
                <div
                    className={cn(
                        "h-full rounded-full transition-all duration-500",
                        isHigh ? "bg-red-400" : isMedium ? "bg-amber-400" : "bg-primary"
                    )}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
        </div>
    );
}
