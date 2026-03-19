-- ============================================================
-- PROJECT EVOLVION — Database Schema (PostgreSQL / Supabase)
-- Para el proyecto Unity (multijugador, persistencia en servidor)
-- ============================================================

-- ============================================================
-- USUARIOS Y AUTENTICACION
-- ============================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id VARCHAR(255) UNIQUE NOT NULL, -- ID unico generado en la instalacion (SystemInfo.deviceUniqueIdentifier)
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255),
    password_hash VARCHAR(255),
    auth_provider VARCHAR(20) DEFAULT 'guest', -- guest, email, google, apple
    auth_provider_id VARCHAR(255),
    is_guest BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ DEFAULT NOW(),
    is_banned BOOLEAN DEFAULT false,
    ban_reason TEXT
);

-- Dispositivos registrados por usuario (puede cambiar de celular)
CREATE TABLE user_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(255) NOT NULL, -- SystemInfo.deviceUniqueIdentifier
    device_model VARCHAR(100), -- SystemInfo.deviceModel (ej: "Samsung SM-G998B", "iPhone14,5")
    device_name VARCHAR(100), -- SystemInfo.deviceName
    os_name VARCHAR(50), -- "Android", "iOS", "Windows"
    os_version VARCHAR(50), -- "14.0", "Android 14 (API 34)"
    app_version VARCHAR(20), -- Application.version (ej: "1.2.3")
    build_number INT, -- numero de build interno
    screen_resolution VARCHAR(20), -- Screen.width x Screen.height
    gpu_name VARCHAR(100), -- SystemInfo.graphicsDeviceName
    ram_mb INT, -- SystemInfo.systemMemorySize
    language VARCHAR(10), -- Application.systemLanguage
    first_seen_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, device_id)
);

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(255) NOT NULL,
    token VARCHAR(512) NOT NULL,
    app_version VARCHAR(20),
    os_name VARCHAR(50),
    os_version VARCHAR(50),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SOPORTE / TICKETS
-- ============================================================

CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    device_id VARCHAR(255),
    category VARCHAR(30) NOT NULL, -- bug, payment, account, suggestion, other
    subject VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open', -- open, in_progress, resolved, closed
    priority VARCHAR(10) DEFAULT 'normal', -- low, normal, high, critical
    -- Snapshot automatico del dispositivo al crear ticket
    snapshot_app_version VARCHAR(20),
    snapshot_os VARCHAR(100),
    snapshot_device_model VARCHAR(100),
    snapshot_player_level INT,
    snapshot_era VARCHAR(30),
    admin_notes TEXT,
    assigned_to VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE TABLE support_ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_type VARCHAR(10) NOT NULL, -- user, admin
    sender_id VARCHAR(255),
    message TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tickets_user ON support_tickets(user_id, created_at DESC);
CREATE INDEX idx_tickets_status ON support_tickets(status, priority);

-- ============================================================
-- LIVE OPS
-- ============================================================

CREATE TABLE live_ops_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name VARCHAR(100) NOT NULL,
    event_type VARCHAR(30) NOT NULL, -- sale, double_xp, special_drop, limited_item, tournament
    description TEXT,
    config_json JSONB NOT NULL, -- configuracion flexible del evento
    target_min_version VARCHAR(20), -- version minima del juego para ver el evento
    target_max_version VARCHAR(20), -- version maxima (null = todas)
    target_os VARCHAR(20), -- null = todos, "Android", "iOS"
    target_min_level INT DEFAULT 0, -- nivel minimo del jugador
    target_countries TEXT[], -- null = todos, o array de codigos ISO
    is_active BOOLEAN DEFAULT false,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE live_ops_player_status (
    event_id UUID REFERENCES live_ops_events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    has_seen BOOLEAN DEFAULT false,
    has_participated BOOLEAN DEFAULT false,
    progress DOUBLE PRECISION DEFAULT 0,
    rewards_claimed BOOLEAN DEFAULT false,
    first_seen_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (event_id, user_id)
);

CREATE INDEX idx_live_ops_active ON live_ops_events(is_active, start_at, end_at);

-- ============================================================
-- SERVER NOTIFICATIONS (para push desde admin)
-- ============================================================

CREATE TABLE server_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(20) DEFAULT 'info', -- info, warning, maintenance, update, promo
    target_all BOOLEAN DEFAULT true,
    target_min_version VARCHAR(20),
    target_os VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    show_once BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

