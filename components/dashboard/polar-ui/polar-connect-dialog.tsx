import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface PolarConnectDialogProps {
    isOpen: boolean
    onClose: () => void
}

const PolarConnectDialog = ({ isOpen, onClose }: PolarConnectDialogProps) => {
    const handleConnect = () => {
        window.location.href = "/api/polar-oauth/authorize"
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Connect Your Polar Account</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <p className="mb-4">
                        To start selling your courses and receive payments, you need to connect your Polar account. This allows us to link your sales and payouts securely with your Polar dashboard.
                    </p>
                    <p className="mb-4">
                        After connecting, you’ll be able to manage your products, track sales, and set up your payout method directly through Polar.
                    </p>
                    <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        <a
                            href="https://polar.sh/docs/getting-started/quick-start"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-600 hover:text-blue-800"
                        >
                            Polar Documentation
                        </a>
                    </div>
                </DialogDescription>
                <DialogFooter>
                    <Button onClick={handleConnect}>Connect</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default PolarConnectDialog
