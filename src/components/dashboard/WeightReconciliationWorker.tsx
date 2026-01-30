import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, AlertTriangle, X } from "lucide-react";

const WeightReconciliationWorker = () => {
    // Mock Data
    const batches = [
        { id: "B-001", material: "PET Bottles", userWeight: 100, pickupWeight: 98, gateWeight: 97.5, status: "Verified" },
        { id: "B-002", material: "Aluminium Cans", userWeight: 50, pickupWeight: 52, gateWeight: 52, status: "Verified" },
        { id: "B-003", material: "Mixed Paper", userWeight: 200, pickupWeight: 180, gateWeight: 175, status: "Discrepancy" }, // 12.5% loss
    ];

    return (
        <Card className="col-span-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Dual-Layer Weight Verification</CardTitle>
                        <CardDescription>Compare weights at every stage to prevent leakage.</CardDescription>
                    </div>
                    <Button variant="outline">Download Report</Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Batch ID</TableHead>
                            <TableHead>Material</TableHead>
                            <TableHead className="text-right">User Est. (kg)</TableHead>
                            <TableHead className="text-right">Pickup (kg)</TableHead>
                            <TableHead className="text-right">Gate (kg)</TableHead>
                            <TableHead className="text-right">Variance</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {batches.map((batch) => {
                            const variance = ((batch.gateWeight - batch.userWeight) / batch.userWeight) * 100;
                            const isDiscrepancy = Math.abs(variance) > 5;

                            return (
                                <TableRow key={batch.id}>
                                    <TableCell className="font-medium">{batch.id}</TableCell>
                                    <TableCell>{batch.material}</TableCell>
                                    <TableCell className="text-right text-muted-foreground">{batch.userWeight}</TableCell>
                                    <TableCell className="text-right text-blue-600">{batch.pickupWeight}</TableCell>
                                    <TableCell className="text-right font-bold">{batch.gateWeight}</TableCell>
                                    <TableCell className={`text-right ${isDiscrepancy ? "text-red-500 font-bold" : "text-green-600"}`}>
                                        {variance.toFixed(1)}%
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {isDiscrepancy ? (
                                            <Badge variant="destructive" className="gap-1"><AlertTriangle className="w-3 h-3" /> Check</Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-green-100 text-green-800 gap-1"><Check className="w-3 h-3" /> Match</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {isDiscrepancy && (
                                            <Button size="sm" variant="ghost">Resolve</Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default WeightReconciliationWorker;
