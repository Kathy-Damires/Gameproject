using UnityEngine;

namespace ProjectEvolvion
{
    [CreateAssetMenu(fileName = "NewTool", menuName = "Evolvion/Tool Data")]
    public class ToolData : ScriptableObject
    {
        public string toolId;
        public string toolName;
        [TextArea(2, 4)]
        public string description;
        public Sprite icon;
        public EraType era;
        public Rarity rarity;

        [Header("Bonus")]
        public float productionBonusPercent = 10f;

        [Header("Fusion")]
        public ToolData nextRarityTool;
        public int fusionRequiredCount = 3;
    }
}
