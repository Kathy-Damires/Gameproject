using UnityEngine;
using System.Collections.Generic;

namespace ProjectEvolvion
{
    [CreateAssetMenu(fileName = "NewEra", menuName = "Evolvion/Era Data")]
    public class EraData : ScriptableObject
    {
        public string eraId;
        public string eraName;
        public EraType eraType;
        [TextArea(2, 4)]
        public string description;
        public Sprite icon;

        [Header("Content")]
        public StructureData[] structures;
        public EnemyData[] enemies;
        public CardData[] cards;
        public EquipmentData[] availableEquipment;
        public ToolData[] tools;

        [Header("Requirements to Unlock")]
        public EraType previousEra;
        public ResourceCost[] unlockCost;
    }

    [System.Serializable]
    public class ResourceCost
    {
        public ResourceType resourceType;
        public double amount;
    }
}
