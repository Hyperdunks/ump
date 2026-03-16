"use client";

import {
  ChangeEmailCard,
  ChangePasswordCard,
  DeleteAccountCard,
  SessionsCard,
  UpdateAvatarCard,
  UpdateNameCard,
} from "@daveyplate/better-auth-ui";
import {
  Check,
  ExternalLink,
  Link2,
  Lock,
  Trash2,
  User,
  Webhook,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDeleteIntegration,
  useIntegrations,
  useSaveIntegration,
  useUpdateIntegration,
} from "@/hooks/api/use-integrations";

type IntegrationChannel = "webhook" | "slack" | "discord";

interface IntegrationCardProps {
  channel: IntegrationChannel;
  title: string;
  description: string;
  placeholder: string;
  helpUrl?: string;
  helpLabel?: string;
  icon: React.ReactNode;
  integration?: {
    id: string;
    endpoint: string;
    isEnabled: boolean;
  };
}

function IntegrationCard({
  channel,
  title,
  description,
  placeholder,
  helpUrl,
  helpLabel,
  icon,
  integration,
}: IntegrationCardProps) {
  const [endpoint, setEndpoint] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const saveIntegration = useSaveIntegration();
  const updateIntegration = useUpdateIntegration();
  const deleteIntegration = useDeleteIntegration();

  const isConnected = !!integration;

  useEffect(() => {
    if (integration) {
      setEndpoint(integration.endpoint);
    } else {
      setEndpoint("");
    }
    setIsEditing(false);
  }, [integration]);

  async function handleSave() {
    if (!endpoint.trim()) return;

    if (integration) {
      await updateIntegration.mutateAsync({
        id: integration.id,
        data: { endpoint, channel },
      });
    } else {
      await saveIntegration.mutateAsync({ channel, endpoint });
    }
    setIsEditing(false);
  }

  async function handleDisconnect() {
    if (!integration) return;
    await deleteIntegration.mutateAsync(integration.id);
    setEndpoint("");
  }

  async function handleToggle(enabled: boolean) {
    if (!integration) return;
    await updateIntegration.mutateAsync({
      id: integration.id,
      data: { isEnabled: enabled },
    });
  }

  const isSaving =
    saveIntegration.isPending || updateIntegration.isPending;
  const isDeleting = deleteIntegration.isPending;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          {isConnected && (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <Check className="size-3" />
                Connected
              </span>
              <Switch
                size="sm"
                checked={integration.isEnabled}
                onCheckedChange={handleToggle}
              />
            </div>
          )}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected && !isEditing ? (
          <div className="space-y-3">
            <div className="rounded-md bg-muted px-3 py-2">
              <p className="text-sm font-mono truncate">
                {integration.endpoint}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                disabled={isDeleting}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-1 size-3" />
                {isDeleting ? "Removing..." : "Disconnect"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid gap-2">
              <Label htmlFor={`${channel}-url`}>
                {channel === "webhook" ? "Webhook URL" : `${title} Webhook URL`}
              </Label>
              <Input
                id={`${channel}-url`}
                type="url"
                placeholder={placeholder}
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={isSaving || !endpoint.trim()}
                size="sm"
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEndpoint(integration?.endpoint ?? "");
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
            {helpUrl && (
              <a
                href={helpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="size-3" />
                {helpLabel ?? "How to set up"}
              </a>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {channel === "webhook"
            ? "When any monitor changes status, a POST request will be sent to this URL with the monitor details."
            : `Alerts for all your monitors will be sent to this ${title} channel.`}
        </p>
      </CardContent>
    </Card>
  );
}

export default function DashboardSettingsPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "account");

  const { data: response } = useIntegrations();
  const integrations = response?.data ?? [];

  function getIntegration(channel: IntegrationChannel) {
    const found = integrations.find((i) => i.channel === channel);
    if (!found) return undefined;
    return {
      id: found.id,
      endpoint: found.endpoint,
      isEnabled: found.isEnabled,
    };
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", value);
    window.history.pushState({}, "", url.toString());
  };

  return (
    <div className="max-w-4xl space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard/settings" />}>
              Settings
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="capitalize">{activeTab}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        orientation="horizontal"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account" className="gap-2">
            <User className="size-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="size-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Link2 className="size-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 w-full">
            <UpdateAvatarCard />
            <UpdateNameCard />
            <ChangeEmailCard />
          </div>
          <DeleteAccountCard />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <ChangePasswordCard />
          <SessionsCard />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <IntegrationCard
            channel="webhook"
            title="Webhook"
            description="Configure a global webhook for all monitors."
            placeholder="https://your-webhook-url.com/endpoint"
            icon={<Webhook className="size-5" />}
            integration={getIntegration("webhook")}
          />

          <IntegrationCard
            channel="slack"
            title="Slack"
            description="Connect Slack for notifications on all monitors."
            placeholder="https://hooks.slack.com/services/..."
            helpUrl="https://api.slack.com/messaging/webhooks"
            helpLabel="How to create a Slack webhook →"
            icon={
              <svg
                className="size-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
              </svg>
            }
            integration={getIntegration("slack")}
          />

          <IntegrationCard
            channel="discord"
            title="Discord"
            description="Connect Discord for notifications on all monitors."
            placeholder="https://discord.com/api/webhooks/..."
            helpUrl="https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks"
            helpLabel="How to create a Discord webhook →"
            icon={
              <svg
                className="size-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />

              </svg>
            }
            integration={getIntegration("discord")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

