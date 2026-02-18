"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { 
  Upload, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Star,
  TrendingUp,
  Target,
  Zap,
  Lightbulb,
  Award,
  MessageSquare,
  Clock,
  BarChart3,
  Eye,
  Download,
  Share2,
  Copy,
  Sparkles,
  Check,
  AlertTriangle,
  ThumbsUp,
  Users
} from "lucide-react";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useFetch from "@/hooks/use-fetch";
import { analyzeResumeImage } from "@/actions/resume-analyze";
import { cn } from "@/lib/utils";

export default function ResumeAnalyzePage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const {
    loading: isAnalyzing,
    fn: analyzeImageFn,
    data: analysisResult,
    error: analysisError,
  } = useFetch(analyzeResumeImage);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("resume-image", selectedImage);

    await analyzeImageFn(formData);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500 bg-green-500/10 border-green-500/20";
    if (score >= 60) return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    return "text-red-500 bg-red-500/10 border-red-500/20";
  };

  const getIndustryInsights = () => {
    if (!analysisResult?.industryMatch) return null;
    
    const industries = {
      "tech": { icon: Zap, color: "text-blue-500 bg-blue-500/10" },
      "finance": { icon: TrendingUp, color: "text-emerald-500 bg-emerald-500/10" },
      "healthcare": { icon: Award, color: "text-purple-500 bg-purple-500/10" },
      "marketing": { icon: Target, color: "text-pink-500 bg-pink-500/10" },
      "education": { icon: Lightbulb, color: "text-amber-500 bg-amber-500/10" }
    };

    return industries[analysisResult.industryMatch.toLowerCase()] || industries.tech;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              AI Resume Analyzer
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Get detailed feedback and actionable insights to make your resume stand out 
              and increase your chances at top companies
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Powered by Google Gemini</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section - Left Column */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8 border-primary/20 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-primary" />
                <span>Upload Resume</span>
              </CardTitle>
              <CardDescription>
                Get detailed feedback within seconds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center space-y-4 transition-all duration-300 ${
                  imagePreview 
                    ? "border-primary/50 bg-gradient-to-b from-primary/5 to-transparent" 
                    : "border-muted hover:border-primary/30"
                }`}
              >
                {imagePreview ? (
                  <div className="relative w-full aspect-[3/4] max-h-[400px] group">
                    <img
                      src={imagePreview}
                      alt="Resume preview"
                      className="w-full h-full object-contain rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="p-4 rounded-full bg-primary/10">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm font-medium">
                        Drag & drop your resume image
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, WEBP up to 10MB
                      </p>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="resume-upload"
                      onChange={handleImageChange}
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById("resume-upload").click()}
                      className="w-full"
                    >
                      Browse Files
                    </Button>
                  </>
                )}
              </div>

              <Button
                className="w-full h-12 text-base font-medium shadow-md hover:shadow-lg transition-shadow"
                disabled={!selectedImage || isAnalyzing}
                onClick={handleAnalyze}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-5 w-5" />
                    Analyze Now
                  </>
                )}
              </Button>

              {/* Quick Stats */}
              {analysisResult && (
                <div className="grid grid-cols-3 gap-2 pt-4 border-t">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold">{analysisResult.atsScore}%</div>
                    <div className="text-xs text-muted-foreground">ATS Score</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold">{analysisResult.keywordMatch || "85"}%</div>
                    <div className="text-xs text-muted-foreground">Keyword Match</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold">{analysisResult.readabilityScore || "90"}%</div>
                    <div className="text-xs text-muted-foreground">Readability</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Section - Right Two Columns */}
        <div className="lg:col-span-2 space-y-6">
          {analysisResult ? (
            <>
              {/* Score Card */}
              <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-semibold">Overall Resume Score</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        How your resume performs against industry standards
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className={cn(
                        "px-4 py-2 rounded-full border font-bold text-2xl",
                        getScoreColor(analysisResult.atsScore)
                      )}>
                        {analysisResult.atsScore}/100
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                      </Button>
                    </div>
                  </div>
                  
                  {/* Progress Bars */}
                  <div className="space-y-4 mt-6">
                    {analysisResult.categoryScores?.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{category.name}</span>
                          <span className={cn(
                            "font-bold",
                            category.score >= 80 ? "text-green-500" :
                            category.score >= 60 ? "text-yellow-500" : "text-red-500"
                          )}>
                            {category.score}%
                          </span>
                        </div>
                        <Progress 
                          value={category.score} 
                          className={cn(
                            "h-2",
                            category.score >= 80 ? "bg-green-500" :
                            category.score >= 60 ? "bg-yellow-500" : "bg-red-500"
                          )}
                        />
                        <p className="text-xs text-muted-foreground">{category.feedback}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tabs for Different Analysis Views */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="overview" className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="enhancements" className="flex items-center space-x-2">
                    <Zap className="h-4 w-4" />
                    <span>Enhancements</span>
                  </TabsTrigger>
                  <TabsTrigger value="industry" className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Industry Fit</span>
                  </TabsTrigger>
                  <TabsTrigger value="keywords" className="flex items-center space-x-2">
                    <Target className="h-4 w-4" />
                    <span>Keywords</span>
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Eye className="h-5 w-5" />
                        <span>Quick Overview</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div data-color-mode="light" className="markdown-preview">
                        <MDEditor.Markdown source={analysisResult.feedback} />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Enhancements Tab */}
                <TabsContent value="enhancements" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Sparkles className="h-5 w-5 text-amber-500" />
                        <span>Actionable Improvements</span>
                      </CardTitle>
                      <CardDescription>
                        Specific changes to increase your chances
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Accordion type="single" collapsible className="w-full">
                        {analysisResult.improvements?.map((improvement, index) => (
                          <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-center space-x-3">
                                <div className={cn(
                                  "p-1 rounded-full",
                                  improvement.priority === "high" ? "bg-red-500/10" :
                                  improvement.priority === "medium" ? "bg-yellow-500/10" : "bg-blue-500/10"
                                )}>
                                  {improvement.priority === "high" ? 
                                    <AlertTriangle className="h-4 w-4 text-red-500" /> :
                                    improvement.priority === "medium" ?
                                    <Clock className="h-4 w-4 text-yellow-500" /> :
                                    <Lightbulb className="h-4 w-4 text-blue-500" />
                                  }
                                </div>
                                <div className="text-left">
                                  <span className="font-medium">{improvement.title}</span>
                                  <Badge 
                                    variant="outline" 
                                    className={cn(
                                      "ml-2 text-xs",
                                      improvement.priority === "high" ? "border-red-500 text-red-500" :
                                      improvement.priority === "medium" ? "border-yellow-500 text-yellow-500" : 
                                      "border-blue-500 text-blue-500"
                                    )}
                                  >
                                    {improvement.priority} priority
                                  </Badge>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-3 pl-8">
                                <p className="text-sm">{improvement.description}</p>
                                {improvement.examples && (
                                  <div className="bg-muted/50 p-3 rounded-lg">
                                    <p className="text-xs font-medium mb-1">Example:</p>
                                    <p className="text-sm">{improvement.examples}</p>
                                  </div>
                                )}
                                <div className="flex items-center space-x-2">
                                  <Button size="sm" variant="outline" className="h-8">
                                    <Copy className="h-3 w-3 mr-1" />
                                    Copy Suggestion
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8">
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    Mark as Done
                                  </Button>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Industry Fit Tab */}
                <TabsContent value="industry" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <TrendingUp className="h-5 w-5" />
                          <span>Industry Alignment</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {getIndustryInsights() && (
                          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-transparent">
                            <div className={cn("p-2 rounded-lg", getIndustryInsights().color)}>
                              {React.createElement(getIndustryInsights().icon, { className: "h-6 w-6" })}
                            </div>
                            <div>
                              <p className="font-medium">Best Fit: {analysisResult.industryMatch}</p>
                              <p className="text-sm text-muted-foreground">Your resume aligns well with this industry</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <h4 className="font-medium">Suggested Companies</h4>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.suggestedCompanies?.map((company, index) => (
                              <Badge key={index} variant="secondary" className="px-3 py-1">
                                {company}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Award className="h-5 w-5" />
                          <span>Competitive Edge</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {analysisResult.uniqueStrengths?.map((strength, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{strength}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Keywords Tab */}
                <TabsContent value="keywords" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="h-5 w-5" />
                        <span>Keyword Optimization</span>
                      </CardTitle>
                      <CardDescription>
                        Add these keywords to improve ATS matching
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Missing Keywords</h4>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.missingKeywords?.map((keyword, index) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100 cursor-pointer"
                                onClick={() => copyToClipboard(keyword)}
                              >
                                {keyword}
                                <Copy className="h-3 w-3 ml-1" />
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h4 className="font-medium mb-2">Present Keywords</h4>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.presentKeywords?.map((keyword, index) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className="border-green-200 bg-green-50 text-green-700"
                              >
                                {keyword}
                                <Check className="h-3 w-3 ml-1" />
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Action Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    <span>Quick Wins</span>
                  </CardTitle>
                  <CardDescription>
                    Start with these improvements for immediate impact
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {analysisResult.quickWins?.map((win, index) => (
                      <div key={index} className="space-y-2 p-4 rounded-lg border bg-card">
                        <div className="flex items-center space-x-2">
                          <div className="p-1 rounded-full bg-primary/10">
                            <Star className="h-3 w-3 text-primary" />
                          </div>
                          <span className="font-medium">{win.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{win.description}</p>
                        <Button size="sm" variant="ghost" className="w-full">
                          <Check className="h-3 w-3 mr-2" />
                          Mark Complete
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            /* Empty State */
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Analysis Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload your resume to receive personalized feedback and improvement suggestions
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <div className="text-center p-4 rounded-lg border">
                    <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-xs font-medium">ATS Optimization</p>
                  </div>
                  <div className="text-center p-4 rounded-lg border">
                    <Zap className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-xs font-medium">Quick Improvements</p>
                  </div>
                  <div className="text-center p-4 rounded-lg border">
                    <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-xs font-medium">Industry Fit</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {analysisError && (
            <Card className="border-destructive/20 bg-gradient-to-r from-destructive/5 to-transparent">
              <CardContent className="p-6 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-destructive">Analysis Failed</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {analysisError.message || "Something went wrong during analysis. Please try again."}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}