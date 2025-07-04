import React, { useState } from 'react'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogTrigger, DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { Check, AlertTriangle, Globe, EyeOff,  CircleCheckBig } from 'lucide-react'

interface PublishDialogProps {
    isPublished: boolean
    isLoading?: boolean
    onConfirm: () => Promise<void>
    children: React.ReactNode
    courseTitle?: string
}

const PublishDialog = ({ isPublished, isLoading = false, onConfirm, children, courseTitle }: PublishDialogProps) => {
    const [open, setOpen] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleConfirm = async () => {
        setIsProcessing(true)
        try {
            await onConfirm()
            setOpen(false)
        } catch (error) {
            console.error('Action failed:', error)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px] rounded-3xl border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                <div className="py-6">
                    <DialogHeader className="space-y-4">
                        <div className="flex items-center justify-center">
                            <div className={`p-3 rounded-full ${
                                isPublished 
                                    ? 'bg-red-100 text-red-600' 
                                    : 'bg-green-100 text-green-600'
                            }`}>
                                {isPublished ? (
                                    <EyeOff className="h-6 w-6" />
                                ) : (
                                    <Globe className="h-6 w-6" />
                                )}
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <DialogTitle className="text-2xl font-bold">
                                {isPublished ? 'Unpublish Course' : 'Publish Course'}
                            </DialogTitle>
                            <p className="text-muted-foreground text-base">
                                {isPublished ? 'Hide your course from public view' : 'Make your course publicly available'}
                            </p>
                        </div>
                    </DialogHeader>
                    
                    <div className="mt-6 space-y-4">
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <p className="font-medium text-slate-900 truncate">
                                    {courseTitle}
                                </p>
                            </div>
                        </div>

                        {isPublished ? (
                            <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-5">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-red-100 rounded-lg shrink-0">
                                        <AlertTriangle className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-red-900">This will hide your course</h4>
                                        <ul className="text-sm text-red-700 space-y-1">
                                            <li>• Users won't be able to access your course</li>
                                            <li>• All shared links will stop working</li>
                                            <li>• You can republish anytime</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-green-100 rounded-lg shrink-0">
                                        <Check className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-green-900">Your course will go live</h4>
                                        <ul className="text-sm text-green-700 space-y-1">
                                            <li>• Available to all users instantly</li>
                                            <li>• You'll be redirected to the live version</li>
                                            <li>• Share the link with your audience</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="flex justify-center gap-4 w-full">
                        <Button
                            onClick={handleConfirm}
                            disabled={isProcessing || isLoading}
                            className={`${
                                isPublished 
                                    ? 'w-full mt-5 rounded-3xl py-1 bg-red-600 hover:bg-red-700 text-white' 
                                    : 'w-full mt-5 rounded-3xl py-1 bg-green-600 hover:bg-green-700 text-white'
                            }`}
                            size="lg"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    {isPublished ? 'Unpublishing...' : 'Publishing...'}
                                </>
                            ) : (
                                <>
                                    {isPublished ? (
                                        <>
                                            <EyeOff className="h-4 w-4 mr-2" />
                                            Unpublish
                                        </>
                                    ) : (
                                        <>
                                            <CircleCheckBig className="h-4 w-4 mr-2" />
                                            Publish
                                        </>
                                    )}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default PublishDialog