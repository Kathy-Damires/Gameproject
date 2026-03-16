using System;
using System.Collections.Generic;

namespace ProjectEvolvion
{
    [Serializable]
    public class PlanetState
    {
        public string planetId;
        public EraType currentEra = EraType.StoneAge;
        public List<StructureState> structures = new List<StructureState>();
        public bool isUnlocked = false;

        public StructureState GetStructure(string structureId)
        {
            return structures.Find(s => s.structureId == structureId);
        }

        public StructureState GetOrCreateStructure(string structureId)
        {
            var state = GetStructure(structureId);
            if (state == null)
            {
                state = new StructureState { structureId = structureId };
                structures.Add(state);
            }
            return state;
        }
    }

    [Serializable]
    public class StructureState
    {
        public string structureId;
        public int level = 0;
        public bool isBuilt = false;
        public string assignedToolId;
    }
}
