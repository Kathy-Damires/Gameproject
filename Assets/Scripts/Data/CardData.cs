using UnityEngine;

namespace ProjectEvolvion
{
    [CreateAssetMenu(fileName = "NewCard", menuName = "Evolvion/Card Data")]
    public class CardData : ScriptableObject
    {
        public string cardId;
        public string cardName;
        [TextArea(2, 4)]
        public string description;
        public Sprite artwork;
        public EraType era;
        public string planetId;
        public Rarity rarity;
        public int setIndex;

        [Header("Set Completion Reward")]
        public ResourceCost[] setCompletionReward;
    }
}
