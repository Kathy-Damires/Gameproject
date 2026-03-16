using System;
using System.Collections.Generic;

namespace ProjectEvolvion
{
    [Serializable]
    public class CardCollectionState
    {
        public List<string> ownedCardIds = new List<string>();
        public List<string> completedSetKeys = new List<string>();

        public bool HasCard(string cardId) => ownedCardIds.Contains(cardId);

        public void AddCard(string cardId)
        {
            if (!ownedCardIds.Contains(cardId))
                ownedCardIds.Add(cardId);
        }

        public bool IsSetCompleted(string planetId, EraType era)
        {
            string key = $"{planetId}_{era}";
            return completedSetKeys.Contains(key);
        }

        public void MarkSetCompleted(string planetId, EraType era)
        {
            string key = $"{planetId}_{era}";
            if (!completedSetKeys.Contains(key))
                completedSetKeys.Add(key);
        }

        public int GetCardCountForSet(string planetId, EraType era, CardData[] allCards)
        {
            int count = 0;
            foreach (var card in allCards)
            {
                if (card.planetId == planetId && card.era == era && ownedCardIds.Contains(card.cardId))
                    count++;
            }
            return count;
        }
    }
}
