using UnityEngine;
using System.Collections.Generic;

namespace ProjectEvolvion
{
    public class AchievementSystem : MonoBehaviour
    {
        private PlayerState _state;
        private List<AchievementDefinition> _achievements = new List<AchievementDefinition>();

        public void Initialize(PlayerState state)
        {
            _state = state;
            RegisterDefaultAchievements();
            SubscribeToEvents();
        }

        private void SubscribeToEvents()
        {
            GameEvents.OnStructureBuilt += (id, level) => CheckAchievements();
            GameEvents.OnCombatEnded += (enemy, won) => { if (won) CheckAchievements(); };
            GameEvents.OnEraAdvanced += (planet, era) => CheckAchievements();
            GameEvents.OnCardObtained += (card) => CheckAchievements();
            GameEvents.OnCardSetCompleted += (planet, era) => CheckAchievements();
            GameEvents.OnEquipmentFused += (equip) => CheckAchievements();
            GameEvents.OnPrestigeReset += (level, mult) => CheckAchievements();
        }

        private void RegisterDefaultAchievements()
        {
            // === PLANET ===
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "first_steps",
                name = "Primeros Pasos",
                description = "Comienza tu viaje en Porera",
                category = AchievementCategory.Planet,
                rewardType = AchievementRewardType.Resources, rewardAmount = 1000, iconEmoji = "globe",
                Check = () => _state.GetActivePlanet() != null
            });
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "era_explorer",
                name = "Explorador de Eras",
                description = "Desbloquea 3 eras diferentes",
                category = AchievementCategory.Planet,
                rewardType = AchievementRewardType.Resources, rewardAmount = 5000, iconEmoji = "map",
                Check = () =>
                {
                    var planet = _state.GetActivePlanet();
                    return planet != null && (int)planet.currentEra >= 2;
                }
            });
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "planet_master",
                name = "Maestro Planetario",
                description = "Completa las 9 eras en un planeta",
                category = AchievementCategory.Planet,
                rewardType = AchievementRewardType.LegendaryCard, rewardAmount = 1, iconEmoji = "trophy",
                Check = () =>
                {
                    foreach (var planet in _state.planets)
                        if (planet.currentEra >= EraType.SingularityAge) return true;
                    return false;
                }
            });
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "builder",
                name = "Constructor",
                description = "Construye 10 estructuras",
                category = AchievementCategory.Planet,
                rewardType = AchievementRewardType.Resources, rewardAmount = 2500, iconEmoji = "building",
                Check = () => _state.totalStructuresBuilt >= 10
            });

            // === COMBAT ===
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "first_blood",
                name = "Primera Sangre",
                description = "Gana tu primer combate",
                category = AchievementCategory.Combat,
                rewardType = AchievementRewardType.Resources, rewardAmount = 500, iconEmoji = "swords",
                Check = () => _state.totalEnemiesDefeated >= 1
            });
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "warrior",
                name = "Guerrero",
                description = "Gana 50 combates",
                category = AchievementCategory.Combat,
                rewardType = AchievementRewardType.EpicCard, rewardAmount = 1, iconEmoji = "dagger",
                Check = () => _state.totalEnemiesDefeated >= 50
            });
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "legendary_fighter",
                name = "Luchador Legendario",
                description = "Equipa un set legendario completo",
                category = AchievementCategory.Combat,
                rewardType = AchievementRewardType.Skin, rewardAmount = 1, iconEmoji = "crown",
                Check = () =>
                {
                    // Check all 4 slots have legendary equipment
                    var aris = _state.aris;
                    var db = GameManager.Instance?.database;
                    if (db == null) return false;
                    var slots = new[] { aris.equippedHelmetId, aris.equippedWeaponId, aris.equippedArmorId, aris.equippedGadgetId };
                    foreach (var id in slots)
                    {
                        if (string.IsNullOrEmpty(id)) return false;
                        var data = db.GetEquipment(id);
                        if (data == null || data.rarity != Rarity.Legendary) return false;
                    }
                    return true;
                }
            });
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "boss_slayer",
                name = "Cazador de Jefes",
                description = "Derrota al jefe final de la Singularidad",
                category = AchievementCategory.Combat,
                rewardType = AchievementRewardType.LegendaryCard, rewardAmount = 3, iconEmoji = "skull",
                Check = () => _state.totalEnemiesDefeated >= 100 // Simplified check
            });

            // === COLLECTION ===
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "collector",
                name = "Coleccionista",
                description = "Colecciona 10 cartas",
                category = AchievementCategory.Collection,
                rewardType = AchievementRewardType.Resources, rewardAmount = 1000, iconEmoji = "cards",
                Check = () => _state.cardCollection.ownedCardIds.Count >= 10
            });
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "album_completer",
                name = "Album Completo",
                description = "Completa un album de era completo",
                category = AchievementCategory.Collection,
                rewardType = AchievementRewardType.EpicCard, rewardAmount = 2, iconEmoji = "book",
                Check = () => _state.cardCollection.completedSetKeys.Count >= 1
            });
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "planet_collector",
                name = "Coleccionista Planetario",
                description = "Completa todas las cartas de un planeta",
                category = AchievementCategory.Collection,
                rewardType = AchievementRewardType.LegendaryCard, rewardAmount = 1, iconEmoji = "galaxy",
                Check = () => _state.cardCollection.completedSetKeys.Count >= 4 // 4 eras on one planet
            });

            // === CLAN ===
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "clan_founder",
                name = "Fundador de Clan",
                description = "Unete o crea un clan",
                category = AchievementCategory.Clan,
                rewardType = AchievementRewardType.Resources, rewardAmount = 2000, iconEmoji = "shield",
                Check = () => _state.clan != null && _state.clan.isInClan
            });
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "generous_soul",
                name = "Alma Generosa",
                description = "Dona 10,000 recursos al clan",
                category = AchievementCategory.Clan,
                rewardType = AchievementRewardType.Resources, rewardAmount = 5000, iconEmoji = "handshake",
                Check = () => _state.clan != null && _state.clan.totalResourcesDonated >= 10000
            });
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "clan_champion",
                name = "Campeon del Clan",
                description = "Gana un evento cooperativo del clan",
                category = AchievementCategory.Clan,
                rewardType = AchievementRewardType.EpicCard, rewardAmount = 1, iconEmoji = "medal",
                Check = () => _state.clan != null && _state.clan.activeEvent != null && _state.clan.activeEvent.isCompleted
            });

            // === ADS ===
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "ad_watcher",
                name = "Espectador de Anuncios",
                description = "Mira 5 anuncios para obtener bonificaciones",
                category = AchievementCategory.Ads,
                rewardType = AchievementRewardType.Resources, rewardAmount = 1000, iconEmoji = "tv",
                Check = () => _state.shop != null && _state.shop.adsWatchedToday >= 5
            });

            // === PURCHASE ===
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "supporter",
                name = "Patrocinador",
                description = "Realiza tu primera compra",
                category = AchievementCategory.Purchase,
                rewardType = AchievementRewardType.LegendaryCard, rewardAmount = 1, iconEmoji = "gem",
                Check = () => _state.shop != null && _state.shop.totalPurchaseCount >= 1
            });
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "vip_member",
                name = "Miembro VIP",
                description = "Suscribete al VIP",
                category = AchievementCategory.Purchase,
                rewardType = AchievementRewardType.Skin, rewardAmount = 3, iconEmoji = "star",
                Check = () => _state.shop != null && _state.shop.IsVIPActive()
            });
        }

        public void CheckAchievements()
        {
            foreach (var achievement in _achievements)
            {
                if (_state.unlockedAchievements.Contains(achievement.achievementId))
                    continue;

                if (achievement.Check())
                {
                    _state.unlockedAchievements.Add(achievement.achievementId);
                    GameEvents.RaiseAchievementUnlocked(achievement.achievementId);
                    Debug.Log($"[AchievementSystem] Unlocked: {achievement.name}");
                }
            }
        }

        public List<AchievementDefinition> GetAllAchievements() => _achievements;

        public bool IsUnlocked(string achievementId) =>
            _state.unlockedAchievements.Contains(achievementId);

        public int GetUnlockedCount() => _state.unlockedAchievements.Count;
        public int GetTotalCount() => _achievements.Count;
    }

    public class AchievementDefinition
    {
        public string achievementId;
        public string name;
        public string description;
        public AchievementCategory category;
        public AchievementRewardType rewardType;
        public int rewardAmount;
        public string iconEmoji;
        public System.Func<bool> Check;
    }
}
