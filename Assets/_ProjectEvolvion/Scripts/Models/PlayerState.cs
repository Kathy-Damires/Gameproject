using System;
using System.Collections.Generic;

namespace ProjectEvolvion
{
    [Serializable]
    public class PlayerState
    {
        public string playerId;
        public string playerName = "Player";
        public long lastSaveTimestamp;

        // Resources
        public SerializableDictionary<ResourceType, double> resources = new SerializableDictionary<ResourceType, double>();

        // Planets
        public List<PlanetState> planets = new List<PlanetState>();
        public string activePlanetId = "porera";

        // Aris
        public ArisState aris = new ArisState();

        // Cards
        public CardCollectionState cardCollection = new CardCollectionState();

        // Prestige
        public PrestigeState prestige = new PrestigeState();

        // Shop & Monetization
        public ShopState shop = new ShopState();

        // Clan
        public ClanState clan = new ClanState();

        // Achievements
        public List<string> unlockedAchievements = new List<string>();

        // Tools inventory
        public List<ToolInstance> toolInventory = new List<ToolInstance>();

        // Stats tracking
        public int totalEnemiesDefeated;
        public int totalStructuresBuilt;
        public double totalResourcesCollected;

        public double GetResource(ResourceType type)
        {
            return resources.ContainsKey(type) ? resources[type] : 0;
        }

        public void SetResource(ResourceType type, double amount)
        {
            resources[type] = amount;
        }

        public void AddResource(ResourceType type, double amount)
        {
            if (!resources.ContainsKey(type))
                resources[type] = 0;
            resources[type] += amount;
            totalResourcesCollected += amount;
        }

        public bool SpendResource(ResourceType type, double amount)
        {
            if (GetResource(type) < amount) return false;
            resources[type] -= amount;
            return true;
        }

        public bool CanAfford(ResourceCost[] costs)
        {
            foreach (var cost in costs)
            {
                if (GetResource(cost.resourceType) < cost.amount)
                    return false;
            }
            return true;
        }

        public void SpendCosts(ResourceCost[] costs)
        {
            foreach (var cost in costs)
                SpendResource(cost.resourceType, cost.amount);
        }

        public PlanetState GetPlanet(string planetId)
        {
            return planets.Find(p => p.planetId == planetId);
        }

        public PlanetState GetActivePlanet()
        {
            return GetPlanet(activePlanetId);
        }
    }

    [Serializable]
    public class ToolInstance
    {
        public string instanceId;
        public string toolDataId;
    }

    [Serializable]
    public class SerializableDictionary<TKey, TValue> : Dictionary<TKey, TValue>, ISerializationCallbackReceiver
        where TKey : Enum
    {
        [UnityEngine.SerializeField] private List<TKey> _keys = new List<TKey>();
        [UnityEngine.SerializeField] private List<TValue> _values = new List<TValue>();

        public void OnBeforeSerialize()
        {
            _keys.Clear();
            _values.Clear();
            foreach (var kvp in this)
            {
                _keys.Add(kvp.Key);
                _values.Add(kvp.Value);
            }
        }

        public void OnAfterDeserialize()
        {
            Clear();
            for (int i = 0; i < _keys.Count && i < _values.Count; i++)
                this[_keys[i]] = _values[i];
        }
    }
}
