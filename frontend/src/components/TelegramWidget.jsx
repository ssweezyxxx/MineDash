import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const GITHUB_REPO_URL = 'https://github.com/ssweezyxxx/MineDash';
const GITHUB_LABEL = 'GitHub';

export default function TelegramWidget({ isCollapsed }) {
    return (
        <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            title={isCollapsed ? GITHUB_LABEL : undefined}
            className={cn(
                "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-200 bg-secondary/50 hover:bg-secondary text-secondary-foreground",
                isCollapsed && "mx-auto h-10 w-12 justify-center px-0"
            )}
        >
            <Github className="h-4 w-4 flex-shrink-0 text-primary" />
            <span className={cn("flex-1 truncate", isCollapsed && "hidden")}>{GITHUB_LABEL}</span>
            <ExternalLink className={cn("h-3.5 w-3.5 opacity-60 hidden sm:block", isCollapsed && "!hidden")} />
        </a>
    );
}
