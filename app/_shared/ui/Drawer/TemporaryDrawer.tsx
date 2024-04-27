"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/_shared/style";

const TemporaryDrawer = ({
  shouldScaleBackground = false,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
TemporaryDrawer.displayName = "Drawer";

const TemporaryDrawerTrigger = DrawerPrimitive.Trigger;

const TemporaryDrawerPortal = DrawerPrimitive.Portal;

const TemporaryDrawerClose = DrawerPrimitive.Close;

const TemporaryDrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay ref={ref} className={cn("fixed inset-0 z-50 bg-black/70", className)} {...props} />
));
TemporaryDrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const TemporaryDrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <TemporaryDrawerPortal>
    <TemporaryDrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn("fixed inset-y-0 z-50 flex h-screen w-60 flex-col focus-visible:outline-none", className)}
      {...props}
    >
      {children}
    </DrawerPrimitive.Content>
  </TemporaryDrawerPortal>
));
TemporaryDrawerContent.displayName = "DrawerContent";

const TemporaryDrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)} {...props} />
);
TemporaryDrawerHeader.displayName = "DrawerHeader";

const TemporaryDrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
);
TemporaryDrawerFooter.displayName = "DrawerFooter";

const TemporaryDrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
TemporaryDrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const TemporaryDrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description ref={ref} className={cn("text-muted-foreground text-sm", className)} {...props} />
));
TemporaryDrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  TemporaryDrawer,
  TemporaryDrawerPortal,
  TemporaryDrawerOverlay,
  TemporaryDrawerTrigger,
  TemporaryDrawerClose,
  TemporaryDrawerContent,
  TemporaryDrawerHeader,
  TemporaryDrawerFooter,
  TemporaryDrawerTitle,
  TemporaryDrawerDescription,
};
