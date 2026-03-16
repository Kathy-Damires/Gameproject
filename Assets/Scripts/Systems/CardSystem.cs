using UnityEngine;
using System.Collections.Generic;

namespace ProjectEvolvion
{
    public class CardSystem : MonoBehaviour
    {
        private PlayerState _state;
        private GameDatabase _db;

        public void Initialize(PlayerState state, GameDatabase db)
        {
            _state = state;
            _db = db;
        }

        public bool UnlockCard(string cardId)
        {
            if (_state.cardCollection.HasCard(cardId)) return false;

            var data = _db.GetCard(cardId);
            if (data == null) return false;

            _state.cardCollection.AddCard(cardId);
            GameEvents.RaiseCardObtained(data);

            // Check if set is completed
            CheckSetCompletion(data.planetId, data.era);

            Debug.Log($"[CardSystem] Card unlocked: {data.cardName}");
            return true;
        }

        private void CheckSetCompletion(string planetId, EraType era)
        {
            if (_state.cardCollection.IsSetCompleted(planetId, era)) return;

            var setCards = _db.GetCardsForPlanetAndEra(planetId, era);
            int ownedCount = _state.cardCollection.GetCardCountForSet(planetId, era, setCards);

            if (ownedCount >= setCards.Length && setCards.Length > 0)
            {
                _state.cardCollection.MarkSetCompleted(planetId, era);
                GameEvents.RaiseCardSetCompleted(planetId, era);

                // Award set completion rewards
                AwardSetRewards(setCards);

                Debug.Log($"[CardSystem] Set completed: {planetId} - {era}");
            }
        }

        private void AwardSetRewards(CardData[] setCards)
        {
            var resourceSystem = GameManager.Instance.resourceSystem;
            foreach (var card in setCards)
            {
                if (card.setCompletionReward != null)
                {
                    foreach (var reward in card.setCompletionReward)
                        resourceSystem.AddResource(reward.resourceType, reward.amount);
                    break; // Only award once per set
                }
            }
        }

        public int GetCardCount() => _state.cardCollection.ownedCardIds.Count;

        public int GetSetProgress(string planetId, EraType era)
        {
            var setCards = _db.GetCardsForPlanetAndEra(planetId, era);
            return _state.cardCollection.GetCardCountForSet(planetId, era, setCards);
        }

        public int GetSetTotal(string planetId, EraType era)
        {
            return _db.GetCardsForPlanetAndEra(planetId, era).Length;
        }

        public bool HasCard(string cardId) => _state.cardCollection.HasCard(cardId);

        public List<CardData> GetAllCardsForPlanet(string planetId)
        {
            var result = new List<CardData>();
            foreach (var card in _db.cards)
            {
                if (card.planetId == planetId)
                    result.Add(card);
            }
            return result;
        }
    }
}