CREATE TABLE server_notification_reads (
    notification_id UUID REFERENCES server_notifications(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (notification_id, user_id)
);

-- ============================================================
-- ESTADO DEL JUGADOR
-- ============================================================

CREATE TABLE player_state (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    player_name VARCHAR(30) DEFAULT 'Player',
    active_planet_id VARCHAR(50) DEFAULT 'planet_porera',
    total_enemies_defeated INT DEFAULT 0,
    total_structures_built INT DEFAULT 0,
    total_resources_collected DOUBLE PRECISION DEFAULT 0,
    last_save_timestamp BIGINT DEFAULT 0,
    last_online_at TIMESTAMPTZ DEFAULT NOW(),
    play_time_seconds BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RECURSOS
-- ============================================================

CREATE TABLE player_resources (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    resource_type VARCHAR(20) NOT NULL, -- stone, wood, food, bronze, energy, diamonds
    amount DOUBLE PRECISION DEFAULT 0,
    total_earned DOUBLE PRECISION DEFAULT 0,
    total_spent DOUBLE PRECISION DEFAULT 0,
    PRIMARY KEY (user_id, resource_type)
);

-- ============================================================
-- ARIS (PERSONAJE)
-- ============================================================

CREATE TABLE player_character (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    level INT DEFAULT 1,
    experience INT DEFAULT 0,
    experience_to_next INT DEFAULT 100,
    base_hp INT DEFAULT 100,
    base_attack INT DEFAULT 10,
    base_defense INT DEFAULT 5,
    current_skin VARCHAR(50) DEFAULT 'Default',
    equipped_helmet_id VARCHAR(50),
    equipped_weapon_id VARCHAR(50),
    equipped_armor_id VARCHAR(50),
    equipped_gadget_id VARCHAR(50)
);

CREATE TABLE player_skins (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skin_id VARCHAR(50) NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, skin_id)
);

-- ============================================================
-- PLANETAS Y PROGRESION
-- ============================================================

CREATE TABLE player_planets (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    planet_id VARCHAR(50) NOT NULL,
    current_era VARCHAR(30) DEFAULT 'StoneAge',
    is_unlocked BOOLEAN DEFAULT false,
    unlocked_at TIMESTAMPTZ,
    PRIMARY KEY (user_id, planet_id)
);

CREATE TABLE player_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    planet_id VARCHAR(50) NOT NULL,
    structure_id VARCHAR(50) NOT NULL,
    level INT DEFAULT 0,
    is_built BOOLEAN DEFAULT false,
    assigned_tool_id VARCHAR(50),
    built_at TIMESTAMPTZ,
    UNIQUE(user_id, planet_id, structure_id)
);

-- ============================================================
-- INVENTARIO DE EQUIPAMIENTO
-- ============================================================

CREATE TABLE player_equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    equipment_data_id VARCHAR(50) NOT NULL,
    acquired_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_player_equipment_user ON player_equipment(user_id);

-- ============================================================
-- INVENTARIO DE HERRAMIENTAS
-- ============================================================

CREATE TABLE player_tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tool_data_id VARCHAR(50) NOT NULL,
    acquired_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_player_tools_user ON player_tools(user_id);

-- ============================================================
-- COLECCION DE CARTAS
-- ============================================================

CREATE TABLE player_cards (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    card_id VARCHAR(50) NOT NULL,
    obtained_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, card_id)
);

CREATE TABLE player_completed_sets (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    set_key VARCHAR(100) NOT NULL, -- formato: planet_id_era
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, set_key)
);

-- ============================================================
-- PRESTIGIO
-- ============================================================

CREATE TABLE player_prestige (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    prestige_level INT DEFAULT 0,
    prestige_multiplier DOUBLE PRECISION DEFAULT 1.0,
    accumulated_resources DOUBLE PRECISION DEFAULT 0,
    current_run_resources DOUBLE PRECISION DEFAULT 0,
    base_production_per_second DOUBLE PRECISION DEFAULT 1.0,
    total_resets INT DEFAULT 0
);

CREATE TABLE player_prestige_upgrades (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    upgrade_id VARCHAR(50) NOT NULL,
    is_purchased BOOLEAN DEFAULT false,
    purchased_at TIMESTAMPTZ,
    PRIMARY KEY (user_id, upgrade_id)
);

-- ============================================================
-- TIENDA Y MONETIZACION
-- ============================================================

