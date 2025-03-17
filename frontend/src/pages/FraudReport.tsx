
import DashboardLayout from "@/components/DashboardLayout";
import { Shield, AlertTriangle } from "lucide-react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const FraudReport = () => {
  useEffect(() => {
    document.title = "Fraud Reporting - AssureFi Guardian";
  }, []);

  return (
    <DashboardLayout 
      title="Fraud Reporting" 
      description="Report suspicious DeFi projects and help keep the community safe"
    >
      <div className="grid gap-4 md:gap-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <CardTitle>Report a Fraud</CardTitle>
            </div>
            <CardDescription>
              Help the community by reporting suspicious DeFi projects or potential scams.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Project Name</label>
                <input 
                  type="text" 
                  placeholder="Enter the name of the suspicious project"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Contract Address</label>
                <input 
                  type="text" 
                  placeholder="0x..."
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Description of Suspicious Activity</label>
                <textarea 
                  rows={4}
                  placeholder="Describe what makes you suspicious about this project..."
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Evidence (Optional)</label>
                <div className="flex items-center justify-center border border-dashed border-slate-200 rounded-md p-6">
                  <div className="text-center">
                    <Shield className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Drag and drop files here or click to upload</p>
                    <p className="text-xs text-slate-400 mt-1">Screenshots, transaction links, or other evidence</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Submit Report</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FraudReport;
