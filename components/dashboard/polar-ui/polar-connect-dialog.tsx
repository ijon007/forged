import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PolarConnectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const PolarConnectDialog = ({ isOpen, onClose }: PolarConnectDialogProps) => {
  const handleConnect = () => {
    window.location.href = "/api/polar-oauth/authorize";
  };

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Connect Your Polar Account</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p className="mb-4">
            To start selling your courses and receive payments, you need to
            connect your Polar account. This allows us to link your sales and
            payouts securely with your Polar dashboard.
          </p>
          <p className="mb-4">
            After connecting, you’ll be able to manage your products, track
            sales, and set up your payout method directly through Polar.
          </p>
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            <a
              className="text-blue-600 underline hover:text-blue-800"
              href="https://polar.sh/docs/getting-started/quick-start"
              rel="noopener noreferrer"
              target="_blank"
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
  );
};

export default PolarConnectDialog;
