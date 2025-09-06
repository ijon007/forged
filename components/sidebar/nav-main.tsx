"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  cloneElement,
  createRef,
  isValidElement,
  useRef,
  useState,
} from "react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { FileTextIcon } from "../ui/file-text";

export function NavMain({
  items,
  onItemClick,
}: {
  items: {
    title: string;
    url: string;
    icon: React.ReactNode;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  onItemClick?: () => void;
}) {
  const [openStates, setOpenStates] = useState<{ [key: string]: boolean }>({});

  const toggleOpen = (itemTitle: string) => {
    setOpenStates((prev) => ({
      ...prev,
      [itemTitle]: !prev[itemTitle],
    }));
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu className="flex flex-col gap-2">
        {items.map((item) => {
          const isOpen = openStates[item.title] ?? item.isActive;
          const iconRef = useRef<any>(null);

          const handleMouseEnter = () => {
            if (
              iconRef.current &&
              typeof iconRef.current.startAnimation === "function"
            ) {
              iconRef.current.startAnimation();
            }
          };

          const handleMouseLeave = () => {
            if (
              iconRef.current &&
              typeof iconRef.current.stopAnimation === "function"
            ) {
              iconRef.current.stopAnimation();
            }
          };

          // Clone the icon element to add ref and disable internal hover
          const iconWithRef = isValidElement(item.icon)
            ? cloneElement(item.icon as React.ReactElement<any>, {
                ref: iconRef,
                onMouseEnter: undefined,
                onMouseLeave: undefined,
              })
            : item.icon;

          return (
            <Collapsible
              asChild
              className="cursor-pointer"
              key={item.title}
              onOpenChange={(open) =>
                setOpenStates((prev) => ({ ...prev, [item.title]: open }))
              }
              open={isOpen}
            >
              <SidebarMenuItem className="group cursor-pointer">
                {item.items?.length ? (
                  <SidebarMenuButton
                    asChild
                    className="cursor-pointer"
                    onClick={() => toggleOpen(item.title)}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    tooltip={item.title}
                  >
                    <button className="w-full">
                      {iconWithRef}
                      <span>{item.title}</span>
                      <ChevronRight
                        className={`ml-auto transition-transform duration-300 ease-out ${
                          isOpen ? "rotate-90" : "rotate-0"
                        }`}
                      />
                    </button>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton
                    asChild
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    tooltip={item.title}
                  >
                    {onItemClick ? (
                      <button
                        className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 font-medium text-sm hover:bg-accent hover:text-accent-foreground"
                        onClick={onItemClick}
                      >
                        {iconWithRef}
                        <span>{item.title}</span>
                      </button>
                    ) : (
                      <Link href={item.url}>
                        {iconWithRef}
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                )}

                {item.items?.length ? (
                  <CollapsibleContent className="overflow-hidden transition-all duration-300 ease-out data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <SidebarMenuSub className="mt-2 space-y-1">
                      {item.items?.map((subItem, index) => {
                        const subIconRef = createRef<any>();

                        const handleSubMouseEnter = () => {
                          if (
                            subIconRef.current &&
                            typeof subIconRef.current.startAnimation ===
                              "function"
                          ) {
                            subIconRef.current.startAnimation();
                          }
                        };

                        const handleSubMouseLeave = () => {
                          if (
                            subIconRef.current &&
                            typeof subIconRef.current.stopAnimation ===
                              "function"
                          ) {
                            subIconRef.current.stopAnimation();
                          }
                        };

                        return (
                          <SidebarMenuSubItem
                            className={`transition-all duration-300 ease-out ${
                              isOpen
                                ? "translate-y-0 opacity-100"
                                : "translate-y-[-10px] opacity-0"
                            }`}
                            key={subItem.title}
                            style={{
                              transitionDelay: isOpen
                                ? `${index * 50}ms`
                                : "0ms",
                            }}
                          >
                            <SidebarMenuSubButton
                              asChild
                              onMouseEnter={handleSubMouseEnter}
                              onMouseLeave={handleSubMouseLeave}
                            >
                              {onItemClick ? (
                                <button
                                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 font-medium text-sm hover:bg-accent hover:text-accent-foreground"
                                  onClick={onItemClick}
                                >
                                  <FileTextIcon ref={subIconRef} />
                                  <span>{subItem.title}</span>
                                </button>
                              ) : (
                                <Link href={subItem.url}>
                                  <FileTextIcon ref={subIconRef} />
                                  <span>{subItem.title}</span>
                                </Link>
                              )}
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