CREATE TABLE player_shop (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    is_vip BOOLEAN DEFAULT false,
    vip_expiration_timestamp BIGINT DEFAULT 0,
    last_vip_daily_claim BIGINT DEFAULT 0,
    last_vip_weekly_claim BIGINT DEFAULT 0,
    has_premium_battle_pass BOOLEAN DEFAULT false,
    battle_pass_level INT DEFAULT 0,
    battle_pass_exp INT DEFAULT 0,
    battle_pass_exp_per_level INT DEFAULT 100,
    battle_pass_season_end BIGINT DEFAULT 0,
    ads_watched_today INT DEFAULT 0,
    max_ads_per_day INT DEFAULT 10,
    last_ad_reset_timestamp BIGINT DEFAULT 0,
    total_purchase_count INT DEFAULT 0,
    total_spent_usd DOUBLE PRECISION DEFAULT 0
);

CREATE TABLE player_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    item_id VARCHAR(50) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    currency_type VARCHAR(20) NOT NULL, -- diamonds, real_money, energy, ad_watch
    purchased_at TIMESTAMPTZ DEFAULT NOW(),
    receipt_data JSONB -- para validacion de IAP
);

CREATE TABLE player_battle_pass_claims (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    level INT NOT NULL,
    is_premium BOOLEAN NOT NULL,
    claimed_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, level, is_premium)
);

CREATE TABLE player_active_boosts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    boost_id VARCHAR(50) NOT NULL,
    multiplier FLOAT DEFAULT 1.0,
    expiration_timestamp BIGINT NOT NULL,
    activated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CLANES
-- ============================================================

