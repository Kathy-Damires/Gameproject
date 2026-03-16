using UnityEngine;

namespace ProjectEvolvion
{
    public class PrestigeSystem : MonoBehaviour
    {
        private PlayerState _state;
        private bool _isActive = false;

        public bool IsActive => _isActive;
        public PrestigeState State => _state.prestige;

        public void Initialize(PlayerState state)
        {
            _state = state;
        }

        public void StartPrestigeMode()
        {
            _isActive = true;
        }

        public void StopPrestigeMode()
        {
            _isActive = false;
        }

        public void Tick(float deltaTime)
        {
            if (!_isActive) return;

            double production = _state.prestige.GetEffectiveProduction();
            double generated = production * deltaTime;

            _state.prestige.currentRunResources += generated;
            _state.prestige.accumulatedResources += generated;

            GameEvents.RaisePrestigeResourceGenerated(generated);
        }

        public double GetCurrentProduction() => _state.prestige.GetEffectiveProduction();

        public double GetPrestigeGainPreview() => _state.prestige.CalculatePrestigeGain();

        public bool CanPrestigeReset()
        {
            return _state.prestige.CalculatePrestigeGain() >= 1;
        }

        public void PerformPrestigeReset()
        {
            if (!CanPrestigeReset()) return;

            double gain = _state.prestige.CalculatePrestigeGain();
            _state.prestige.PerformReset();

            // Give bonus resources to main game
            var resourceSystem = GameManager.Instance.resourceSystem;
            resourceSystem.AddResource(ResourceType.Energy, gain * 5);

            GameEvents.RaisePrestigeReset(_state.prestige.prestigeLevel, _state.prestige.prestigeMultiplier);

            Debug.Log($"[PrestigeSystem] Prestige reset! Level: {_state.prestige.prestigeLevel}, Multiplier: {_state.prestige.prestigeMultiplier:F1}x");
        }

        public bool PurchaseUpgrade(string upgradeId)
        {
            var upgrade = _state.prestige.upgrades.Find(u => u.upgradeId == upgradeId);
            if (upgrade == null || upgrade.isPurchased) return false;

            if (_state.prestige.accumulatedResources < upgrade.cost) return false;

            _state.prestige.accumulatedResources -= upgrade.cost;
            upgrade.isPurchased = true;
            return true;
        }

        public void InitializeDefaultUpgrades()
        {
            if (_state.prestige.upgrades.Count > 0) return;

            _state.prestige.upgrades.Add(new PrestigeUpgrade
            {
                upgradeId = "prestige_speed_1",
                upgradeName = "Produccion Rapida I",
                cost = 100,
                multiplier = 1.5
            });
            _state.prestige.upgrades.Add(new PrestigeUpgrade
            {
                upgradeId = "prestige_speed_2",
                upgradeName = "Produccion Rapida II",
                cost = 500,
                multiplier = 2.0
            });
            _state.prestige.upgrades.Add(new PrestigeUpgrade
            {
                upgradeId = "prestige_speed_3",
                upgradeName = "Produccion Rapida III",
                cost = 2000,
                multiplier = 3.0
            });
        }
    }
}
