using System;
using System.Collections.Generic;

namespace ProjectEvolvion
{
    [Serializable]
    public class ClanState
    {
        public string clanId;
        public string clanName;
        public bool isInClan = false;
        public ClanRank playerRank = ClanRank.Member;

        // Donations
        public double totalEnergyDonated = 0;
        public double totalResourcesDonated = 0;
        public int donationsToday = 0;
        public int maxDonationsPerDay = 5;
        public long lastDonationResetTimestamp;

        // Clan members (simulated for offline, real data from server in production)
        public List<ClanMember> members = new List<ClanMember>();

        // Active event
        public ClanEventState activeEvent;

        // Clan achievements
        public List<string> unlockedClanAchievements = new List<string>();

        // Clan stats
        public int clanLevel = 1;
        public double clanExp = 0;
        public double clanExpToNext = 500;
        public int totalMembersCount = 1;
        public int maxMembers = 30;

        // Global ranking
        public int globalRank = 0;
        public double globalScore = 0;

        public bool CanDonate()
        {
            RefreshDonationCounter();
            return donationsToday < maxDonationsPerDay;
        }

        public void RefreshDonationCounter()
        {
            long now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            if (now - lastDonationResetTimestamp >= 86400)
            {
                donationsToday = 0;
                lastDonationResetTimestamp = now;
            }
        }

        public void AddClanExp(double amount)
        {
            clanExp += amount;
            while (clanExp >= clanExpToNext)
            {
                clanExp -= clanExpToNext;
                clanLevel++;
                clanExpToNext *= 1.3;
                maxMembers += 5;
            }
        }
    }

    [Serializable]
    public class ClanMember
    {
        public string playerId;
        public string playerName;
        public ClanRank rank;
        public int level;
        public double totalDonated;
        public long lastActiveTimestamp;
    }

    [Serializable]
    public class ClanEventState
    {
        public string eventId;
        public string eventName;
        public ClanEventType eventType;
        public double targetAmount;
        public double currentProgress;
        public long startTimestamp;
        public long endTimestamp;
        public bool isCompleted;
        public bool rewardsClaimed;

        public float GetProgressPercent()
        {
            if (targetAmount <= 0) return 1f;
            return (float)System.Math.Min(1.0, currentProgress / targetAmount);
        }

        public bool IsExpired()
        {
            return DateTimeOffset.UtcNow.ToUnixTimeSeconds() > endTimestamp;
        }
    }
}
