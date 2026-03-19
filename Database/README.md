# Base de Datos - Project Evolvion

## Estructura

### Web Prototype (Simple)
- **Ubicacion:** `web-prototype/Evolv-UI/artifacts/api-server/src/data/game-data.ts`
- **Tipo:** JSON en memoria (TypeScript)
- **Uso:** Solo para el prototipo web, data hardcodeada
- **No necesita:** PostgreSQL ni ningun servidor de DB

### Unity Project (Produccion)
- **Ubicacion:** `Database/unity-schema.sql`
- **Tipo:** PostgreSQL (compatible con Supabase)
- **Uso:** Para el juego en produccion con multijugador

---

## Schema Unity — Tablas (25 tablas)

### Usuarios y Dispositivos
| Tabla | Descripcion |
|-------|-------------|
| `users` | Cuentas de usuario con device_id unico de instalacion |
| `user_devices` | Historial de dispositivos (modelo, OS, version app, GPU, RAM, idioma) |
| `user_sessions` | Sesiones activas con info de device y version |

### Soporte y Live Ops
| Tabla | Descripcion |
|-------|-------------|
| `support_tickets` | Tickets de soporte con snapshot automatico del dispositivo |
| `support_ticket_messages` | Mensajes de ida y vuelta en cada ticket |
| `live_ops_events` | Eventos configurables con targeting por version/OS/nivel |
| `live_ops_player_status` | Progreso de cada jugador en eventos live ops |
| `server_notifications` | Notificaciones push desde admin con targeting |
| `server_notification_reads` | Tracking de lecturas de notificaciones |

### Estado del Jugador
| Tabla | Descripcion |
|-------|-------------|
| `player_state` | Estado general (planeta activo, estadisticas) |
| `player_resources` | Recursos por tipo (stone, wood, food, bronze, energy, diamonds) |
| `player_character` | Aris: nivel, stats, equipamiento equipado |
| `player_skins` | Skins desbloqueadas |

### Progresion
| Tabla | Descripcion |
|-------|-------------|
| `player_planets` | Planetas desbloqueados + era actual |
| `player_structures` | Estructuras construidas, nivel, herramienta asignada |
| `player_equipment` | Inventario de equipamiento |
| `player_tools` | Inventario de herramientas |
| `player_cards` | Cartas coleccionadas |
| `player_completed_sets` | Sets de cartas completados |

### Prestigio
| Tabla | Descripcion |
|-------|-------------|
| `player_prestige` | Nivel, multiplicador, recursos acumulados |
| `player_prestige_upgrades` | Mejoras de prestigio compradas |

### Tienda
| Tabla | Descripcion |
|-------|-------------|
| `player_shop` | VIP, battle pass, ads, compras |
| `player_purchases` | Historial de compras (con receipt para validacion IAP) |
| `player_battle_pass_claims` | Rewards del battle pass reclamados |
| `player_active_boosts` | Boosts activos con expiracion |

### Clanes
| Tabla | Descripcion |
|-------|-------------|
| `clans` | Clanes creados |
| `clan_members` | Miembros con rango y donaciones |
| `clan_events` | Eventos cooperativos activos |
| `clan_donations` | Historial de donaciones |
| `clan_chat` | Chat del clan |

### Competitivo
| Tabla | Descripcion |
|-------|-------------|
| `player_achievements` | Logros desbloqueados |
| `combat_history` | Historial de combates con loot |
| `leaderboard_global` | Ranking global de jugadores |
| `leaderboard_clans` | Ranking global de clanes |
| `leaderboard_combat` | Ranking de combate |

### Sistema
| Tabla | Descripcion |
|-------|-------------|
| `analytics_events` | Eventos de analytics |
| `push_tokens` | Tokens para push notifications |
| `battle_pass_seasons` | Temporadas del battle pass |
| `promo_codes` | Codigos promocionales |
| `promo_code_redemptions` | Canjes de codigos |

---

## Como usar con Supabase (recomendado para Unity)

1. Crear proyecto en supabase.com
2. Ir a SQL Editor
3. Pegar el contenido de `unity-schema.sql`
4. Ejecutar
5. En Unity, usar el SDK de Supabase: `com.supabase.unity`

## Como usar con PostgreSQL local

```bash
# Crear la base de datos
createdb evolvion

# Ejecutar el schema
psql evolvion < Database/unity-schema.sql

# Crear un jugador de prueba
psql evolvion -c "INSERT INTO users (username, email) VALUES ('TestPlayer', 'test@test.com') RETURNING id;"
psql evolvion -c "SELECT initialize_new_player('EL_UUID_RETORNADO');"
```
