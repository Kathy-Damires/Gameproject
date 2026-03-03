using UnityEngine;

namespace ProjectEvolvion
{
    [CreateAssetMenu(fileName = "NewEnemy", menuName = "Evolvion/Enemy Data")]
    public class EnemyData : ScriptableObject
    {
        public string enemyId;
        public string enemyName;
        [TextArea(2, 4)]
        public string description;
        public Sprite icon;
        public EraType era;

        [Header("Stats")]
        public int maxHP = 100;
        public int attack = 10;
        public int defense = 5;
        public float attackSpeed = 1f;

        [Header("Rewards")]
        public ResourceReward[] resourceRewards;
        public float cardDropChance = 0.1f;
        public float equipmentDropChance = 0.05f;
        public int experienceReward = 10;
    }

    [System.Serializable]
    public class ResourceReward
    {
        public ResourceType resourceType;
        public double minAmount;
        public double maxAmount;
    }
}
