import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "panel-input flex min-h-[72px] w-full rounded-2xl border border-input bg-muted/40 px-4 py-2.5 text-base font-normal text-foreground transition-[border-color,box-shadow,background-color,color] duration-200 ease-out placeholder:text-muted-foreground hover:border-primary/40 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:bg-background/80 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props} />
  );
})
Textarea.displayName = "Textarea"

export { Textarea }
