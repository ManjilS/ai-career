// app/resume/_components/entry-form.jsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { entrySchema } from "@/app/lib/schema";
import {
  Sparkles,
  PlusCircle,
  X,
  Pencil,
  Save,
  Loader2,
  Calendar,
  Building,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Check,
  ExternalLink,
  Trash2,
  Clock,
} from "lucide-react";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = parse(dateString, "yyyy-MM", new Date());
    return format(date, "MMM yyyy");
  } catch {
    return dateString;
  }
};

export function EntryForm({ type, entries, onChange }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue,
    trigger,
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  const current = watch("current");
  const title = watch("title");
  const description = watch("description");

  const typeIcons = {
    experience: Briefcase,
    education: GraduationCap,
    project: ExternalLink,
  };
  const TypeIcon = typeIcons[type.toLowerCase()] || Briefcase;

  const handleAdd = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "" : formatDisplayDate(data.endDate),
    };

    setIsAnimating(true);
    setTimeout(() => {
      onChange([...entries, formattedEntry]);
      reset();
      setIsAdding(false);
      setIsAnimating(false);
      toast.success(`${type} added successfully!`);
    }, 300);
  });

  const handleEdit = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "" : formatDisplayDate(data.endDate),
    };

    const newEntries = [...entries];
    newEntries[isEditing] = formattedEntry;
    onChange(newEntries);
    
    reset();
    setIsEditing(null);
    toast.success(`${type} updated successfully!`);
  });

  const handleDelete = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(newEntries);
    toast.success(`${type} removed`);
  };

  const handleStartEdit = (index) => {
    const entry = entries[index];
    reset({
      ...entry,
      startDate: parse(entry.startDate, "MMM yyyy", new Date())
        .toISOString()
        .slice(0, 7),
      endDate: entry.endDate
        ? parse(entry.endDate, "MMM yyyy", new Date())
            .toISOString()
            .slice(0, 7)
        : "",
    });
    setIsEditing(index);
    setIsAdding(false);
  };

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI);

  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);
      toast.success("✨ Description enhanced with AI!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  const handleImproveDescription = async () => {
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    await improveWithAIFn({
      current: description,
      type: type.toLowerCase(),
    });
  };

  const handleCancel = () => {
    reset();
    setIsAdding(false);
    setIsEditing(null);
  };

  return (
    <div className="space-y-6">
      {/* Entries List */}
      <div className="space-y-4">
        {entries.map((item, index) => (
          <Card
            key={index}
            className={cn(
              "border-l-4 border-l-primary transition-all duration-300 hover:shadow-md",
              isAnimating && index === entries.length - 1 && "animate-pulse"
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 rounded-lg bg-primary/10 p-2">
                    <TypeIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">
                      {item.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Building className="h-3 w-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {item.organization}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={item.current ? "default" : "outline"}
                    className={cn(
                      "text-xs",
                      item.current && "bg-green-500 hover:bg-green-600"
                    )}
                  >
                    {item.current ? "Current" : "Past"}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleStartEdit(index)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(index)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {item.startDate}
                    {item.endDate ? ` - ${item.endDate}` : " - Present"}
                  </span>
                </div>
                {item.current && (
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}

        {entries.length === 0 && !isAdding && (
          <div className="text-center py-12 border-2 border-dashed rounded-xl border-muted-foreground/20 bg-gradient-to-b from-transparent to-muted/5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
              <TypeIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg mb-2">No {type} added yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first {type.toLowerCase()} to get started
            </p>
            <Button
              variant="default"
              onClick={() => setIsAdding(true)}
              className="shadow-sm"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add {type}
            </Button>
          </div>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || isEditing !== null) && (
        <Card className="border-primary/20 shadow-lg animate-in slide-in-from-bottom-3 duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <TypeIcon className="h-5 w-5 text-primary" />
                <span>
                  {isEditing !== null ? `Edit ${type}` : `Add New ${type}`}
                </span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "transition-colors",
                    isDirty && "bg-blue-50 text-blue-700 border-blue-200"
                  )}
                >
                  {isDirty ? "Unsaved changes" : "Editing"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center space-x-2">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>Title/Position *</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Senior Software Engineer"
                    className={cn(
                      errors.title && "border-red-300 focus-visible:ring-red-200"
                    )}
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization" className="flex items-center space-x-2">
                    <Building className="h-3.5 w-3.5" />
                    <span>Organization *</span>
                  </Label>
                  <Input
                    id="organization"
                    placeholder="e.g., Google Inc."
                    className={cn(
                      errors.organization && "border-red-300 focus-visible:ring-red-200"
                    )}
                    {...register("organization")}
                  />
                  {errors.organization && (
                    <p className="text-sm text-red-500">
                      {errors.organization.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-4">
                <Label className="flex items-center space-x-2">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Duration</span>
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Input
                      type="month"
                      {...register("startDate")}
                      className={cn(
                        errors.startDate && "border-red-300 focus-visible:ring-red-200"
                      )}
                    />
                    {errors.startDate && (
                      <p className="text-sm text-red-500">
                        {errors.startDate.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="month"
                      {...register("endDate")}
                      disabled={current}
                      className={cn(
                        "transition-colors",
                        current && "opacity-50 bg-muted cursor-not-allowed",
                        errors.endDate && "border-red-300 focus-visible:ring-red-200"
                      )}
                    />
                    {errors.endDate && (
                      <p className="text-sm text-red-500">
                        {errors.endDate.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3 pt-2">
                  <Switch
                    id="current"
                    checked={current}
                    onCheckedChange={(checked) => {
                      setValue("current", checked);
                      if (checked) {
                        setValue("endDate", "");
                      }
                    }}
                  />
                  <Label htmlFor="current" className="cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Currently working here</span>
                      {current && (
                        <Badge variant="secondary" className="ml-2">
                          Active
                        </Badge>
                      )}
                    </div>
                  </Label>
                </div>
              </div>

              {/* Description with AI Enhancement */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description" className="flex items-center space-x-2">
                    <span>Description</span>
                    <Badge variant="outline" className="text-xs">
                      AI-enhanced
                    </Badge>
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleImproveDescription}
                    disabled={isImproving || !description}
                    className={cn(
                      "transition-all",
                      !description && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isImproving ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5 mr-2" />
                        Enhance with AI
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  id="description"
                  placeholder={`Describe your ${type.toLowerCase()}... Use bullet points, achievements, and metrics.`}
                  className="min-h-[120px] resize-y"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Tip: Press the "Enhance with AI" button to improve your description
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="hover:bg-muted"
            >
              Cancel
            </Button>
            <div className="flex items-center space-x-3">
              {isDirty && (
                <span className="text-xs text-muted-foreground animate-pulse">
                  Unsaved changes
                </span>
              )}
              <Button
                type="button"
                onClick={isEditing !== null ? handleEdit : handleAdd}
                className="px-6 shadow-sm hover:shadow"
              >
                {isEditing !== null ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Add Entry
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Add New Button (only show when not editing/adding) */}
      {!isAdding && isEditing === null && entries.length > 0 && (
        <div className="pt-4 border-t">
          <Button
            className="w-full hover:shadow-md transition-shadow"
            variant="outline"
            onClick={() => setIsAdding(true)}
            size="lg"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Another {type}
          </Button>
        </div>
      )}
    </div>
  );
}