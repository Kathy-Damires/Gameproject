using UnityEngine;
using System.Collections.Generic;
using System.Linq;

namespace ProjectEvolvion
{
    public class ClanSystem : MonoBehaviour
    {
        private PlayerState _state;
        private GameDatabase _db;

        [Header("Clan Events")]
        public ClanEventData[] availableClanEvents;

        public ClanState ClanState => _state.clan;
        public bool IsInClan => _state.clan.isInClan;

        public void Initialize(PlayerState state, GameDatabase db)
        {
            _state = state;
            _db = db;

            if (_state.clan == null)
                _state.clan = new ClanState();

            // Subscribe to game events for cooperative tracking
            GameEvents.OnResourceSpent += OnResourceSpent;
            GameEvents.OnCombatEnded += OnCombatEnded;
            GameEvents.OnStructureBuilt += OnStructureBuilt;
            GameEvents.OnCardObtained += OnCardObtained;
        }

        private void OnDestroy()
        {
            GameEvents.OnResourceSpent -= OnResourceSpent;
            GameEvents.OnCombatEnded -= OnCombatEnded;
            GameEvents.OnStructureBuilt -= OnStructureBuilt;
            GameEvents.OnCardObtained -= OnCardObtained;
        }

        // ============ CLAN MANAGEMENT ============

        public bool CreateClan(string clanName)
        {
            if (_state.clan.isInClan) return false;
            if (string.IsNullOrEmpty(clanName)) return false;

            _state.clan.clanId = System.Guid.NewGuid().ToString();
            _state.clan.clanName = clanName;
            _state.clan.isInClan = true;
            _state.clan.playerRank = ClanRank.Leader;
            _state.clan.clanLevel = 1;
            _state.clan.totalMembersCount = 1;

            // Add self as first member
            _state.clan.members.Add(new ClanMember
            {
                playerId = _state.playerId,
                playerName = _state.playerName,
                rank = ClanRank.Leader,
                level = _state.aris.level,
                totalDonated = 0,
                lastActiveTimestamp = System.DateTimeOffset.UtcNow.ToUnixTimeSeconds()
            });

            // Simulate adding NPC members
            AddSimulatedMembers();

            Debug.Log($"[ClanSystem] Clan created: {clanName}");
            return true;
        }

        public bool JoinClan(string clanId)
        {
            if (_state.clan.isInClan) return false;

            // In production: verify with server, check clan capacity
            _state.clan.clanId = clanId;
            _state.clan.clanName = "Clan Evolvion"; // Would come from server
            _state.clan.isInClan = true;
            _state.clan.playerRank = ClanRank.Member;
            _state.clan.totalMembersCount = 1;

            AddSimulatedMembers();

            Debug.Log($"[ClanSystem] Joined clan: {_state.clan.clanName}");
            return true;
        }

        public void LeaveClan()
        {
            if (!_state.clan.isInClan) return;

            _state.clan.isInClan = false;
            _state.clan.clanId = null;
            _state.clan.clanName = null;
            _state.clan.playerRank = ClanRank.Member;
            _state.clan.members.Clear();
            _state.clan.activeEvent = null;

            Debug.Log("[ClanSystem] Left clan");
        }

        private void AddSimulatedMembers()
        {
            string[] names = { "Luna", "Zephyr", "Nova", "Atlas", "Kai", "Sage", "Ember", "Orion" };
            int count = Random.Range(3, 7);
            for (int i = 0; i < count; i++)
            {
                _state.clan.members.Add(new ClanMember
                {
                    playerId = "npc_" + i,
                    playerName = names[i % names.Length],
                    rank = i == 0 ? ClanRank.Elder : ClanRank.Member,
                    level = Random.Range(1, 15),
                    totalDonated = Random.Range(0, 500),
                    lastActiveTimestamp = System.DateTimeOffset.UtcNow.ToUnixTimeSeconds() - Random.Range(0, 86400)
                });
            }
            _state.clan.totalMembersCount = _state.clan.members.Count;
        }

        // ============ DONATIONS ============

        public bool DonateEnergy(double amount)
        {
            if (!_state.clan.isInClan) return false;
            if (!_state.clan.CanDonate()) return false;
            if (_state.GetResource(ResourceType.Energy) < amount) return false;

            _state.SpendResource(ResourceType.Energy, amount);
            GameEvents.RaiseResourceChanged(ResourceType.Energy, _state.GetResource(ResourceType.Energy));

            _state.clan.totalEnergyDonated += amount;
            _state.clan.totalResourcesDonated += amount;
            _state.clan.donationsToday++;
            _state.clan.AddClanExp(amount * 0.5);

            // Update clan event if active
            UpdateClanEvent(ClanEventType.DonateEnergy, amount);

            // Reward for donating
            GameManager.Instance.resourceSystem.AddResource(ResourceType.Diamonds, 1);

            Debug.Log($"[ClanSystem] Donated {amount} energy. Total: {_state.clan.totalEnergyDonated}");
            return true;
        }

        public bool DonateResource(ResourceType type, double amount)
        {
            if (!_state.clan.isInClan) return false;
            if (!_state.clan.CanDonate()) return false;
            if (_state.GetResource(type) < amount) return false;

            _state.SpendResource(type, amount);
            GameEvents.RaiseResourceChanged(type, _state.GetResource(type));

            _state.clan.totalResourcesDonated += amount;
            _state.clan.donationsToday++;
            _state.clan.AddClanExp(amount * 0.3);

            UpdateClanEvent(ClanEventType.CollectResources, amount);

            // Small diamond reward
            if (_state.clan.totalResourcesDonated % 100 < amount)
                GameManager.Instance.resourceSystem.AddResource(ResourceType.Diamonds, 1);

            return true;
        }

