using System;

namespace ProjectEvolvion
{
    public static class GameEvents
    {
        // Resources
        public static event Action<ResourceType, double> OnResourceChanged;
        public static event Action<ResourceType, double> OnResourceSpent;

        // Planet & Eras
        public static event Action<string, EraType> OnEraAdvanced;
        public static event Action<string> OnPlanetSelected;

        // Structures
        public static event Action<string, int> OnStructureBuilt;
        public static event Action<string, int> OnStructureUpgraded;

        // Combat
        public static event Action<EnemyData> OnCombatStarted;
        public static event Action<EnemyData, bool> OnCombatEnded;
        public static event Action<int> OnDamageDealt;
        public static event Action<int> OnDamageReceived;

        // Equipment
        public static event Action<EquipmentData> OnEquipmentObtained;
        public static event Action<EquipmentSlot, EquipmentData> OnEquipmentEquipped;
        public static event Action<EquipmentData> OnEquipmentFused;

        // Cards
        public static event Action<CardData> OnCardObtained;
        public static event Action<string, EraType> OnCardSetCompleted;

        // Prestige
        public static event Action<int, double> OnPrestigeReset;
        public static event Action<double> OnPrestigeResourceGenerated;

        // Achievements
        public static event Action<string> OnAchievementUnlocked;

        // Tools
        public static event Action<ToolData> OnToolObtained;
        public static event Action<ToolData> OnToolFused;

        // Save
        public static event Action OnGameSaved;
        public static event Action OnGameLoaded;

        // --- Invoke Methods ---

        public static void RaiseResourceChanged(ResourceType type, double newAmount)
            => OnResourceChanged?.Invoke(type, newAmount);

        public static void RaiseResourceSpent(ResourceType type, double amount)
            => OnResourceSpent?.Invoke(type, amount);

        public static void RaiseEraAdvanced(string planetId, EraType newEra)
            => OnEraAdvanced?.Invoke(planetId, newEra);

        public static void RaisePlanetSelected(string planetId)
            => OnPlanetSelected?.Invoke(planetId);

        public static void RaiseStructureBuilt(string structureId, int level)
            => OnStructureBuilt?.Invoke(structureId, level);

        public static void RaiseStructureUpgraded(string structureId, int newLevel)
            => OnStructureUpgraded?.Invoke(structureId, newLevel);

        public static void RaiseCombatStarted(EnemyData enemy)
            => OnCombatStarted?.Invoke(enemy);

        public static void RaiseCombatEnded(EnemyData enemy, bool victory)
            => OnCombatEnded?.Invoke(enemy, victory);

        public static void RaiseDamageDealt(int damage)
            => OnDamageDealt?.Invoke(damage);

        public static void RaiseDamageReceived(int damage)
            => OnDamageReceived?.Invoke(damage);

        public static void RaiseEquipmentObtained(EquipmentData equipment)
            => OnEquipmentObtained?.Invoke(equipment);

        public static void RaiseEquipmentEquipped(EquipmentSlot slot, EquipmentData equipment)
            => OnEquipmentEquipped?.Invoke(slot, equipment);

        public static void RaiseEquipmentFused(EquipmentData result)
            => OnEquipmentFused?.Invoke(result);

        public static void RaiseCardObtained(CardData card)
            => OnCardObtained?.Invoke(card);

        public static void RaiseCardSetCompleted(string planetId, EraType era)
            => OnCardSetCompleted?.Invoke(planetId, era);

        public static void RaisePrestigeReset(int newLevel, double multiplier)
            => OnPrestigeReset?.Invoke(newLevel, multiplier);

        public static void RaisePrestigeResourceGenerated(double amount)
            => OnPrestigeResourceGenerated?.Invoke(amount);

        public static void RaiseAchievementUnlocked(string achievementId)
            => OnAchievementUnlocked?.Invoke(achievementId);

        public static void RaiseToolObtained(ToolData tool)
            => OnToolObtained?.Invoke(tool);

        public static void RaiseToolFused(ToolData result)
            => OnToolFused?.Invoke(result);

        public static void RaiseGameSaved()
            => OnGameSaved?.Invoke();

        public static void RaiseGameLoaded()
            => OnGameLoaded?.Invoke();
    }
}
