import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, MessageSquare, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface PerformanceAnalyticsProps {
  studentId: string;
}

interface GradeData {
  subject: string;
  score: number;
  max_score: number;
  term: string;
  academic_year: string;
  created_at: string;
}

interface ResultData {
  term: string;
  academic_year: string;
  feedback?: string;
  created_at: string;
}

interface TrendPoint {
  period: string;
  percentage: number;
  date: string;
}

interface FeedbackStats {
  total: number;
  withFeedback: number;
  recentFeedback: string[];
}

const PerformanceAnalytics = ({ studentId }: PerformanceAnalyticsProps) => {
  const [loading, setLoading] = useState(true);
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [subjectPerformance, setSubjectPerformance] = useState<any[]>([]);
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStats>({
    total: 0,
    withFeedback: 0,
    recentFeedback: [],
  });
  const [averageScore, setAverageScore] = useState(0);

  useEffect(() => {
    fetchAnalytics();
  }, [studentId]);

  const fetchAnalytics = async () => {
    setLoading(true);

    // Fetch all grades
    const { data: gradesData } = await supabase
      .from("grades")
      .select("subject, score, max_score, term, academic_year, created_at")
      .eq("student_id", studentId)
      .order("created_at", { ascending: true });

    // Fetch all results with feedback
    const { data: resultsData } = await supabase
      .from("student_results")
      .select("term, academic_year, feedback, created_at")
      .eq("student_id", studentId)
      .order("created_at", { ascending: true });

    if (gradesData) {
      processGradesTrend(gradesData);
      processSubjectPerformance(gradesData);
    }

    if (resultsData) {
      processFeedbackStats(resultsData);
    }

    setLoading(false);
  };

  const processGradesTrend = (grades: GradeData[]) => {
    // Group by term and calculate average percentage
    const termMap = new Map<string, { total: number; count: number; date: string }>();

    grades.forEach((grade) => {
      const key = `${grade.term} ${grade.academic_year}`;
      const percentage = (grade.score / grade.max_score) * 100;
      
      if (termMap.has(key)) {
        const existing = termMap.get(key)!;
        existing.total += percentage;
        existing.count += 1;
      } else {
        termMap.set(key, { 
          total: percentage, 
          count: 1, 
          date: grade.created_at 
        });
      }
    });

    const trend: TrendPoint[] = Array.from(termMap.entries())
      .map(([period, data]) => ({
        period,
        percentage: Math.round(data.total / data.count),
        date: data.date,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-6); // Last 6 terms

    setTrendData(trend);

    // Calculate overall average
    const totalPercentage = grades.reduce((sum, g) => sum + (g.score / g.max_score) * 100, 0);
    setAverageScore(Math.round(totalPercentage / grades.length));
  };

  const processSubjectPerformance = (grades: GradeData[]) => {
    // Group by subject and calculate average
    const subjectMap = new Map<string, { total: number; count: number }>();

    grades.forEach((grade) => {
      const percentage = (grade.score / grade.max_score) * 100;
      
      if (subjectMap.has(grade.subject)) {
        const existing = subjectMap.get(grade.subject)!;
        existing.total += percentage;
        existing.count += 1;
      } else {
        subjectMap.set(grade.subject, { total: percentage, count: 1 });
      }
    });

    const performance = Array.from(subjectMap.entries())
      .map(([subject, data]) => ({
        subject,
        average: Math.round(data.total / data.count),
      }))
      .sort((a, b) => b.average - a.average);

    setSubjectPerformance(performance);
  };

  const processFeedbackStats = (results: ResultData[]) => {
    const withFeedback = results.filter((r) => r.feedback && r.feedback.trim() !== "");
    const recent = withFeedback
      .slice(-3)
      .reverse()
      .map((r) => r.feedback!)
      .filter(Boolean);

    setFeedbackStats({
      total: results.length,
      withFeedback: withFeedback.length,
      recentFeedback: recent,
    });
  };

  const chartConfig = {
    percentage: {
      label: "Performance",
      color: "hsl(var(--primary))",
    },
  };

  const subjectChartConfig = {
    average: {
      label: "Average Score",
      color: "hsl(var(--primary))",
    },
  };

  if (loading) {
    return (
      <Card className="gradient-card border-0 shadow-lg">
        <CardContent className="py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading analytics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="stat-card border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Average</CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{averageScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">Across all subjects</p>
          </CardContent>
        </Card>

        <Card className="stat-card border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teacher Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {feedbackStats.withFeedback}/{feedbackStats.total}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Results with feedback</p>
          </CardContent>
        </Card>

        <Card className="stat-card border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Improvement Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {trendData.length >= 2
                ? trendData[trendData.length - 1].percentage - trendData[0].percentage > 0
                  ? "↑"
                  : "↓"
                : "-"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {trendData.length >= 2
                ? `${Math.abs(trendData[trendData.length - 1].percentage - trendData[0].percentage)}% change`
                : "Not enough data"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trend Chart */}
      <Card className="gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Trend Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          {trendData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="period" 
                  fontSize={12}
                  tickMargin={8}
                />
                <YAxis 
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="var(--color-percentage)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No grade data available yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subject Performance Chart */}
      <Card className="gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Subject Performance Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subjectPerformance.length > 0 ? (
            <ChartContainer config={subjectChartConfig} className="h-[300px] w-full">
              <BarChart data={subjectPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="subject" 
                  fontSize={12}
                  tickMargin={8}
                />
                <YAxis 
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="average"
                  fill="var(--color-average)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No subject data available yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Teacher Feedback */}
      <Card className="gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Recent Teacher Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          {feedbackStats.recentFeedback.length > 0 ? (
            <div className="space-y-3">
              {feedbackStats.recentFeedback.map((feedback, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-muted/50 rounded-lg border border-border/50"
                >
                  <p className="text-sm">{feedback}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No feedback available yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceAnalytics;
