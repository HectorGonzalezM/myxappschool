// src/components/ui/dropdown-menu.tsx

"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check } from "lucide-react"; // Import the Check icon
import { cn } from "@/lib/utils";

// Existing Components
const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-white p-1 shadow-md",
      className
    )}
    {...props}
  />
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    asChild?: boolean;
  }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? DropdownMenuPrimitive.Item : "div";
  return (
    <Comp
      ref={ref}
      className={cn(
        "flex cursor-pointer select-none items-center rounded-sm text-sm text-gray-700 hover:bg-gray-100",
        className
      )}
      {...props}
    />
  );
});
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

// New Component: DropdownMenuCheckboxItem
const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ children, className, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100",
      className
    )}
    {...props}
  >
    <DropdownMenuPrimitive.ItemIndicator>
      <Check className="mr-2 h-4 w-4" />
    </DropdownMenuPrimitive.ItemIndicator>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

// Export all components
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem, // Export the new component
};

