using UnityEngine;
using System.Collections.Generic;

namespace ProjectEvolvion
{
    public class StructureSystem : MonoBehaviour
    {
        private PlayerState _state;
        private GameDatabase _db;

        public void Initialize(PlayerState state, GameDatabase db)
        {
            _state = state;
            _db = db;
        }

        public void Tick(float deltaTime)
        {
            var planet = _state.GetActivePlanet();
            if (planet == null) return;

            foreach (var structState in planet.structures)
            {
                if (!structState.isBuilt || structState.level <= 0) continue;

                var data = _db.GetStructure(structState.structureId);
                if (data == null) continue;

                double production = CalculateProduction(data, structState);
                double earned = production * deltaTime;

                _state.AddResource(data.producedResource, earned);
                GameEvents.RaiseResourceChanged(data.producedResource, _state.GetResource(data.producedResource));
            }
        }

        public double CalculateProduction(StructureData data, StructureState state)
        {
            double baseProduction = data.baseProductionPerSecond * state.level;
            double levelMultiplier = System.Math.Pow(data.productionMultiplierPerLevel, state.level - 1);
            double toolBonus = GetToolBonus(state);
            return baseProduction * levelMultiplier * toolBonus;
        }

        private double GetToolBonus(StructureState state)
        {
            if (string.IsNullOrEmpty(state.assignedToolId)) return 1.0;
            var tool = _db.GetTool(state.assignedToolId);
            return tool != null ? 1.0 + (tool.productionBonusPercent / 100.0) : 1.0;
        }

        public bool BuildStructure(string structureId)
        {
            var data = _db.GetStructure(structureId);
            if (data == null) return false;

            var planet = _state.GetActivePlanet();
            if (planet == null) return false;

            // Check era requirement
            if (data.era > planet.currentEra) return false;

            var structState = planet.GetOrCreateStructure(structureId);
            if (structState.isBuilt) return false;

            // Check and spend cost
            if (!_state.CanAfford(data.buildCost)) return false;
            _state.SpendCosts(data.buildCost);

            structState.isBuilt = true;
            structState.level = 1;
            _state.totalStructuresBuilt++;

            GameEvents.RaiseStructureBuilt(structureId, 1);
            return true;
        }

        public bool UpgradeStructure(string structureId)
        {
            var data = _db.GetStructure(structureId);
            if (data == null) return false;

            var planet = _state.GetActivePlanet();
            var structState = planet?.GetStructure(structureId);
            if (structState == null || !structState.isBuilt) return false;
            if (structState.level >= data.maxLevel) return false;

            // Calculate scaled cost
            var resourceSystem = GameManager.Instance.resourceSystem;
            if (!resourceSystem.SpendScaledCosts(data.buildCost, data.upgradeCostMultiplier, structState.level))
                return false;

            structState.level++;
            GameEvents.RaiseStructureUpgraded(structureId, structState.level);
            return true;
        }

        public double GetTotalProductionPerSecond()
        {
            double total = 0;
            var planet = _state.GetActivePlanet();
            if (planet == null) return 0;

            foreach (var structState in planet.structures)
            {
                if (!structState.isBuilt || structState.level <= 0) continue;
                var data = _db.GetStructure(structState.structureId);
                if (data == null) continue;
                total += CalculateProduction(data, structState);
            }
            return total;
        }

        public void DistributeOfflineEarnings(float offlineSeconds)
        {
            var planet = _state.GetActivePlanet();
            if (planet == null) return;

            foreach (var structState in planet.structures)
            {
                if (!structState.isBuilt || structState.level <= 0) continue;
                var data = _db.GetStructure(structState.structureId);
                if (data == null) continue;

                double production = CalculateProduction(data, structState);
                double offlineEarning = production * offlineSeconds * 0.5; // 50% offline rate
                _state.AddResource(data.producedResource, offlineEarning);
            }
        }

        public List<StructureData> GetAvailableStructures()
        {
            var planet = _state.GetActivePlanet();
            if (planet == null) return new List<StructureData>();

            var available = new List<StructureData>();
            // Get structures up to current era
            for (int i = 0; i <= (int)planet.currentEra; i++)
            {
                var eraStructures = _db.GetStructuresForEra((EraType)i);
                available.AddRange(eraStructures);
            }
            return available;
        }
    }
}
