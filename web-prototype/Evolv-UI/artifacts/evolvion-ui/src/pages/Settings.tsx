import { useState } from "react";
import { Link } from "wouter";
import { Settings as SettingsIcon, Volume2, VolumeX, Bell, BellOff, Globe, Trash2, LogOut, ChevronRight, Info, Shield, MessageSquare, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Settings() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState("es");
  const [quality, setQuality] = useState("high");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <SettingsIcon className="w-6 h-6 text-muted-foreground" />
        <h1 className="text-xl font-display uppercase text-gradient-primary">Configuración</h1>
      </div>

      {/* Player info */}
      <section className="glass-panel p-4 rounded-2xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-2xl">
            🧑‍🚀
          </div>
          <div>
            <div className="text-lg font-display text-white">Player_001</div>
            <div className="text-[10px] text-muted-foreground font-mono">ID: a1b2c3d4-e5f6</div>
            <div className="text-[10px] text-muted-foreground">Nivel 24 · Era del Bronce</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-black/20 rounded-lg p-2">
            <div className="text-sm font-bold text-white">142</div>
            <div className="text-[9px] text-muted-foreground">Victorias</div>
          </div>
          <div className="bg-black/20 rounded-lg p-2">
            <div className="text-sm font-bold text-white">27</div>
            <div className="text-[9px] text-muted-foreground">Cartas</div>
          </div>
          <div className="bg-black/20 rounded-lg p-2">
            <div className="text-sm font-bold text-white">7</div>
            <div className="text-[9px] text-muted-foreground">Logros</div>
          </div>
        </div>
      </section>

      {/* Audio */}
      <section className="glass-panel rounded-2xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-white/5">
          <span className="text-xs font-display text-muted-foreground uppercase">Audio</span>
        </div>
        <SettingToggle
          icon={soundEnabled ? Volume2 : VolumeX}
          label="Efectos de sonido"
          value={soundEnabled}
          onChange={setSoundEnabled}
        />
        <SettingToggle
          icon={soundEnabled ? Volume2 : VolumeX}
          label="Música"
          value={musicEnabled}
          onChange={setMusicEnabled}
        />
      </section>

      {/* Notifications */}
      <section className="glass-panel rounded-2xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-white/5">
          <span className="text-xs font-display text-muted-foreground uppercase">Notificaciones</span>
        </div>
        <SettingToggle
          icon={notificationsEnabled ? Bell : BellOff}
          label="Push notifications"
          value={notificationsEnabled}
          onChange={setNotificationsEnabled}
        />
      </section>

      {/* Graphics */}
      <section className="glass-panel rounded-2xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-white/5">
          <span className="text-xs font-display text-muted-foreground uppercase">Gráficos</span>
        </div>
        <div className="px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-white">Calidad</span>
          <div className="flex gap-1">
            {["low", "medium", "high"].map(q => (
              <button key={q}
                onClick={() => setQuality(q)}
                className={cn(
                  "px-3 py-1 rounded-lg text-[10px] font-display uppercase transition-all",
                  quality === q
                    ? "bg-primary/20 border border-primary/40 text-primary"
                    : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10"
                )}>
                {q === "low" ? "Bajo" : q === "medium" ? "Medio" : "Alto"}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Language */}
      <section className="glass-panel rounded-2xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-white/5">
          <span className="text-xs font-display text-muted-foreground uppercase">Idioma</span>
        </div>
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-white">Idioma</span>
          </div>
          <div className="flex gap-1">
            {[
              { code: "es", label: "ES" },
              { code: "en", label: "EN" },
              { code: "pt", label: "PT" },
            ].map(l => (
              <button key={l.code}
                onClick={() => setLanguage(l.code)}
                className={cn(
                  "px-3 py-1 rounded-lg text-[10px] font-display uppercase transition-all",
                  language === l.code
                    ? "bg-primary/20 border border-primary/40 text-primary"
                    : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10"
                )}>
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Support & Info */}
      <section className="glass-panel rounded-2xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-white/5">
          <span className="text-xs font-display text-muted-foreground uppercase">Soporte</span>
        </div>
        <SettingLink icon={MessageSquare} label="Reportar un problema" />
        <SettingLink icon={Shield} label="Política de privacidad" />
        <SettingLink icon={Info} label="Acerca del juego" subtitle="v1.0.0 · Build 1" />
        <Link href="/sprite-guide">
          <SettingLink icon={Palette} label="Guía de Sprites" subtitle="Recursos visuales necesarios" />
        </Link>
      </section>

      {/* Danger zone */}
      <section className="glass-panel rounded-2xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-white/5">
          <span className="text-xs font-display text-red-400/60 uppercase">Zona de peligro</span>
        </div>
        <SettingLink icon={Trash2} label="Borrar datos guardados" danger />
        <SettingLink icon={LogOut} label="Cerrar sesión" danger />
      </section>

      <div className="h-4" />
    </div>
  );
}

function SettingToggle({ icon: Icon, label, value, onChange }:
  { icon: any; label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="px-4 py-3 flex items-center justify-between border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-white">{label}</span>
      </div>
      <button onClick={() => onChange(!value)}
        className={cn(
          "w-11 h-6 rounded-full transition-all relative",
          value ? "bg-primary" : "bg-white/20"
        )}>
        <div className={cn(
          "w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm",
          value ? "left-[22px]" : "left-0.5"
        )} />
      </button>
    </div>
  );
}

function SettingLink({ icon: Icon, label, subtitle, danger }:
  { icon: any; label: string; subtitle?: string; danger?: boolean }) {
  return (
    <button className="w-full px-4 py-3 flex items-center justify-between border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
      <div className="flex items-center gap-2">
        <Icon className={cn("w-4 h-4", danger ? "text-red-400" : "text-muted-foreground")} />
        <div className="text-left">
          <span className={cn("text-sm", danger ? "text-red-400" : "text-white")}>{label}</span>
          {subtitle && <div className="text-[10px] text-muted-foreground">{subtitle}</div>}
        </div>
      </div>
      <ChevronRight className={cn("w-4 h-4", danger ? "text-red-400/40" : "text-white/20")} />
    </button>
  );
}
