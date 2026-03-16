using UnityEngine;

namespace ProjectEvolvion
{
    [CreateAssetMenu(fileName = "NewEquipment", menuName = "Evolvion/Equipment Data")]
    public class EquipmentData : ScriptableObject
    {
        public string equipmentId;
        public string equipmentName;
        [TextArea(2, 4)]
        public string description;
        public Sprite icon;
        public EraType era;
        public EquipmentSlot slot;
        public Rarity rarity;

        [Header("Stats")]
        public int attackBonus;
        public int defenseBonus;
        public int hpBonus;
        public float specialEffectValue;

        [Header("Fusion")]
        public EquipmentData nextRarityEquipment;
        public int fusionRequiredCount = 3;

        [Header("Recycle")]
        public ResourceCost[] recycleReward;
    }
}
