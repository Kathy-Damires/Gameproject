namespace ProjectEvolvion
{
    public enum EraType
    {
        StoneAge,
        TribalAge,
        BronzeAge,
        ClassicalAge,
        MiddleAge,
        IndustrialAge,
        RobotAge,
        SpaceAge,
        SingularityAge
    }

    public enum ResourceType
    {
        Stone,
        Wood,
        Food,
        Bronze,
        Energy,
        Diamonds
    }

    public enum Rarity
    {
        Common,
        Clear,
        Epic,
        Legendary
    }

    public enum EquipmentSlot
    {
        Helmet,
        Weapon,
        Armor,
        Gadget
    }

    public enum CombatState
    {
        Idle,
        PlayerTurn,
        EnemyTurn,
        Victory,
        Defeat
    }

    public enum PanelType
    {
        HUD,
        Planet,
        Structures,
        Combat,
        Equipment,
        CardAlbum,
        Prestige,
        Shop,
        Clan,
        Popup
    }

    public enum AchievementCategory
    {
        Planet,
        Combat,
        Collection,
        Clan,
        Purchase,
        Ads
    }

    public enum AchievementRewardType
    {
        Resources,
        EpicCard,
        LegendaryCard,
        Skin
    }
}
