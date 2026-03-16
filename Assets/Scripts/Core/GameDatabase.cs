using UnityEngine;
using System.Collections.Generic;
using System.Linq;

namespace ProjectEvolvion
{
    public class GameDatabase : MonoBehaviour
    {
        [Header("All Game Data")]
        public PlanetData[] planets;
        public EraData[] eras;
        public StructureData[] structures;
        public ToolData[] tools;
        public EnemyData[] enemies;
        public EquipmentData[] equipment;
        public CardData[] cards;

        private Dictionary<string, PlanetData> _planetLookup;
        private Dictionary<string, EraData> _eraLookup;
        private Dictionary<string, StructureData> _structureLookup;
        private Dictionary<string, ToolData> _toolLookup;
        private Dictionary<string, EnemyData> _enemyLookup;
        private Dictionary<string, EquipmentData> _equipmentLookup;
        private Dictionary<string, CardData> _cardLookup;

        public void Initialize()
        {
            _planetLookup = planets.ToDictionary(p => p.planetId, p => p);
            _eraLookup = eras.ToDictionary(e => e.eraId, e => e);
            _structureLookup = structures.ToDictionary(s => s.structureId, s => s);
            _toolLookup = tools.ToDictionary(t => t.toolId, t => t);
            _enemyLookup = enemies.ToDictionary(e => e.enemyId, e => e);
            _equipmentLookup = equipment.ToDictionary(eq => eq.equipmentId, eq => eq);
            _cardLookup = cards.ToDictionary(c => c.cardId, c => c);
        }

        public PlanetData GetPlanet(string id) =>
            _planetLookup.TryGetValue(id, out var data) ? data : null;

        public EraData GetEra(string id) =>
            _eraLookup.TryGetValue(id, out var data) ? data : null;

        public StructureData GetStructure(string id) =>
            _structureLookup.TryGetValue(id, out var data) ? data : null;

        public ToolData GetTool(string id) =>
            _toolLookup.TryGetValue(id, out var data) ? data : null;

        public EnemyData GetEnemy(string id) =>
            _enemyLookup.TryGetValue(id, out var data) ? data : null;

        public EquipmentData GetEquipment(string id) =>
            _equipmentLookup.TryGetValue(id, out var data) ? data : null;

        public CardData GetCard(string id) =>
            _cardLookup.TryGetValue(id, out var data) ? data : null;

        public EraData GetEraByType(EraType type) =>
            eras.FirstOrDefault(e => e.eraType == type);

        public StructureData[] GetStructuresForEra(EraType era) =>
            structures.Where(s => s.era == era).ToArray();

        public EnemyData[] GetEnemiesForEra(EraType era) =>
            enemies.Where(e => e.era == era).ToArray();

        public EquipmentData[] GetEquipmentForEra(EraType era) =>
            equipment.Where(eq => eq.era == era).ToArray();

        public EquipmentData[] GetEquipmentForSlotAndRarity(EquipmentSlot slot, Rarity rarity) =>
            equipment.Where(eq => eq.slot == slot && eq.rarity == rarity).ToArray();

        public CardData[] GetCardsForPlanetAndEra(string planetId, EraType era) =>
            cards.Where(c => c.planetId == planetId && c.era == era).ToArray();
    }
}
