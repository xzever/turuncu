"use client";

import React, { useState } from "react";
import { Pill, Card, TopBar, BottomNav, BottomSheet, ListItem, SearchInput, SectionHeader, EmptyState, Skeleton, Accordion, ShareSheet } from "@/components/ui/mobile";
import { Home, Settings, User, Bell, ChevronRight, Search } from "lucide-react";

export const PreviewClient = () => {
  const [search, setSearch] = useState("");
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [shareSheetOpen, setShareSheetOpen] = useState(false);

  return (
    <div style={{ paddingBottom: "100px", background: "#0b1b2c", minHeight: "100svh", color: "white" }}>
      <TopBar title="UI Kit Preview" showLogo={true} back={{ onClick: () => alert("Geri dön!") }} />
      
      <div style={{ display: "flex", flexDirection: "column", gap: "32px", marginTop: "32px", padding: "0 16px" }}>
        
        <section>
          <SectionHeader title="Pill" subtitle="Tüm varyantlar ve boyutlar" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px" }}>
            <Pill variant="primary">Primary</Pill>
            <Pill variant="primary" active>Primary Active</Pill>
            <Pill variant="secondary">Secondary</Pill>
            <Pill variant="secondary" active>Secondary Active</Pill>
            <Pill variant="ghost">Ghost</Pill>
            <Pill variant="ghost" active>Ghost Active</Pill>
            <Pill variant="filter-chip">Filter Chip</Pill>
            <Pill variant="filter-chip" active>Filter Chip Active</Pill>
            <Pill variant="size-pill">Size Pill</Pill>
            <Pill variant="size-pill" active>Size Pill Active</Pill>
            <Pill size="sm">Small</Pill>
            <Pill size="md" disabled>Disabled</Pill>
          </div>
        </section>

        <section>
          <SectionHeader title="Card" subtitle="Flat, Elevated, Interactive" />
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
            <Card variant="flat" padding="md">
              <p style={{ margin: 0 }}>Flat Card Content (md padding)</p>
            </Card>
            <Card variant="elevated" padding="lg">
              <p style={{ margin: 0 }}>Elevated Card Content (lg padding)</p>
            </Card>
            <Card variant="interactive" onClick={() => alert("Clicked!")}>
              <p style={{ margin: 0 }}>Interactive Card - Click Me</p>
            </Card>
          </div>
        </section>

        <section>
          <SectionHeader title="ListItem" subtitle="Listeler ve satırlar" />
          <div style={{ marginTop: "16px", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
            <ListItem title="Profil Ayarları" subtitle="Kullanıcı bilgileri" leading={<User width={24} height={24} />} trailing={<ChevronRight width={24} height={24} />} onClick={() => {}} />
            <ListItem title="Bildirimler" leading={<Bell width={24} height={24} />} trailing={<ChevronRight width={24} height={24} />} onClick={() => {}} />
            <ListItem title="Çıkış Yap" divider={false} onClick={() => {}} />
          </div>
        </section>

        <section>
          <SectionHeader title="SearchInput" />
          <div style={{ marginTop: "16px" }}>
            <SearchInput 
              value={search} 
              onChange={setSearch} 
              placeholder="Arama yap..." 
              onClear={() => setSearch("")} 
            />
          </div>
        </section>

        <section>
          <SectionHeader title="EmptyState" />
          <div style={{ marginTop: "16px", border: "1px dashed rgba(255,255,255,0.2)", borderRadius: "14px" }}>
            <EmptyState 
              icon={<Search size={48} />}
              title="Sonuç bulunamadı"
              description="Aramanıza uygun veri yok."
              cta={{ label: "Temizle", onClick: () => setSearch("") }}
            />
          </div>
        </section>

        <section>
          <SectionHeader title="Skeleton" />
          <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <Skeleton variant="circle" />
              <div style={{ flex: 1 }}><Skeleton variant="text" count={2} /></div>
            </div>
            <Skeleton variant="card" />
          </div>
        </section>

        <section>
          <SectionHeader title="Accordion" />
          <div style={{ marginTop: "16px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "0 16px" }}>
            <Accordion 
              items={[
                { id: "1", title: "Sıkça Sorulan Soru 1", children: <p style={{ margin: 0 }}>Burada cevap yer alıyor.</p> },
                { id: "2", title: "Sıkça Sorulan Soru 2", children: <p style={{ margin: 0 }}>Burada başka bir cevap yer alıyor.</p> }
              ]} 
            />
          </div>
        </section>

        <section>
          <SectionHeader title="Bottom Sheets & Menus" />
          <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
            <Pill onClick={() => setBottomSheetOpen(true)}>Open BottomSheet</Pill>
            <Pill onClick={() => setShareSheetOpen(true)}>Open ShareSheet</Pill>
          </div>
        </section>

      </div>

      <BottomSheet open={bottomSheetOpen} onClose={() => setBottomSheetOpen(false)} title="Örnek Menü">
        <div style={{ height: "300px", padding: "16px", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
          <p style={{ color: "white", margin: 0 }}>İçerik burada kaydırılabilir.</p>
          <Pill onClick={() => setBottomSheetOpen(false)}>Kapat</Pill>
        </div>
      </BottomSheet>

      <ShareSheet 
        open={shareSheetOpen} 
        onClose={() => setShareSheetOpen(false)} 
        url="https://turuncusolar.com"
        title="Turuncu Solar"
      />

      <BottomNav 
        items={[
          { href: "/preview/mobile-ui-kit", label: "Ana Sayfa", icon: <Home width={24} height={24} /> },
          { href: "#", label: "Ayarlar", icon: <Settings width={24} height={24} /> }
        ]} 
      />
    </div>
  );
};
