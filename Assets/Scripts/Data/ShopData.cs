using UnityEngine;

namespace ProjectEvolvion
{
    [CreateAssetMenu(fileName = "NewShopItem", menuName = "Evolvion/Shop Item")]
    public class ShopData : ScriptableObject
    {
        public string itemId;
        public string itemName;
        [TextArea(2, 4)]
        public string description;
        public Sprite icon;
        public ShopItemType itemType;
        public ShopCurrencyType currencyType;
        public double price;

        [Header("Rewards")]
        public ResourceCost[] resourceRewards;
        public EquipmentData[] equipmentRewards;
        public CardData[] cardRewards;
        public int diamondReward;
        public int energyReward;

        [Header("Boost")]
        public float boostMultiplier = 1f;
        public float boostDurationMinutes = 0f;

        [Header("Chest")]
        public int chestMinItems = 1;
        public int chestMaxItems = 3;
        public float chestEpicChance = 0.1f;
        public float chestLegendaryChance = 0.02f;

        [Header("Display")]
        public bool isFeatured = false;
        public bool isLimitedTime = false;
        public string badgeText;
    }

    public enum ShopItemType
    {
        ResourcePack,
        Bundle,
        Chest,
        Boost,
        AdReward,
        VIPSubscription,
        BattlePass,
        DiamondPack,
        EnergyPack,
        SpecialOffer
    }

    public enum ShopCurrencyType
    {
        Diamonds,
        RealMoney,
        Energy,
        AdWatch
    }

    [CreateAssetMenu(fileName = "NewBattlePassReward", menuName = "Evolvion/Battle Pass Reward")]
    public class BattlePassRewardData : ScriptableObject
    {
        public int level;
        public bool isPremium;
        public ResourceCost[] resourceRewards;
        public EquipmentData equipmentReward;
        public CardData cardReward;
        public int diamondReward;
        public int energyReward;
        public string description;
    }
}
