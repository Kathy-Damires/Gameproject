using UnityEngine;
using System.Collections.Generic;

namespace ProjectEvolvion
{
    public class ShopSystem : MonoBehaviour
    {
        private PlayerState _state;
        private GameDatabase _db;

        [Header("Shop Catalog")]
        public ShopData[] shopItems;
        public BattlePassRewardData[] battlePassRewards;

        public void Initialize(PlayerState state, GameDatabase db)
        {
            _state = state;
            _db = db;

            // Initialize shop state if needed
            if (_state.shop == null)
                _state.shop = new ShopState();
        }

        // ============ PURCHASE WITH DIAMONDS ============

        public bool PurchaseWithDiamonds(string itemId)
        {
            var item = GetShopItem(itemId);
            if (item == null || item.currencyType != ShopCurrencyType.Diamonds) return false;

            if (_state.GetResource(ResourceType.Diamonds) < item.price) return false;

            _state.SpendResource(ResourceType.Diamonds, item.price);
            DeliverRewards(item);
            TrackPurchase(item);

            Debug.Log($"[ShopSystem] Purchased: {item.itemName} for {item.price} diamonds");
            return true;
        }

        // ============ PURCHASE WITH ENERGY ============

        public bool PurchaseWithEnergy(string itemId)
        {
            var item = GetShopItem(itemId);
            if (item == null || item.currencyType != ShopCurrencyType.Energy) return false;

            if (_state.GetResource(ResourceType.Energy) < item.price) return false;

            _state.SpendResource(ResourceType.Energy, item.price);
            DeliverRewards(item);
            TrackPurchase(item);
            return true;
        }

        // ============ AD REWARDS ============

        public bool WatchAdForReward(string itemId)
        {
            var item = GetShopItem(itemId);
            if (item == null || item.currencyType != ShopCurrencyType.AdWatch) return false;

            if (!_state.shop.CanWatchAd()) return false;

            _state.shop.adsWatchedToday++;
            DeliverRewards(item);

            // Ad watching gives battle pass EXP
            _state.shop.AddBattlePassExp(10);

            Debug.Log($"[ShopSystem] Ad reward: {item.itemName} (Ads today: {_state.shop.adsWatchedToday})");
            return true;
        }

        public int GetRemainingAdsToday()
        {
            _state.shop.RefreshAdCounter();
            return _state.shop.maxAdsPerDay - _state.shop.adsWatchedToday;
        }

        // ============ REAL MONEY (IAP SIMULATION) ============

        public bool ProcessIAP(string itemId)
        {
            var item = GetShopItem(itemId);
            if (item == null || item.currencyType != ShopCurrencyType.RealMoney) return false;

            // In production: integrate with Unity IAP / Google Play / Apple Store
            // Here we simulate a successful purchase
            DeliverRewards(item);
            TrackPurchase(item);
            _state.shop.totalSpent += item.price;
            _state.shop.totalPurchaseCount++;

            // First purchase achievement
            if (_state.shop.totalPurchaseCount == 1)
                GameEvents.RaiseAchievementUnlocked("first_purchase");

            Debug.Log($"[ShopSystem] IAP processed: {item.itemName} (${item.price})");
            return true;
        }

        // ============ CHESTS ============

