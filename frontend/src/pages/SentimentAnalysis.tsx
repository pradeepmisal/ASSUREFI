import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, User, Loader, PieChart } from "lucide-react";
import { mockCoinData } from "@/data/mockCoinData";

const SENTIMENT_API_URL = "https://sentiment-agent-1.onrender.com/analyze";
const TWEETS_API_URL = "https://setiment2-agent.onrender.com/api/sentiment";

const fetchSentimentAnalysis = async (coinName) => {
  try {
    const response = await fetch(SENTIMENT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Coin-Name": coinName },
      body: JSON.stringify({ coin: coinName }),
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching sentiment analysis:", error);
    return null;
  }
};

const fetchRecentTweets = async (coinName) => {
  try {
    const response = await fetch(TWEETS_API_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json", "X-Coin-Name": coinName },
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const tweets = await response.json();
    return Array.isArray(tweets) ? [...tweets] : [];
  } catch (error) {
    console.error("Error fetching recent tweets:", error);
    return [];
  }
};

const CryptoSentimentDashboard = () => {
  const [selectedCoin, setSelectedCoin] = useState(mockCoinData[0]);
  const [sentimentData, setSentimentData] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(sentimentData)
  console.log(tweets)
  useEffect(() => {
    document.title = "Cryptocurrency Market - SafeFund Guardian";
    fetchCoinData(mockCoinData[0]);
  }, []);

  const fetchCoinData = async (coin) => {
    setLoading(true);
    const sentiment = await fetchSentimentAnalysis(coin.name);
    const recentTweets = await fetchRecentTweets(coin.name);

    setSentimentData(sentiment);
    setTweets(recentTweets);
    setLoading(false);
  };

  // Determine sentiment color based on value
  const getSentimentColor = (value) => {
    if (value > 0.3) return "bg-green-500";
    if (value < -0.3) return "bg-red-500";
    return "bg-yellow-500";
  };

  // Prepare sentiment distribution data for the chart
  const getSentimentDistribution = () => {
    if (!sentimentData?.sentiment_distribution) {
      return {
        positive: 33,
        neutral: 34,
        negative: 33
      };
    }
    
    return {
      positive: sentimentData.sentiment_distribution.Positive || 0,
      neutral: sentimentData.sentiment_distribution.Neutral || 0,
      negative: sentimentData.sentiment_distribution.Negative || 0
    };
  };

  return (
    <DashboardLayout title="Cryptocurrency Market" description="Analyze cryptocurrency sentiment and trends">
      {/* Coin Selector with Animation */}
      <motion.div 
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <select
          className="p-3 border rounded-lg shadow-sm bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          value={selectedCoin.id}
          onChange={(e) => {
            const coin = mockCoinData.find((c) => c.id === e.target.value);
            setSelectedCoin(coin);
            fetchCoinData(coin);
          }}
        >
          {mockCoinData.map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.name} ({coin.symbol})
            </option>
          ))}
        </select>
        {loading && <Loader className="animate-spin text-blue-500 ml-2" />}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Analysis Card with Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg border border-gray-200 dark:border-gray-700 dark:bg-slate-900 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardTitle className="flex items-center">
                <div className="mr-2 font-bold text-lg">{selectedCoin.name}</div>
                <div className="text-sm opacity-90 bg-white/20 px-2 py-1 rounded">{selectedCoin.symbol}</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <motion.div className="flex justify-center py-10 animate-pulse">
                  <Loader className="text-blue-500 h-10 w-10" />
                </motion.div>
              ) : sentimentData ? (
                <div className="space-y-6">
                  {/* Sentiment Score */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Sentiment Score</p>
                      <span className={`text-sm px-3 py-1 rounded-full font-medium ${getSentimentColor(sentimentData?.average_sentiment)}`}>
                        {(sentimentData?.average_sentiment || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                            Negative
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                            Positive
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div 
                          style={{ width: `${(sentimentData?.average_sentiment + 1) * 50}%` }}
                          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getSentimentColor(sentimentData?.average_sentiment)}`}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Sentiment Distribution Chart */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-inner">
                    <h4 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-200">Sentiment Distribution</h4>
                    <div className="flex justify-between gap-2 h-16">
                      {/* Sentiment Distribution Bar Chart */}
                      {(() => {
                        const distribution = getSentimentDistribution();
                        return (
                          <>
                            <div 
                              className="bg-green-500 rounded-t-sm" 
                              style={{ width: `${distribution.positive}%`, height: "100%" }}
                              title={`Positive: ${distribution.positive}%`}
                            ></div>
                            <div 
                              className="bg-yellow-400 rounded-t-sm" 
                              style={{ width: `${distribution.neutral}%`, height: "100%" }}
                              title={`Neutral: ${distribution.neutral}%`}
                            ></div>
                            <div 
                              className="bg-red-500 rounded-t-sm" 
                              style={{ width: `${distribution.negative}%`, height: "100%" }}
                              title={`Negative: ${distribution.negative}%`}
                            ></div>
                          </>
                        );
                      })()}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                        <span>Positive ({getSentimentDistribution().positive}%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-400 mr-1"></div>
                        <span>Neutral ({getSentimentDistribution().neutral}%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                        <span>Negative ({getSentimentDistribution().negative}%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Analysis Time */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-4">
                    <div className="flex-1">
                      Last Updated: {new Date(sentimentData?.analysis_time ?? Date.now()).toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-1 ${getSentimentColor(sentimentData?.average_sentiment)}`}></div>
                      <span className="font-medium">
                        {sentimentData?.average_sentiment > 0.3 ? "Bullish" : 
                         sentimentData?.average_sentiment < -0.3 ? "Bearish" : "Neutral"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                  <PieChart className="h-12 w-12 mb-4 text-gray-400" />
                  <p>No sentiment data available for {selectedCoin.name}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Latest News Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="shadow-lg border border-gray-200 dark:border-gray-700 dark:bg-slate-900 h-full">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
              <CardTitle>Latest News</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {loading ? (
                <motion.div className="flex justify-center py-10 animate-pulse">
                  <Loader className="text-blue-500 h-10 w-10" />
                </motion.div>
              ) : sentimentData?.latest_news?.length > 0 ? (
                <ul className="space-y-4">
                  {sentimentData.latest_news.map((news, index) => {
                    const sentimentClass = 
                      news.sentiment === "positive" ? "border-green-500 bg-green-50 dark:bg-green-900/10" :
                      news.sentiment === "negative" ? "border-red-500 bg-red-50 dark:bg-red-900/10" :
                      "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10";
                      
                    return (
                      <motion.li
                        key={index}
                        className={`border-l-4 rounded-r-md pl-4 pr-3 py-3 ${sentimentClass}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{news.content}</p>
                        <div className="flex justify-between mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(news.date).toLocaleString()}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            news.sentiment === "positive" ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200" :
                            news.sentiment === "negative" ? "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200" :
                            "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}>
                            {news.sentiment}
                          </span>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <p>No news available for {selectedCoin.name}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Tweets Section with Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6"
      >
        <Card className="shadow-lg border border-gray-200 dark:border-gray-700 dark:bg-slate-900">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            <CardTitle>Recent Tweets</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <motion.div className="flex justify-center py-10 animate-pulse">
                <Loader className="text-blue-500 h-10 w-10" />
              </motion.div>
            ) : tweets.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {tweets.map((tweet, index) => {
                  // Determine sentiment color if available
                  const sentimentColor = tweet.sentiment === "positive" ? "text-green-500" :
                                         tweet.sentiment === "negative" ? "text-red-500" :
                                         "text-yellow-500";
                  
                  return (
                    <motion.div 
                      key={index} 
                      className="p-4 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors duration-150"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white">
                            <User className="h-6 w-6" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">@{tweet.username}</p>
                            {tweet.sentiment && (
                              <span className={`ml-2 text-xs ${sentimentColor}`}>
                                • {tweet.sentiment}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{tweet.content}</p>
                          {tweet.timestamp && (
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(tweet.timestamp).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>No recent tweets found for {selectedCoin.name}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default CryptoSentimentDashboard;