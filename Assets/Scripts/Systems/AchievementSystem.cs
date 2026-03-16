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
            // Construction achievements
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "build_first_structure",
                name = "Primer Constructor",
                description = "Construye tu primera estructura",
                Check = () => _state.totalStructuresBuilt >= 1
            });
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "build_10_structures",
                name = "Arquitecto",
                description = "Construye 10 estructuras",
                Check = () => _state.totalStructuresBuilt >= 10
            });

            // Combat achievements
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "defeat_first_enemy",
                name = "Primer Combate",
                description = "Derrota a tu primer enemigo",
                Check = () => _state.totalEnemiesDefeated >= 1
            });
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "defeat_50_enemies",
                name = "Guerrero",
                description = "Derrota a 50 enemigos",
                Check = () => _state.totalEnemiesDefeated >= 50
            });
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "defeat_100_enemies",
                name = "Campeon",
                description = "Derrota a 100 enemigos",
                Check = () => _state.totalEnemiesDefeated >= 100
            });

            // Resource achievements
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "collect_1000_resources",
                name = "Recolector",
                description = "Recolecta 1000 recursos en total",
                Check = () => _state.totalResourcesCollected >= 1000
            });
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "collect_100000_resources",
                name = "Magnate",
                description = "Recolecta 100,000 recursos en total",
                Check = () => _state.totalResourcesCollected >= 100000
            });

            // Era achievements
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "reach_tribal_age",
                name = "Evolucion Tribal",
                description = "Alcanza la Edad Tribal",
                Check = () =>
                {
                    var planet = _state.GetActivePlanet();
                    return planet != null && planet.currentEra >= EraType.TribalAge;
                }
            });
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "reach_bronze_age",
                name = "Era del Bronce",
                description = "Alcanza la Edad del Bronce",
                Check = () =>
                {
                    var planet = _state.GetActivePlanet();
                    return planet != null && planet.currentEra >= EraType.BronzeAge;
                }
            });

            // Card achievements
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "collect_first_card",
                name = "Coleccionista Novato",
                description = "Obtiene tu primera carta",
                Check = () => _state.cardCollection.ownedCardIds.Count >= 1
            });
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "complete_first_set",
                name = "Set Completo",
                description = "Completa tu primer set de cartas",
                Check = () => _state.cardCollection.completedSetKeys.Count >= 1
            });

            // Prestige achievements
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "first_prestige",
                name = "Renacimiento",
                description = "Realiza tu primer prestige",
                Check = () => _state.prestige.totalResets >= 1
            });

            // Aris level achievements
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "aris_level_5",
                name = "Aris en Crecimiento",
                description = "Lleva a Aris al nivel 5",
                Check = () => _state.aris.level >= 5
            });
            _achievements.Add(new AchievementDefinition
            {
                achievementId = "aris_level_10",
                name = "Aris Veterano",
                description = "Lleva a Aris al nivel 10",
                Check = () => _state.aris.level >= 10
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
        public System.Func<bool> Check;
    }
}