CREATE TABLE clans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(30) UNIQUE NOT NULL,
    description TEXT,
    emblem VARCHAR(10), -- emoji
    leader_id UUID REFERENCES users(id),
    level INT DEFAULT 1,
    experience DOUBLE PRECISION DEFAULT 0,
    experience_to_next DOUBLE PRECISION DEFAULT 500,
    max_members INT DEFAULT 30,
    is_public BOOLEAN DEFAULT true,
    global_rank INT DEFAULT 0,
    global_score DOUBLE PRECISION DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE clan_members (
    clan_id UUID REFERENCES clans(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rank VARCHAR(20) DEFAULT 'Member', -- Member, Elder, CoLeader, Leader
    total_donated DOUBLE PRECISION DEFAULT 0,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (clan_id, user_id)
);

CREATE TABLE clan_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clan_id UUID REFERENCES clans(id) ON DELETE CASCADE,
    event_type VARCHAR(30) NOT NULL, -- CollectResources, DefeatEnemies, BuildStructures, DonateEnergy, CollectCards
    event_name VARCHAR(100) NOT NULL,
    target_amount DOUBLE PRECISION NOT NULL,
    current_progress DOUBLE PRECISION DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    rewards_claimed BOOLEAN DEFAULT false,
    start_timestamp BIGINT NOT NULL,
    end_timestamp BIGINT NOT NULL,
    diamond_reward INT DEFAULT 0,
    energy_reward INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE clan_donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clan_id UUID REFERENCES clans(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    resource_type VARCHAR(20) NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    donated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE clan_chat (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clan_id UUID REFERENCES clans(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clan_chat_clan ON clan_chat(clan_id, sent_at DESC);

-- ============================================================
-- LOGROS
-- ============================================================

CREATE TABLE player_achievements (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_id VARCHAR(50) NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, achievement_id)
);

-- ============================================================
-- COMBATE (HISTORIAL)
-- ============================================================

CREATE TABLE combat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    enemy_id VARCHAR(50) NOT NULL,
    victory BOOLEAN NOT NULL,
    damage_dealt INT DEFAULT 0,
    damage_received INT DEFAULT 0,
    experience_gained INT DEFAULT 0,
    loot_json JSONB, -- { cards: [], equipment: [], resources: [] }
    fought_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_combat_history_user ON combat_history(user_id, fought_at DESC);

-- ============================================================
-- LEADERBOARDS
-- ============================================================

CREATE TABLE leaderboard_global (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    username VARCHAR(30) NOT NULL,
    total_power DOUBLE PRECISION DEFAULT 0,
    player_level INT DEFAULT 1,
    era_reached VARCHAR(30) DEFAULT 'StoneAge',
    rank INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE leaderboard_clans (
    clan_id UUID PRIMARY KEY REFERENCES clans(id) ON DELETE CASCADE,
    clan_name VARCHAR(30) NOT NULL,
    total_score DOUBLE PRECISION DEFAULT 0,
    clan_level INT DEFAULT 1,
    member_count INT DEFAULT 0,
    rank INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE leaderboard_combat (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    username VARCHAR(30) NOT NULL,
    total_victories INT DEFAULT 0,
    total_damage_dealt BIGINT DEFAULT 0,
    highest_combo INT DEFAULT 0,
    rank INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ANALYTICS Y EVENTOS
-- ============================================================

CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL, -- login, purchase, era_advance, combat_win, etc
    event_data JSONB,
    session_id UUID,
    platform VARCHAR(20), -- android, ios, web
    app_version VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_user ON analytics_events(user_id, created_at DESC);
CREATE INDEX idx_analytics_type ON analytics_events(event_type, created_at DESC);

-- ============================================================
-- NOTIFICACIONES PUSH
-- ============================================================

CREATE TABLE push_tokens (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(512) NOT NULL,
    platform VARCHAR(20) NOT NULL, -- android, ios
    is_active BOOLEAN DEFAULT true,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, token)
);

-- ============================================================
-- TEMPORADAS / BATTLE PASS
-- ============================================================

CREATE TABLE battle_pass_seasons (
    id SERIAL PRIMARY KEY,
    season_name VARCHAR(100) NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    max_level INT DEFAULT 50,
    is_active BOOLEAN DEFAULT false,
    rewards_json JSONB -- definicion de rewards por nivel
);

-- ============================================================
-- CODIGOS PROMOCIONALES
-- ============================================================

CREATE TABLE promo_codes (
    code VARCHAR(30) PRIMARY KEY,
    description TEXT,
    reward_type VARCHAR(30) NOT NULL, -- diamonds, resources, equipment, card, skin
    reward_data JSONB NOT NULL,
    max_uses INT DEFAULT 1,
    current_uses INT DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE promo_code_redemptions (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    code VARCHAR(30) REFERENCES promo_codes(code),
    redeemed_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, code)
);

-- ============================================================
-- FUNCIONES HELPER
-- ============================================================

-- Actualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_player_state_updated
    BEFORE UPDATE ON player_state
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Actualizar leaderboard al cambiar estado
CREATE OR REPLACE FUNCTION update_global_leaderboard()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO leaderboard_global (user_id, username, total_power, player_level)
    VALUES (NEW.user_id, NEW.player_name, NEW.total_resources_collected, 1)
    ON CONFLICT (user_id) DO UPDATE SET
        username = NEW.player_name,
        total_power = NEW.total_resources_collected,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_leaderboard_update
    AFTER INSERT OR UPDATE ON player_state
    FOR EACH ROW EXECUTE FUNCTION update_global_leaderboard();

-- ============================================================
-- DATOS INICIALES (para nuevo jugador)
-- ============================================================

-- Funcion para inicializar un nuevo jugador
CREATE OR REPLACE FUNCTION initialize_new_player(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Estado base
    INSERT INTO player_state (user_id) VALUES (p_user_id);

    -- Recursos iniciales
    INSERT INTO player_resources (user_id, resource_type, amount) VALUES
        (p_user_id, 'stone', 50),
        (p_user_id, 'wood', 50),
        (p_user_id, 'food', 30),
        (p_user_id, 'bronze', 0),
        (p_user_id, 'energy', 10),
        (p_user_id, 'diamonds', 5);

    -- Personaje
    INSERT INTO player_character (user_id) VALUES (p_user_id);

    -- Skin default
    INSERT INTO player_skins (user_id, skin_id) VALUES (p_user_id, 'Default');

    -- Planetas (Porera desbloqueado, otros bloqueados)
    INSERT INTO player_planets (user_id, planet_id, is_unlocked) VALUES
        (p_user_id, 'planet_porera', true),
        (p_user_id, 'planet_doresa', false),
        (p_user_id, 'planet_aitherium', false);

    -- Prestigio
    INSERT INTO player_prestige (user_id) VALUES (p_user_id);

    -- Tienda
    INSERT INTO player_shop (user_id) VALUES (p_user_id);
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- INDICES ADICIONALES PARA PERFORMANCE
-- ============================================================

CREATE INDEX idx_player_structures_user_planet ON player_structures(user_id, planet_id);
CREATE INDEX idx_player_cards_user ON player_cards(user_id);
CREATE INDEX idx_clan_members_user ON clan_members(user_id);
CREATE INDEX idx_player_purchases_user ON player_purchases(user_id, purchased_at DESC);
CREATE INDEX idx_leaderboard_global_rank ON leaderboard_global(total_power DESC);
CREATE INDEX idx_leaderboard_clans_rank ON leaderboard_clans(total_score DESC);
CREATE INDEX idx_leaderboard_combat_rank ON leaderboard_combat(total_victories DESC);
