using UnityEngine;

namespace ProjectEvolvion
{
    [CreateAssetMenu(fileName = "NewClanEvent", menuName = "Evolvion/Clan Event")]
    public class ClanEventData : ScriptableObject
    {
        public string eventId;
        public string eventName;
        [TextArea(2, 4)]
        public string description;
        public Sprite icon;

        [Header("Objective")]
        public ClanEventType eventType;
        public double targetAmount;
        public float durationHours = 48f;

        [Header("Rewards")]
        public ResourceCost[] individualRewards;
        public ResourceCost[] clanRewards;
        public int diamondReward;
        public int energyReward;
        public int battlePassExpReward = 30;
    }

    public enum ClanEventType
    {
        CollectResources,
        DefeatEnemies,
        BuildStructures,
        DonateEnergy,
        CollectCards
    }

    public enum ClanRank
    {
        Member,
        Elder,
        CoLeader,
        Leader
    }
}
