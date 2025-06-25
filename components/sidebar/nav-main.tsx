"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { useState } from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const [openStates, setOpenStates] = useState<{ [key: string]: boolean }>({})

  const toggleOpen = (itemTitle: string) => {
    setOpenStates(prev => ({
      ...prev,
      [itemTitle]: !prev[itemTitle]
    }))
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu className="flex flex-col gap-2">
        {items.map((item) => {
          const isOpen = openStates[item.title] ?? item.isActive
          
          return (
            <Collapsible 
              key={item.title} 
              asChild 
              open={isOpen}
              onOpenChange={(open) => setOpenStates(prev => ({ ...prev, [item.title]: open }))}
            >
              <SidebarMenuItem>
                {item.items?.length ? (
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    onClick={() => toggleOpen(item.title)}
                  >
                    <button className="w-full">
                      <item.icon />
                      <span>{item.title}</span>
                      <ChevronRight 
                        className={`ml-auto transition-transform duration-300 ease-out ${
                          isOpen ? 'rotate-90' : 'rotate-0'
                        }`}
                      />
                    </button>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                )}
                
                {item.items?.length ? (
                  <CollapsibleContent className="overflow-hidden transition-all duration-300 ease-out data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <SidebarMenuSub className="space-y-1 mt-2">
                      {item.items?.map((subItem, index) => (
                        <SidebarMenuSubItem 
                          key={subItem.title}
                          className={`transition-all duration-300 ease-out ${
                            isOpen 
                              ? 'opacity-100 translate-y-0' 
                              : 'opacity-0 translate-y-[-10px]'
                          }`}
                          style={{
                            transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
                          }}
                        >
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
