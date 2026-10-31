import React, { useEffect, useState, useRef } from 'react';
import { useAppStore } from '@/stores/appStore';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Users } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const routeTitles = (path, metadata = {}) => {
	if (path === '/') return 'Дашборд';
	if (path.startsWith('/servers')) return 'Серверы';
	if (path.startsWith('/proxies')) return 'Прокси';
	if (path.startsWith('/proxy-config')) return 'Настройка прокси';
	if (path.startsWith('/tasks')) return 'Планировщик задач';
	if (path.startsWith('/admin')) return 'Администрирование';
	if (path.startsWith('/graph-store')) return 'Магазин графов';
	if (path.startsWith('/api-keys')) return 'API ключи';
	if (path.startsWith('/bots/')) {
		const parts = path.split('/');
		const id = parts[2];
		const botName = metadata.botName || `Бот ${id}`;

		if (path.includes('/visual-editor/') || path.includes('/events/visual/') || path.includes('/commands/visual/')) {
			const graphName = metadata.graphName || 'граф';
			return `✏️ Редактор "${graphName}" бота "${botName}"`;
		}
		if (path.includes('/plugins/edit/')) {
			const pluginName = decodeURIComponent(parts[5] || '');
			return pluginName ? `IDE плагина "${pluginName}" (${botName})` : `IDE плагинов (${botName})`;
		}
		if (path.includes('/plugins/view/')) {
			const pluginName = decodeURIComponent(parts[5] || '');
			return pluginName ? `Плагин "${pluginName}" (${botName})` : `Плагины бота "${botName}"`;
		}
		if (path.includes('/plugins/ui/')) {
			const pluginName = decodeURIComponent(parts[5] || '');
			return pluginName ? `UI плагина "${pluginName}" (${botName})` : `UI плагина (${botName})`;
		}
		if (path.endsWith('/console')) return `Консоль бота "${botName}"`;
		if (path.endsWith('/plugins')) return `Плагины бота "${botName}"`;
		if (path.endsWith('/settings')) return `Настройки бота "${botName}"`;
		if (path.endsWith('/events')) return `События бота "${botName}"`;
		if (path.endsWith('/management')) return `Управление бота "${botName}"`;
		if (path.endsWith('/websocket')) return `WebSocket API (${botName})`;
		if (path.endsWith('/minecraft-viewer')) return `3D Просмотр (${botName})`;
		return `Страница бота "${botName}"`;
	}
	return path;
};

function sinceText(ts) {
	const diffSec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
	if (diffSec < 60) return `${diffSec} сек назад`;
	const m = Math.floor(diffSec / 60);
	return `${m} мин назад`;
}

export default function PresenceButton() {
	const socket = useAppStore((s) => s.socket);
	const currentUser = useAppStore((s) => s.user);
	const bots = useAppStore((s) => s.bots);
	const { toast } = useToast();
	const [list, setList] = useState([]);
	const [enrichedList, setEnrichedList] = useState([]);
	const [, setTick] = useState(0);
	const location = useLocation();
	const navigate = useNavigate();

	const prevIdsRef = useRef(new Set());
	const lastLeftAtRef = useRef(() => {
		try {
			const raw = sessionStorage.getItem('presence:lastLeftAt');
			return raw ? new Map(Object.entries(JSON.parse(raw)).map(([k,v]) => [Number(k), Number(v)])) : new Map();
		} catch { return new Map(); }
	});
	if (typeof lastLeftAtRef.current === 'function') {
		lastLeftAtRef.current = lastLeftAtRef.current();
	}

	useEffect(() => {
		if (!socket) return;
		const handler = (payload) => {
			setList(payload || []);
			const currentIds = new Set((payload || []).map(u => u.userId));
			const prevIds = prevIdsRef.current;
			const now = Date.now();
			for (const uid of prevIds) {
				if (!currentIds.has(uid)) {
					lastLeftAtRef.current.set(uid, now);
				}
			}
			try {
				sessionStorage.setItem('presence:lastLeftAt', JSON.stringify(Object.fromEntries(lastLeftAtRef.current)));
			} catch {}
			for (const user of payload || []) {
				if (!prevIds.has(user.userId)) {
					if (!currentUser || user.userId !== currentUser.id) {
						const lastLeft = lastLeftAtRef.current.get(user.userId);
						if (!lastLeft || now - lastLeft >= 5 * 60 * 1000) {
							toast({ title: `${user.username} зашел в панель`, description: routeTitles(user.path, user.metadata) });
						}
					}
				}
			}
			prevIdsRef.current = currentIds;
		};
		socket.on('presence:list', handler);
		return () => socket.off('presence:list', handler);
	}, [socket, toast, currentUser]);

	useEffect(() => {
		if (!socket) return;
		const interval = setInterval(() => socket.emit('presence:heartbeat'), 20000);
		return () => clearInterval(interval);
	}, [socket]);

	useEffect(() => {
		if (!socket) return;
		const cleanPath = location.pathname;
		const metadata = {};
		const match = cleanPath.match(/^\/bots\/(\d+)/);
		if (match && Array.isArray(bots)) {
			const botId = parseInt(match[1], 10);
			const bot = bots.find((b) => b.id === botId);
			if (bot) {
				metadata.botName = bot.username || bot.name || `Бот ${botId}`;
			}
		}
		socket.emit('presence:update', { path: cleanPath, metadata });
	}, [socket, location.pathname, bots]);

	useEffect(() => {
		const interval = setInterval(() => setTick((v) => v + 1), 1000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const enrichedUsers = list.map((user) => {
			const match = user.path.match(/^\/bots\/(\d+)/);
			if (match) {
				const botId = parseInt(match[1]);
				const bot = bots.find(b => b.id === botId);

				if (!user.metadata?.botName && bot) {
					return {
						...user,
						metadata: {
							...user.metadata,
							botName: bot.username || bot.name || `Бот ${botId}`
						}
					};
				}
			}

			return user;
		});

		setEnrichedList(enrichedUsers);
	}, [list, bots]);

	const count = enrichedList.length;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="secondary" size="sm" className="h-9 px-3.5 rounded-full shadow-xs border border-border/50">
					<Users className="h-4 w-4 mr-1.5 text-primary" /> {count}
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-80 max-w-[90vw] p-3.5 rounded-3xl">
				<div className="font-display text-sm font-medium mb-2.5 px-1">Онлайн сейчас</div>
				{count === 0 ? (
					<div className="text-xs text-muted-foreground px-1">Никого нет онлайн.</div>
				) : (
					<ul className="space-y-1.5 max-h-64 overflow-auto">
						{enrichedList.map((u) => (
							<li key={u.userId} className="text-sm flex items-center justify-between gap-2 rounded-2xl bg-muted/50 px-3 py-2">
								<div className="min-w-0">
									<div className="font-medium truncate">{u.username}</div>
									<div className="text-xs text-muted-foreground truncate">{routeTitles(u.path, u.metadata)}</div>
									<div className="text-[10px] text-muted-foreground">{sinceText(u.lastSeen)}</div>
								</div>
								<Button size="sm" variant="secondary" onClick={() => navigate(u.path)}>Открыть</Button>
							</li>
						))}
					</ul>
				)}
			</PopoverContent>
		</Popover>
	);
}