        public int GetRemainingDonationsToday()
        {
            _state.clan.RefreshDonationCounter();
            return _state.clan.maxDonationsPerDay - _state.clan.donationsToday;
        }

        // ============ CLAN EVENTS ============

        public bool StartClanEvent(string eventId)
        {
            if (!_state.clan.isInClan) return false;
            if (_state.clan.activeEvent != null && !_state.clan.activeEvent.IsExpired()) return false;

            var eventData = System.Array.Find(availableClanEvents, e => e.eventId == eventId);
            if (eventData == null) return false;

            long now = System.DateTimeOffset.UtcNow.ToUnixTimeSeconds();

            _state.clan.activeEvent = new ClanEventState
            {
                eventId = eventData.eventId,
                eventName = eventData.eventName,
                eventType = eventData.eventType,
                targetAmount = eventData.targetAmount,
                currentProgress = 0,
                startTimestamp = now,
                endTimestamp = now + (long)(eventData.durationHours * 3600),
                isCompleted = false,
                rewardsClaimed = false
            };

            Debug.Log($"[ClanSystem] Clan event started: {eventData.eventName}");
            return true;
        }

        private void UpdateClanEvent(ClanEventType type, double amount)
        {
            var evt = _state.clan.activeEvent;
            if (evt == null || evt.isCompleted || evt.IsExpired()) return;
            if (evt.eventType != type) return;

            evt.currentProgress += amount;

            // Simulate other clan members contributing
            evt.currentProgress += amount * 0.3 * (_state.clan.totalMembersCount - 1);

            if (evt.currentProgress >= evt.targetAmount)
            {
                evt.isCompleted = true;
                Debug.Log($"[ClanSystem] Clan event completed: {evt.eventName}!");
            }
        }

        public bool ClaimClanEventRewards()
        {
            var evt = _state.clan.activeEvent;
            if (evt == null || !evt.isCompleted || evt.rewardsClaimed) return false;

            evt.rewardsClaimed = true;

            var eventData = System.Array.Find(availableClanEvents, e => e.eventId == evt.eventId);
            if (eventData == null) return false;

            var resourceSystem = GameManager.Instance.resourceSystem;

            // Individual rewards
            if (eventData.individualRewards != null)
            {
                foreach (var reward in eventData.individualRewards)
                    resourceSystem.AddResource(reward.resourceType, reward.amount);
            }

            if (eventData.diamondReward > 0)
                resourceSystem.AddResource(ResourceType.Diamonds, eventData.diamondReward);

            if (eventData.energyReward > 0)
                resourceSystem.AddResource(ResourceType.Energy, eventData.energyReward);

            // Clan EXP
            _state.clan.AddClanExp(eventData.targetAmount * 0.1);

            // Battle pass EXP
            if (GameManager.Instance.shopSystem != null)
                GameManager.Instance.shopSystem.AddBattlePassExp(eventData.battlePassExpReward);

            Debug.Log($"[ClanSystem] Clan event rewards claimed for: {evt.eventName}");
            return true;
        }

        public ClanEventState GetActiveEvent() => _state.clan.activeEvent;

        // ============ RANKINGS ============

        public List<ClanMember> GetMemberRanking()
        {
            return _state.clan.members.OrderByDescending(m => m.totalDonated).ToList();
        }

        public void UpdateGlobalScore()
        {
            // Global score based on: donations + events completed + clan level
            _state.clan.globalScore = _state.clan.totalResourcesDonated +
                                       _state.clan.unlockedClanAchievements.Count * 100 +
                                       _state.clan.clanLevel * 50;
        }

        // ============ CLAN ACHIEVEMENTS ============

        public void CheckClanAchievements()
        {
            if (!_state.clan.isInClan) return;

            var achievements = new Dictionary<string, System.Func<bool>>
            {
                { "clan_donate_100", () => _state.clan.totalResourcesDonated >= 100 },
                { "clan_donate_1000", () => _state.clan.totalResourcesDonated >= 1000 },
                { "clan_donate_10000", () => _state.clan.totalResourcesDonated >= 10000 },
                { "clan_level_5", () => _state.clan.clanLevel >= 5 },
                { "clan_level_10", () => _state.clan.clanLevel >= 10 },
                { "clan_event_complete", () => _state.clan.activeEvent != null && _state.clan.activeEvent.isCompleted },
            };

            foreach (var kvp in achievements)
            {
                if (_state.clan.unlockedClanAchievements.Contains(kvp.Key)) continue;
                if (kvp.Value())
                {
                    _state.clan.unlockedClanAchievements.Add(kvp.Key);
                    GameEvents.RaiseAchievementUnlocked(kvp.Key);
                }
            }
        }

        // ============ EVENT LISTENERS ============

        private void OnResourceSpent(ResourceType type, double amount)
        {
            if (!_state.clan.isInClan) return;
            UpdateClanEvent(ClanEventType.CollectResources, amount);
            CheckClanAchievements();
        }

        private void OnCombatEnded(EnemyData enemy, bool victory)
        {
            if (!_state.clan.isInClan || !victory) return;
            UpdateClanEvent(ClanEventType.DefeatEnemies, 1);
            CheckClanAchievements();
        }

        private void OnStructureBuilt(string structureId, int level)
        {
            if (!_state.clan.isInClan) return;
            UpdateClanEvent(ClanEventType.BuildStructures, 1);
            CheckClanAchievements();
        }

        private void OnCardObtained(CardData card)
        {
            if (!_state.clan.isInClan) return;
            UpdateClanEvent(ClanEventType.CollectCards, 1);
            CheckClanAchievements();
        }
    }
}