        public List<object> OpenChest(string chestItemId)
        {
            var item = GetShopItem(chestItemId);
            if (item == null || item.itemType != ShopItemType.Chest) return null;

            var rewards = new List<object>();
            int numItems = Random.Range(item.chestMinItems, item.chestMaxItems + 1);

            for (int i = 0; i < numItems; i++)
            {
                float roll = Random.value;

                if (roll < item.chestLegendaryChance)
                {
                    // Legendary equipment
                    var eq = GetRandomEquipment(Rarity.Legendary);
                    if (eq != null)
                    {
                        GameManager.Instance.equipmentSystem.AddEquipment(eq.equipmentId);
                        rewards.Add(eq);
                    }
                }
                else if (roll < item.chestEpicChance)
                {
                    // Epic equipment
                    var eq = GetRandomEquipment(Rarity.Epic);
                    if (eq != null)
                    {
                        GameManager.Instance.equipmentSystem.AddEquipment(eq.equipmentId);
                        rewards.Add(eq);
                    }
                }
                else if (roll < 0.4f)
                {
                    // Card drop
                    var planet = _state.GetActivePlanet();
                    if (planet != null)
                    {
                        var cards = _db.GetCardsForPlanetAndEra(planet.planetId, planet.currentEra);
                        if (cards.Length > 0)
                        {
                            var card = cards[Random.Range(0, cards.Length)];
                            GameManager.Instance.cardSystem.UnlockCard(card.cardId);
                            rewards.Add(card);
                        }
                    }
                }
                else
                {
                    // Resources
                    int amount = Random.Range(50, 200) * ((int)_state.GetActivePlanet().currentEra + 1);
                    ResourceType resType = (ResourceType)Random.Range(0, 4);
                    GameManager.Instance.resourceSystem.AddResource(resType, amount);
                    rewards.Add(new ResourceCost { resourceType = resType, amount = amount });
                }
            }

            return rewards;
        }

        private EquipmentData GetRandomEquipment(Rarity rarity)
        {
            var planet = _state.GetActivePlanet();
            if (planet == null) return null;

            var equipment = _db.GetEquipmentForEra(planet.currentEra);
            var filtered = System.Array.FindAll(equipment, e => e.rarity == rarity);
            if (filtered.Length == 0) return null;
            return filtered[Random.Range(0, filtered.Length)];
        }

        // ============ VIP ============

        public bool ActivateVIP(int durationDays)
        {
            long now = System.DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            _state.shop.isVIP = true;

            if (_state.shop.IsVIPActive())
                _state.shop.vipExpirationTimestamp += durationDays * 86400;
            else
                _state.shop.vipExpirationTimestamp = now + (durationDays * 86400);

            Debug.Log($"[ShopSystem] VIP activated for {durationDays} days");
            return true;
        }

        public bool ClaimVIPDailyReward()
        {
            if (!_state.shop.CanClaimVIPDaily()) return false;

            _state.shop.lastVIPDailyClaimTimestamp = System.DateTimeOffset.UtcNow.ToUnixTimeSeconds();

            // VIP daily rewards
            GameManager.Instance.resourceSystem.AddResource(ResourceType.Diamonds, 5);
            GameManager.Instance.resourceSystem.AddResource(ResourceType.Energy, 20);

            // Resources based on era
            int eraMultiplier = (int)_state.GetActivePlanet().currentEra + 1;
            GameManager.Instance.resourceSystem.AddResource(ResourceType.Stone, 100 * eraMultiplier);
            GameManager.Instance.resourceSystem.AddResource(ResourceType.Food, 80 * eraMultiplier);

            _state.shop.AddBattlePassExp(20);

            Debug.Log("[ShopSystem] VIP daily reward claimed");
            return true;
        }

        public bool ClaimVIPWeeklyReward()
        {
            if (!_state.shop.CanClaimVIPWeekly()) return false;

            _state.shop.lastVIPWeeklyClaimTimestamp = System.DateTimeOffset.UtcNow.ToUnixTimeSeconds();

            // VIP weekly: exclusive chest
            GameManager.Instance.resourceSystem.AddResource(ResourceType.Diamonds, 25);
            GameManager.Instance.resourceSystem.AddResource(ResourceType.Energy, 100);

            Debug.Log("[ShopSystem] VIP weekly reward claimed");
            return true;
        }

        // ============ BATTLE PASS ============

        public bool ActivatePremiumBattlePass()
        {
            _state.shop.hasPremiumBattlePass = true;
            Debug.Log("[ShopSystem] Premium Battle Pass activated");
            return true;
        }

        public bool ClaimBattlePassReward(int level, bool premium)
        {
            if (level > _state.shop.battlePassLevel) return false;

            if (premium)
            {
                if (!_state.shop.hasPremiumBattlePass) return false;
                if (_state.shop.claimedPremiumRewards.Contains(level)) return false;
                _state.shop.claimedPremiumRewards.Add(level);
            }
            else
            {
                if (_state.shop.claimedFreeRewards.Contains(level)) return false;
                _state.shop.claimedFreeRewards.Add(level);
            }

            // Find reward data
            var reward = System.Array.Find(battlePassRewards,
                r => r.level == level && r.isPremium == premium);

            if (reward != null)
                DeliverBattlePassReward(reward);

            return true;
        }

