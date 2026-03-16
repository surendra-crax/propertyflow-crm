"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { UsersTab } from "../../../components/settings/users-tab"
import { BrandingTab } from "../../../components/settings/branding-tab"
import { IntegrationsTab } from "../../../components/settings/integrations-tab"
import { Users, Palette, Zap } from "lucide-react"

export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-5xl">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-sm text-slate-500">Global platform configuration and user management</p>
            </div>

            <Tabs defaultValue="users" className="space-y-6">
                <TabsList className="bg-slate-100 p-1">
                    <TabsTrigger value="users" className="gap-2">
                        <Users className="w-4 h-4" />
                        Users
                    </TabsTrigger>
                    <TabsTrigger value="branding" className="gap-2">
                        <Palette className="w-4 h-4" />
                        Branding
                    </TabsTrigger>
                    <TabsTrigger value="integrations" className="gap-2">
                        <Zap className="w-4 h-4" />
                        Integrations
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="users">
                    <UsersTab />
                </TabsContent>

                <TabsContent value="branding">
                    <BrandingTab />
                </TabsContent>

                <TabsContent value="integrations">
                    <IntegrationsTab />
                </TabsContent>
            </Tabs>
        </div>
    )
}
