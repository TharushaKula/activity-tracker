import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ContributionGrid } from "@/components/dashboard/contribution-grid";
import Link from "next/link";
import { ArrowRight, Calendar, TrendingUp, Target } from "lucide-react";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#0D7AB8] to-[#0a6a9f] text-white">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <div className="inline-block p-4 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
              <Calendar className="h-16 w-16" />
            </div>
            <h1 className="text-6xl font-bold tracking-tight leading-tight">
              Daily Activity Tracker
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Track your daily activities, monitor your mood, and boost your
              productivity with beautiful insights and analytics.
            </p>

            <div className="flex gap-4 justify-center pt-4">
              <Button 
                asChild 
                size="lg" 
                className="text-lg px-8 bg-white text-[#0D7AB8] hover:bg-gray-100 shadow-lg hover:shadow-xl"
              >
                <Link href="/sign-up">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 border-2 "
              >
                <Link href="/sign-in" className="text-black">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Grid Section - GitHub Style */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Visualize Your Progress
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See your activity patterns at a glance with our GitHub-style
              contribution grid. Track your consistency and build better habits.
            </p>
          </div>
          <Card className="border border-gray-200 shadow-lg p-8 bg-white">
            <CardContent className="p-0">
              <ContributionGrid weeks={52} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-8">
              <div className="p-4 rounded-xl bg-blue-50 w-fit mb-6">
                <Calendar className="h-10 w-10 text-[#0D7AB8]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Daily Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Log your activities throughout the day with timestamps, mood,
                and tags.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-8">
              <div className="p-4 rounded-xl bg-purple-50 w-fit mb-6">
                <TrendingUp className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                View your productivity trends with weekly and monthly insights.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-8">
              <div className="p-4 rounded-xl bg-green-50 w-fit mb-6">
                <Target className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Streak Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Build consistency with streak tracking and achievement badges.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
