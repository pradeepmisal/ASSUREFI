
import DashboardLayout from "@/components/DashboardLayout";
import { BarChart3 } from "lucide-react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useEffect } from "react";

const TrustScore = () => {
  useEffect(() => {
    document.title = "Trust Score - AssureFi Guardian";
  }, []);

  return (
    <DashboardLayout 
      title="Trust Score" 
      description="Evaluate DeFi projects based on security and transparency metrics"
    >
      <div className="grid gap-4 md:gap-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              <CardTitle>Project Reputation Scores</CardTitle>
            </div>
            <CardDescription>
              Review trust scores for DeFi projects based on multiple security factors.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border border-dashed rounded-md bg-slate-50">
              <p className="text-slate-500">Project trust scores will be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TrustScore;
