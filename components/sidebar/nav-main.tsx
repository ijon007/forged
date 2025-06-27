"use client"

import { ChevronRight, FileText } from "lucide-react"
import { useState, useRef, cloneElement, isValidElement } from "react"

import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: React.ReactNode
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
          const iconRef = useRef<any>(null)
          
          const handleMouseEnter = () => {
            if (iconRef.current && typeof iconRef.current.startAnimation === 'function') {
              iconRef.current.startAnimation()
            }
          }

          const handleMouseLeave = () => {
            if (iconRef.current && typeof iconRef.current.stopAnimation === 'function') {
              iconRef.current.stopAnimation()
            }
          }

          // Clone the icon element to add ref and disable internal hover
          const iconWithRef = isValidElement(item.icon) 
            ? cloneElement(item.icon as React.ReactElement<any>, { 
                ref: iconRef,
                onMouseEnter: undefined,
                onMouseLeave: undefined
              })
            : item.icon
          
          return (
            <Collapsible 
              key={item.title} 
              asChild 
              open={isOpen}
              onOpenChange={(open) => setOpenStates(prev => ({ ...prev, [item.title]: open }))}
              className="cursor-pointer"
            >
              <SidebarMenuItem className="group cursor-pointer">
                {item.items?.length ? (
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    onClick={() => toggleOpen(item.title)}
                    className="cursor-pointer"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button className="w-full">
                      {iconWithRef}
                      <span>{item.title}</span>
                      <ChevronRight 
                        className={`ml-auto transition-transform duration-300 ease-out ${
                          isOpen ? 'rotate-90' : 'rotate-0'
                        }`}
                      />
                    </button>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link href={item.url}>
                      {iconWithRef}
                      <span>{item.title}</span>
                    </Link>
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
                            <Link href={subItem.url}>
                                <FileText className="w-4 h-4" />
                                <span>{subItem.title}</span>
                            </Link>
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
