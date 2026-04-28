"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ShadcnTest() {
  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">shadcn/ui — Turuncu Solar tema test</h1>
      <div className="flex gap-3 flex-wrap">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Form örneği</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Ad soyad" />
          <Input type="email" placeholder="E-posta" />
          <div className="flex items-center gap-3">
            <Switch id="notif" />
            <label htmlFor="notif">Bildirim e-postaları</label>
          </div>
          <div className="flex gap-2">
            <Badge>Yeni</Badge>
            <Badge variant="secondary">Çatı GES</Badge>
            <Badge variant="destructive">Acil</Badge>
          </div>
        </CardContent>
      </Card>
      <Tabs defaultValue="hesap">
        <TabsList>
          <TabsTrigger value="hesap">Hesap</TabsTrigger>
          <TabsTrigger value="ayar">Ayarlar</TabsTrigger>
          <TabsTrigger value="bildirim">Bildirimler</TabsTrigger>
        </TabsList>
        <TabsContent value="hesap">Hesap içeriği</TabsContent>
        <TabsContent value="ayar">Ayarlar içeriği</TabsContent>
        <TabsContent value="bildirim">Bildirimler içeriği</TabsContent>
      </Tabs>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Dialog aç</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Onaylıyor musun?</DialogTitle>
            <DialogDescription>Bu işlem geri alınamaz.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
