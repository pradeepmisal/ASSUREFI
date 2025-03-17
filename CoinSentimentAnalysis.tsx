import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, User } from "lucide-react";

const CoinSentimentAnalysis = () => {
  const location = useLocation();
  const { coin, sentimentData } = location.state || {};
  
  useEffect(() => {
    if (coin) {
      document.title = `${coin.name} Sentiment Analysis - SafeFund Guardian`;
    }
  }, [coin]);

  if (!coin || !sentimentData) {
    return (
      <DashboardLayout title="Coin Not Found" description="The requested cryptocurrency could not be found.">
        <Card>
          <CardContent className="pt-6">
            <p>We couldn't find the cryptocurrency you're looking for. Please go back to the coins page and try again.</p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`${coin.name} Sentiment Analysis`} description={`Monitor sentiment related to ${coin.name}`}>
      {/* Sentiment Overview */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <img src={coin.image} alt={coin.name} className="w-10 h-10" />
            <CardTitle>{coin.name} Sentiment</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Overall Sentiment</h3>
            {sentimentData.average_sentiment > 0 ? (
              <TrendingUp className="h-6 w-6 text-green-500" />
            ) : (
              <TrendingDown className="h-6 w-6 text-red-500" />
            )}
          </div>
          <Progress value={(sentimentData.average_sentiment + 1) * 50} className="h-2 mt-2" />
        </CardContent>
      </Card>

      {/* Recent Tweets Section */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Recent Tweets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sentimentData.tweets.map((tweet, index) => (
              <div key={index} className="border-b pb-4 last:border-none flex gap-3 items-start">
                <User className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="font-semibold text-gray-800">{tweet.username}</p>
                  <p className="text-sm text-gray-600">{tweet.date}</p>
                  <p className="mt-1 text-gray-900">{tweet.content}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </DashboardLayout>
  );
};

export default CoinSentimentAnalysis;
