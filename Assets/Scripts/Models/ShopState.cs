using System;
using System.Collections.Generic;

namespace ProjectEvolvion
{
    [Serializable]
    public class ShopState
    {
        // VIP
        public bool isVIP = false;
        public long vipExpirationTimestamp;
        public long lastVIPDailyClaimTimestamp;
        public long lastVIPWeeklyClaimTimestamp;

        // Battle Pass
        public bool hasPremiumBattlePass = false;
        public int battlePassLevel = 0;
        public int battlePassExp = 0;
        public int battlePassExpPerLevel = 100;
        public List<int> claimedFreeRewards = new List<int>();
        public List<int> claimedPremiumRewards = new List<int>();
        public long battlePassSeasonEndTimestamp;

        // Ad tracking
        public int adsWatchedToday = 0;
        public int maxAdsPerDay = 10;
        public long lastAdResetTimestamp;

        // Purchase history
        public List<string> purchasedOneTimeItems = new List<string>();
        public int totalPurchaseCount = 0;
        public double totalSpent = 0;

        // Active boosts
        public List<ActiveBoost> activeBoosts = new List<ActiveBoost>();

        public bool IsVIPActive()
        {
            if (!isVIP) return false;
            return DateTimeOffset.UtcNow.ToUnixTimeSeconds() < vipExpirationTimestamp;
        }

        public bool CanWatchAd()
        {
            RefreshAdCounter();
            return adsWatchedToday < maxAdsPerDay;
        }

        public void RefreshAdCounter()
        {
            long now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            long dayInSeconds = 86400;
            if (now - lastAdResetTimestamp >= dayInSeconds)
            {
                adsWatchedToday = 0;
                lastAdResetTimestamp = now;
            }
        }

        public bool CanClaimVIPDaily()
        {
            if (!IsVIPActive()) return false;
            long now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            return now - lastVIPDailyClaimTimestamp >= 86400;
        }

        public bool CanClaimVIPWeekly()
        {
            if (!IsVIPActive()) return false;
            long now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            return now - lastVIPWeeklyClaimTimestamp >= 604800;
        }

        public void AddBattlePassExp(int amount)
        {
            battlePassExp += amount;
            while (battlePassExp >= battlePassExpPerLevel)
            {
                battlePassExp -= battlePassExpPerLevel;
                battlePassLevel++;
                battlePassExpPerLevel = (int)(battlePassExpPerLevel * 1.1f);
            }
        }

        public float GetBoostMultiplier()
        {
            float mult = 1f;
            long now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            for (int i = activeBoosts.Count - 1; i >= 0; i--)
            {
                if (now >= activeBoosts[i].expirationTimestamp)
                {
                    activeBoosts.RemoveAt(i);
                    continue;
                }
                mult *= activeBoosts[i].multiplier;
            }
            if (IsVIPActive()) mult *= 1.2f; // VIP 20% bonus
            return mult;
        }
    }

    [Serializable]
    public class ActiveBoost
    {
        public string boostId;
        public float multiplier;
        public long expirationTimestamp;
    }
}
