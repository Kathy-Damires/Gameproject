using System;
using System.Collections.Generic;

namespace ProjectEvolvion
{
    [Serializable]
    public class PrestigeState
    {
        public int prestigeLevel = 0;
        public double prestigeMultiplier = 1.0;
        public double accumulatedResources = 0;
        public double currentRunResources = 0;
        public double baseProductionPerSecond = 1.0;
        public List<PrestigeUpgrade> upgrades = new List<PrestigeUpgrade>();
        public int totalResets = 0;

        public double GetEffectiveProduction()
        {
            double production = baseProductionPerSecond * prestigeMultiplier;
            foreach (var upgrade in upgrades)
            {
                if (upgrade.isPurchased)
                    production *= upgrade.multiplier;
            }
            return production;
        }

        public double CalculatePrestigeGain()
        {
            return System.Math.Floor(System.Math.Sqrt(currentRunResources / 1000.0));
        }

        public void PerformReset()
        {
            double gain = CalculatePrestigeGain();
            prestigeLevel += (int)gain;
            prestigeMultiplier = 1.0 + (prestigeLevel * 0.1);
            currentRunResources = 0;
            totalResets++;
        }
    }

    [Serializable]
    public class PrestigeUpgrade
    {
        public string upgradeId;
        public string upgradeName;
        public double cost;
        public double multiplier = 1.1;
        public bool isPurchased = false;
    }
}