        private void DeliverBattlePassReward(BattlePassRewardData reward)
        {
            var resourceSystem = GameManager.Instance.resourceSystem;

            if (reward.resourceRewards != null)
            {
                foreach (var res in reward.resourceRewards)
                    resourceSystem.AddResource(res.resourceType, res.amount);
            }

            if (reward.diamondReward > 0)
                resourceSystem.AddResource(ResourceType.Diamonds, reward.diamondReward);

            if (reward.energyReward > 0)
                resourceSystem.AddResource(ResourceType.Energy, reward.energyReward);

            if (reward.equipmentReward != null)
                GameManager.Instance.equipmentSystem.AddEquipment(reward.equipmentReward.equipmentId);

            if (reward.cardReward != null)
                GameManager.Instance.cardSystem.UnlockCard(reward.cardReward.cardId);
        }

        public void AddBattlePassExp(int amount)
        {
            _state.shop.AddBattlePassExp(amount);
        }

        // ============ BOOSTS ============

        public void ActivateBoost(string boostId, float multiplier, float durationMinutes)
        {
            long expiration = System.DateTimeOffset.UtcNow.ToUnixTimeSeconds() + (long)(durationMinutes * 60);

            _state.shop.activeBoosts.Add(new ActiveBoost
            {
                boostId = boostId,
                multiplier = multiplier,
                expirationTimestamp = expiration
            });

            Debug.Log($"[ShopSystem] Boost activated: {multiplier}x for {durationMinutes} min");
        }

        public float GetCurrentBoostMultiplier() => _state.shop.GetBoostMultiplier();

        // ============ REWARD MULTIPLIER ============

        public bool DoubleRewardWithAd()
        {
            if (!_state.shop.CanWatchAd()) return false;
            _state.shop.adsWatchedToday++;
            return true; // Caller applies the doubling
        }

        // ============ HELPERS ============

        private void DeliverRewards(ShopData item)
        {
            var resourceSystem = GameManager.Instance.resourceSystem;

            if (item.resourceRewards != null)
            {
                foreach (var res in item.resourceRewards)
                    resourceSystem.AddResource(res.resourceType, res.amount);
            }

            if (item.diamondReward > 0)
                resourceSystem.AddResource(ResourceType.Diamonds, item.diamondReward);

            if (item.energyReward > 0)
                resourceSystem.AddResource(ResourceType.Energy, item.energyReward);

            if (item.equipmentRewards != null)
            {
                foreach (var eq in item.equipmentRewards)
                    GameManager.Instance.equipmentSystem.AddEquipment(eq.equipmentId);
            }

            if (item.cardRewards != null)
            {
                foreach (var card in item.cardRewards)
                    GameManager.Instance.cardSystem.UnlockCard(card.cardId);
            }

            if (item.boostMultiplier > 1f && item.boostDurationMinutes > 0)
                ActivateBoost(item.itemId, item.boostMultiplier, item.boostDurationMinutes);

            if (item.itemType == ShopItemType.VIPSubscription)
                ActivateVIP(30);

            if (item.itemType == ShopItemType.BattlePass)
                ActivatePremiumBattlePass();
        }

        private void TrackPurchase(ShopData item)
        {
            if (!_state.shop.purchasedOneTimeItems.Contains(item.itemId))
                _state.shop.purchasedOneTimeItems.Add(item.itemId);

            _state.shop.AddBattlePassExp(15);
        }

        public ShopData GetShopItem(string itemId) =>
            System.Array.Find(shopItems, i => i.itemId == itemId);

        public ShopData[] GetItemsByType(ShopItemType type) =>
            System.Array.FindAll(shopItems, i => i.itemType == type);

        public ShopData[] GetFeaturedItems() =>
            System.Array.FindAll(shopItems, i => i.isFeatured);
    }
}
