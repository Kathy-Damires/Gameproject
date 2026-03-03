using UnityEngine;
using System.Collections.Generic;

namespace ProjectEvolvion
{
    public class PlanetSystem : MonoBehaviour
    {
        private PlayerState _state;
        private GameDatabase _db;

        public void Initialize(PlayerState state, GameDatabase db)
        {
            _state = state;
            _db = db;
        }

        public PlanetState GetActivePlanet() => _state.GetActivePlanet();

        public EraType GetCurrentEra()
        {
            var planet = GetActivePlanet();
            return planet?.currentEra ?? EraType.StoneAge;
        }

        public void SelectPlanet(string planetId)
        {
            var planet = _state.GetPlanet(planetId);
            if (planet == null || !planet.isUnlocked) return;

            _state.activePlanetId = planetId;
            GameEvents.RaisePlanetSelected(planetId);
        }

        public bool CanAdvanceEra()
        {
            var planet = GetActivePlanet();
            if (planet == null) return false;

            int nextEraIndex = (int)planet.currentEra + 1;
            if (nextEraIndex > (int)EraType.SingularityAge) return false;

            EraType nextEra = (EraType)nextEraIndex;
            var eraData = _db.GetEraByType(nextEra);
            if (eraData == null) return false;

            // Check if player has met requirements
            if (eraData.unlockCost != null && eraData.unlockCost.Length > 0)
            {
                if (!_state.CanAfford(eraData.unlockCost))
                    return false;
            }

            // Check if all current era structures are at minimum level 5
            var currentEraStructures = _db.GetStructuresForEra(planet.currentEra);
            foreach (var structData in currentEraStructures)
            {
                var structState = planet.GetStructure(structData.structureId);
                if (structState == null || !structState.isBuilt || structState.level < 5)
                    return false;
            }

            return true;
        }

        public bool AdvanceEra()
        {
            if (!CanAdvanceEra()) return false;

            var planet = GetActivePlanet();
            int nextEraIndex = (int)planet.currentEra + 1;
            EraType nextEra = (EraType)nextEraIndex;

            var eraData = _db.GetEraByType(nextEra);
            if (eraData.unlockCost != null && eraData.unlockCost.Length > 0)
                _state.SpendCosts(eraData.unlockCost);

            planet.currentEra = nextEra;
            GameEvents.RaiseEraAdvanced(planet.planetId, nextEra);

            Debug.Log($"[PlanetSystem] Advanced to {nextEra} on {planet.planetId}");
            return true;
        }

        public bool UnlockPlanet(string planetId)
        {
            var planet = _state.GetPlanet(planetId);
            if (planet == null || planet.isUnlocked) return false;

            planet.isUnlocked = true;
            planet.currentEra = EraType.StoneAge;
            return true;
        }

        public List<PlanetData> GetAllPlanets() =>
            new List<PlanetData>(_db.planets);

        public EraData GetCurrentEraData()
        {
            var planet = GetActivePlanet();
            return planet != null ? _db.GetEraByType(planet.currentEra) : null;
        }

        public float GetEraProgressPercent()
        {
            var planet = GetActivePlanet();
            if (planet == null) return 0f;

            var currentEraStructures = _db.GetStructuresForEra(planet.currentEra);
            if (currentEraStructures.Length == 0) return 1f;

            int totalRequired = currentEraStructures.Length * 5; // level 5 minimum each
            int totalProgress = 0;

            foreach (var structData in currentEraStructures)
            {
                var structState = planet.GetStructure(structData.structureId);
                if (structState != null && structState.isBuilt)
                    totalProgress += Mathf.Min(structState.level, 5);
            }

            return Mathf.Clamp01((float)totalProgress / totalRequired);
        }
    }
}
