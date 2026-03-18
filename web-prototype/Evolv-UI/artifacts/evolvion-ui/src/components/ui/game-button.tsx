import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-display transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wider relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-b-4 border-primary-dark hover:bg-primary/90 active:border-b-0 active:translate-y-1 shadow-lg shadow-primary/20",
        destructive:
          "bg-red-500 text-white border-b-4 border-red-700 hover:bg-red-600 active:border-b-0 active:translate-y-1 shadow-lg shadow-red-500/20",
        outline:
          "border-2 border-primary text-primary bg-background/50 backdrop-blur-sm hover:bg-primary/10 active:scale-95",
        secondary:
          "bg-secondary text-secondary-foreground border-b-4 border-secondary-dark hover:bg-secondary/90 active:border-b-0 active:translate-y-1 shadow-lg shadow-secondary/20",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 active:scale-95 shadow-xl",
      },
      size: {
        default: "h-12 px-6 py-2 text-lg",
        sm: "h-10 rounded-lg px-4 text-sm",
        lg: "h-16 rounded-2xl px-10 text-xl",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const GameButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // If it's a destructive, secondary, or default, wrap content to handle the 3d push effect gracefully
    const has3DEffect = variant === "default" || variant === "destructive" || variant === "secondary";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {/* Subtle shine overlay for game feel */}
        {has3DEffect && (
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-inherit" />
        )}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {props.children}
        </span>
      </Comp>
    )
  }
)
GameButton.displayName = "GameButton"

export { GameButton, buttonVariants }
