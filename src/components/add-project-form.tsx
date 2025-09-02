"use client";

import { useFormState } from "react-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createProject, ActionResult } from "@/lib/actions/projects";
import { useToast } from "@/hooks/use-toast";
import { Vertical } from "@/types";

const initialState: ActionResult = {
  success: false,
  message: "",
};

interface AddProjectFormProps {
  onSuccess?: () => void;
}

export function AddProjectForm({ onSuccess }: AddProjectFormProps) {
  const [state, formAction] = useFormState(createProject, initialState);
  const { toast } = useToast();

  // Handle successful form submission
  useEffect(() => {
    if (state.success) {
      toast({
        title: "Success!",
        description: state.message,
      });
      if (onSuccess) {
        onSuccess();
      }
    } else if (state.message && !state.success) {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast, onSuccess]);

  return (
    <Card className="w-full max-w-2xl border-none shadow-none">
      <CardHeader>
        <CardTitle>Add New Project</CardTitle>
        <CardDescription>
          Create a new project to track client updates and health status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter project name"
              required
            />
            {state.errors?.name && (
              <p className="text-sm text-red-600">{state.errors.name[0]}</p>
            )}
          </div>

          {/* Slack Channel ID */}
          <div className="space-y-2">
            <Label htmlFor="slackChannelId">Slack Channel ID *</Label>
            <Input
              id="slackChannelId"
              name="slackChannelId"
              type="text"
              placeholder="e.g., C1234567890"
              required
            />
            <p className="text-xs text-muted-foreground">
              Find this in Slack by right-clicking the channel → View channel
              details → Copy channel ID
            </p>
            {state.errors?.slackChannelId && (
              <p className="text-sm text-red-600">
                {state.errors.slackChannelId[0]}
              </p>
            )}
          </div>

          {/* Vertical */}
          <div className="space-y-2">
            <Label htmlFor="vertical">Vertical *</Label>
            <Select name="vertical" required>
              <SelectTrigger>
                <SelectValue placeholder="Select project vertical" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CRYPTO">₿ Crypto</SelectItem>
                <SelectItem value="APP">📱 App</SelectItem>
                <SelectItem value="COMMERCE">🛒 Commerce</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.vertical && (
              <p className="text-sm text-red-600">{state.errors.vertical[0]}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Brief description of the project"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Create Project
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
