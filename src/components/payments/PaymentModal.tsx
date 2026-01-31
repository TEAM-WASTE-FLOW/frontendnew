import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Lock, CheckCircle2 } from "lucide-react";
import { usePayOffer } from "@/hooks/useOffers";
import { toast } from "sonner";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    offer: {
        id: string;
        amount: number;
        listing?: {
            title: string;
        };
    };
    onSuccess?: () => void;
}

const PaymentModal = ({ isOpen, onClose, offer, onSuccess }: PaymentModalProps) => {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"form" | "processing" | "success">("form");
    const { payOffer } = usePayOffer();

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStep("processing");

        // Simulate payment processing delay
        setTimeout(async () => {
            try {
                await payOffer(offer.id);
                setStep("success");
                toast.success("Payment successful! Funds have been transferred to escrow.");
                if (onSuccess) onSuccess();
            } catch (error) {
                console.error(error);
                toast.error("Payment failed. Please try again.");
                setStep("form");
            } finally {
                setLoading(false);
            }
        }, 2000);
    };

    const handleClose = () => {
        if (step === "success") {
            onClose();
            // Reset after closing
            setTimeout(() => setStep("form"), 500);
        } else {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Secure Payment</DialogTitle>
                    <DialogDescription>
                        Complete your purchase for <span className="font-semibold text-foreground">{offer.listing?.title}</span>
                    </DialogDescription>
                </DialogHeader>

                {step === "form" && (
                    <form onSubmit={handlePayment} className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Amount to Pay</span>
                                <span className="font-bold text-lg">${offer.amount?.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Lock className="w-3 h-3" />
                                Payments are secure and encrypted
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="card">Card Information</Label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input id="card" placeholder="0000 0000 0000 0000" className="pl-9" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input placeholder="MM/YY" required />
                                <Input placeholder="CVC" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Cardholder Name</Label>
                            <Input id="name" placeholder="John Doe" required />
                        </div>

                        <DialogFooter className="mt-4">
                            <Button type="button" variant="ghost" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                                Pays ${offer.amount?.toLocaleString()}
                            </Button>
                        </DialogFooter>
                    </form>
                )}

                {step === "processing" && (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-muted-foreground">Processing your secure payment...</p>
                    </div>
                )}

                {step === "success" && (
                    <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold">Payment Successful!</h3>
                        <p className="text-muted-foreground max-w-[260px]">
                            Your payment has been processed. The text party has been notified.
                        </p>
                        <Button onClick={handleClose} className="w-full mt-4">
                            Close & View Receipt
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default PaymentModal;
