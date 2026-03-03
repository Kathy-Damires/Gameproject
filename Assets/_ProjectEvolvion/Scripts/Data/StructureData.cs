using UnityEngine;

namespace ProjectEvolvion
{
    [CreateAssetMenu(fileName = "NewStructure", menuName = "Evolvion/Structure Data")]
    public class StructureData : ScriptableObject
    {
        public string structureId;
        public string structureName;
        [TextArea(2, 4)]
        public string description;
        public Sprite icon;
        public EraType era;

        [Header("Production")]
        public ResourceType producedResource;
        public double baseProductionPerSecond;
        public double productionMultiplierPerLevel = 1.15;

        [Header("Cost")]
        public ResourceCost[] buildCost;
        public double upgradeCostMultiplier = 1.5;
        public int maxLevel = 100;

        [Header("Associated Tool")]
        public ToolData associatedTool;
    }
}
