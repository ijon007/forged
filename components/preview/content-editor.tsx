'use client'

/* React */
import React, { useState, useEffect } from 'react'

/* Components */
import { Button } from '@/components/ui/button'
import { Edit, Save, X, Bold, Italic, Underline, Strikethrough, Code, Quote, Command, ArrowBigUp } from 'lucide-react'

/* Markdown */
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

/* Plate */
import { Plate, usePlateEditor } from 'platejs/react'
import { Editor, EditorContainer } from '@/components/ui/editor'
import { FixedToolbar } from '@/components/ui/fixed-toolbar'
import { MarkToolbarButton } from '@/components/ui/mark-toolbar-button'
import { ToolbarButton } from '@/components/ui/toolbar'
import { Separator } from '@/components/ui/separator'
import { BasicNodesKit } from '@/components/basic-nodes-kit'
import { MarkdownKit } from '@/components/markdown-kit'

interface ContentEditorProps {
    initialContent: string
    onContentChange?: (markdown: string) => void
    readOnly?: boolean
    className?: string
    contentType?: 'blog' | 'listicle' | 'course'
}

export function ContentEditor({ 
    initialContent, 
    onContentChange, 
    readOnly = false,
    className = "",
    contentType = 'blog'
}: ContentEditorProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [currentContent, setCurrentContent] = useState(initialContent)

    const editor = usePlateEditor({
        plugins: [
            ...BasicNodesKit,
            ...MarkdownKit,
        ],
    })

    React.useEffect(() => {
        if (isEditing && editor && currentContent) {
            const plateValue = editor.api.markdown.deserialize(currentContent)
            editor.tf.setValue(plateValue)
        }
    }, [isEditing, currentContent, editor])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isEditing && (event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault()
                handleSave()
            }
            if (isEditing && event.key === 'Escape') {
                event.preventDefault()
                handleCancel()
            }
            if (!isEditing && !readOnly && (event.shiftKey || event.metaKey) && event.key === 'E') {
                event.preventDefault()
                handleEdit()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isEditing, readOnly])

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSave = () => {
        if (editor) {
            const markdown = editor.api.markdown.serialize()
                setCurrentContent(markdown)
        onContentChange?.(markdown)
        }
        setIsEditing(false)
    }

    const handleCancel = () => {
        setCurrentContent(initialContent)
        setIsEditing(false)
    }

    const getBorderColor = () => {
        switch (contentType) {
            case 'blog': return 'border-green-500'
            case 'listicle': return 'border-blue-500'
            case 'course': return 'border-purple-500'
            default: return 'border-gray-500'
        }
    }

    const renderViewMode = () => (
        <div className="relative">
            {!readOnly && (
                <div className="absolute right-4 z-10">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleEdit}
                        className="gap-2 bg-white/90 backdrop-blur-sm hover:bg-white/95 shadow-sm"
                    >
                        <Edit className="flex md:hidden h-4 w-4" />
                        Edit
                        <span className="hidden md:flex flex-row items-center text-xs opacity-75 ml-1">
                            <ArrowBigUp size={16} /> + E
                        </span>
                    </Button>
                </div>
            )}
            <div className={`prose prose-lg prose-gray dark:prose-invert max-w-none ${className}`}>
                <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                        code({ className, children, ...props }: any) {
                            const match = /language-(\w+)/.exec(className || '')
                            const language = match ? match[1] : ''
                            const isInline = !className?.includes('language-')
                            
                            if (isInline) {
                                return (
                                    <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-gray-800 dark:text-gray-200" {...props}>
                                        {children}
                                    </code>
                                )
                            }
                            
                            return (
                                <div className="my-6">
                                    <SyntaxHighlighter
                                        style={vscDarkPlus}
                                        language={language || 'text'}
                                        PreTag="div"
                                        customStyle={{
                                            margin: 0,
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                </div>
                            )
                        },
                        h1: ({ children }) => (
                            <h1 className="text-3xl font-bold mt-12 mb-6 first:mt-8 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
                                {children}
                            </h1>
                        ),
                        h2: ({ children }) => {
                            if (contentType === 'listicle') {
                            const childString = String(children)
                            const numberMatch = childString.match(/^(\d+)\.\s*(.+)/)
                            
                            if (numberMatch) {
                                const [, number, title] = numberMatch
                                return (
                                    <div className="my-10 first:mt-6">
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="bg-black text-white rounded-full flex items-center justify-center text-lg font-bold w-9 h-9">
                                                {number}
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1 leading-tight">
                                                {title}
                                            </h2>
                                        </div>
                                    </div>
                                )
                            }
                            }
                            
                            return (
                                <h2 className="text-2xl font-bold mt-10 mb-6 text-gray-900 dark:text-gray-100">
                                    {children}
                                </h2>
                            )
                        },
                        h3: ({ children }) => (
                            <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">
                                {children}
                            </h3>
                        ),
                        h4: ({ children }) => (
                            <h4 className="text-lg font-medium mt-6 mb-3 text-gray-900 dark:text-gray-100">
                                {children}
                            </h4>
                        ),
                        p: ({ children }) => (
                            <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300 text-lg">
                                {children}
                            </p>
                        ),
                        ul: ({ children }) => (
                            <ul className="mb-6 pl-6 space-y-3 list-disc list-outside text-gray-700 dark:text-gray-300">
                                {children}
                            </ul>
                        ),
                        ol: ({ children }) => (
                            <ol className="mb-6 pl-6 space-y-3 list-decimal list-outside text-gray-700 dark:text-gray-300">
                                {children}
                            </ol>
                        ),
                        li: ({ children }) => (
                            <li className="leading-relaxed text-lg">
                                {children}
                            </li>
                        ),
                        blockquote: ({ children }) => {
                            const borderColor = contentType === 'blog' ? 'border-green-500' : 
                                            contentType === 'listicle' ? 'border-blue-500' : 
                                            'border-purple-500'
                            return (
                                <blockquote className={`border-l-4 ${borderColor} pl-6 my-6 bg-gray-50 dark:bg-gray-800 py-4 rounded-r-lg`}>
                                    <div className="text-gray-700 dark:text-gray-300 italic text-lg">
                                        {children}
                                    </div>
                                </blockquote>
                            )
                        },
                        strong: ({ children }) => (
                            <strong className="font-semibold text-gray-900 dark:text-gray-100">
                                {children}
                            </strong>
                        ),
                        em: ({ children }) => <em className="italic">{children}</em>,
                        hr: () => (
                            <hr className="my-10 border-gray-200 dark:border-gray-700" />
                        ),
                    }}
                >
                    {currentContent}
                </ReactMarkdown>
            </div>
        </div>
    )

    const renderEditMode = () => (
        <Plate editor={editor}>
            <FixedToolbar className="justify-between rounded-t-lg">
                <div className="flex items-center">
                    <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">
                        <Bold className="h-4 w-4" />
                    </MarkToolbarButton>
                    <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)">
                        <Italic className="h-4 w-4" />
                    </MarkToolbarButton>
                    <MarkToolbarButton nodeType="underline" tooltip="Underline (⌘+U)">
                        <Underline className="h-4 w-4" />
                    </MarkToolbarButton>
                    <MarkToolbarButton nodeType="strikethrough" tooltip="Strikethrough">
                        <Strikethrough className="h-4 w-4" />
                    </MarkToolbarButton>
                    <MarkToolbarButton nodeType="code" tooltip="Code (⌘+E)">
                        <Code className="h-4 w-4" />
                    </MarkToolbarButton>

                    <Separator orientation="vertical" className="h-6 mx-1" />
                    
                    <ToolbarButton 
                        onClick={() => editor.tf.h1.toggle()}
                        tooltip="Heading 1"
                        className="text-sm font-semibold"
                    >
                        H1
                    </ToolbarButton>
                    <ToolbarButton 
                        onClick={() => editor.tf.h2.toggle()}
                        tooltip="Heading 2"
                        className="text-sm font-semibold"
                    >
                    H2
                    </ToolbarButton>
                    <ToolbarButton 
                        onClick={() => editor.tf.h3.toggle()}
                        tooltip="Heading 3"
                        className="text-sm font-semibold"
                    >
                        H3
                    </ToolbarButton>
                    
                    <Separator orientation="vertical" className="h-6 mx-1" />
                    
                    <ToolbarButton 
                        onClick={() => editor.tf.blockquote.toggle()}
                        tooltip="Quote"
                    >
                        <Quote className="h-4 w-4" />
                    </ToolbarButton>
                </div>

                <div className="flex gap-2">
                    <Button 
                        variant="default" 
                        size="sm" 
                        onClick={handleSave}
                        className="gap-2"
                    >
                        <Save className="flex md:hidden h-4 w-4" />
                        Save
                        <span className="hidden md:flex flex-row items-center text-xs opacity-75 ml-1">
                            <Command size={16} /> + S
                        </span>
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleCancel}
                        className="gap-2"
                        title="Cancel (Esc)"
                    >
                        <X className="flex md:hidden h-4 w-4" />
                        Cancel
                        <span className="hidden md:flex text-xs opacity-75 ml-1">
                            Esc
                        </span>
                    </Button>
                </div>
            </FixedToolbar>
            
            <EditorContainer className={`min-h-64 ${className}`}>
                <Editor 
                    placeholder="Start editing your content..."
                    className="prose prose-lg max-w-none p-4"
                />
            </EditorContainer>
        </Plate>
    )

    return (
        <div className="relative">
            <div className={`${isEditing ? 'border rounded-lg' : ''} ${isEditing ? getBorderColor() : ''}`}>
                {isEditing ? renderEditMode() : renderViewMode()}
            </div>
        </div>
    )
} 