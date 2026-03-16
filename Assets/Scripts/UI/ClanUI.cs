using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

namespace ProjectEvolvion
{
    public class ClanUI : MonoBehaviour
    {
        [Header("No Clan View")]
        public GameObject noClanPanel;
        public InputField clanNameInput;
        public Button createClanButton;
        public Button joinClanButton;

        [Header("Clan View")]
        public GameObject clanPanel;
        public Text clanNameText;
        public Text clanLevelText;
        public Text clanMembersText;
        public Slider clanExpSlider;

        [Header("Donations")]
        public Text donationsRemainingText;
        public Button donateEnergyButton;
        public Button donateStoneButton;
        public Button donateFoodButton;
        public Text totalDonatedText;

        [Header("Clan Event")]
        public GameObject eventPanel;
        public Text eventNameText;
        public Text eventProgressText;
        public Slider eventProgressSlider;
        public Text eventTimerText;
        public Button claimEventRewardButton;
        public Button startEventButton;

        [Header("Members")]
        public Transform memberListContainer;
        public GameObject memberItemPrefab;

        [Header("Ranking")]
        public Text globalRankText;
        public Text globalScoreText;

        [Header("Navigation")]
        public Button closeButton;
        public Button leaveClanButton;

        private ClanSystem _clanSystem;
        private List<GameObject> _spawnedItems = new List<GameObject>();

        private void Start()
        {
            _clanSystem = GameManager.Instance.clanSystem;

            if (closeButton) closeButton.onClick.AddListener(() => FindObjectOfType<UIManager>().ShowOnlyPanel(PanelType.Planet));
            if (createClanButton) createClanButton.onClick.AddListener(OnCreateClan);
            if (joinClanButton) joinClanButton.onClick.AddListener(OnJoinClan);
            if (leaveClanButton) leaveClanButton.onClick.AddListener(OnLeaveClan);

            if (donateEnergyButton) donateEnergyButton.onClick.AddListener(() => Donate(ResourceType.Energy, 10));
            if (donateStoneButton) donateStoneButton.onClick.AddListener(() => Donate(ResourceType.Stone, 50));
            if (donateFoodButton) donateFoodButton.onClick.AddListener(() => Donate(ResourceType.Food, 50));

            if (claimEventRewardButton) claimEventRewardButton.onClick.AddListener(OnClaimEventReward);
            if (startEventButton) startEventButton.onClick.AddListener(OnStartEvent);
        }

        private void OnEnable()
        {
            RefreshAll();
        }

        private void Update()
        {
            if (gameObject.activeInHierarchy && _clanSystem.IsInClan)
                UpdateEventTimer();
        }

        private void RefreshAll()
        {
            bool inClan = _clanSystem.IsInClan;
            if (noClanPanel) noClanPanel.SetActive(!inClan);
            if (clanPanel) clanPanel.SetActive(inClan);

            if (inClan)
            {
                RefreshClanInfo();
                RefreshDonations();
                RefreshEvent();
                RefreshMembers();
                RefreshRanking();
            }
        }

        private void RefreshClanInfo()
        {
            var clan = _clanSystem.ClanState;
            if (clanNameText) clanNameText.text = clan.clanName;
            if (clanLevelText) clanLevelText.text = $"Nivel {clan.clanLevel}";
            if (clanMembersText) clanMembersText.text = $"{clan.totalMembersCount}/{clan.maxMembers} miembros";
            if (clanExpSlider) clanExpSlider.value = (float)(clan.clanExp / clan.clanExpToNext);
        }

        private void RefreshDonations()
        {
            int remaining = _clanSystem.GetRemainingDonationsToday();
            if (donationsRemainingText)
                donationsRemainingText.text = $"Donaciones hoy: {remaining} restantes";

            bool canDonate = remaining > 0;
            if (donateEnergyButton) donateEnergyButton.interactable = canDonate &&
                GameManager.Instance.PlayerState.GetResource(ResourceType.Energy) >= 10;
            if (donateStoneButton) donateStoneButton.interactable = canDonate &&
                GameManager.Instance.PlayerState.GetResource(ResourceType.Stone) >= 50;
            if (donateFoodButton) donateFoodButton.interactable = canDonate &&
                GameManager.Instance.PlayerState.GetResource(ResourceType.Food) >= 50;

            if (totalDonatedText)
                totalDonatedText.text = $"Total donado: {_clanSystem.ClanState.totalResourcesDonated:F0}";
        }

        private void RefreshEvent()
        {
            var evt = _clanSystem.GetActiveEvent();
            bool hasEvent = evt != null && !evt.IsExpired();

            if (eventPanel) eventPanel.SetActive(hasEvent);
            if (startEventButton) startEventButton.gameObject.SetActive(!hasEvent);

            if (!hasEvent) return;

            if (eventNameText) eventNameText.text = evt.eventName;
            if (eventProgressSlider) eventProgressSlider.value = evt.GetProgressPercent();
            if (eventProgressText) eventProgressText.text = $"{evt.currentProgress:F0}/{evt.targetAmount:F0}";
            if (claimEventRewardButton) claimEventRewardButton.interactable = evt.isCompleted && !evt.rewardsClaimed;
        }

        private void UpdateEventTimer()
        {
            var evt = _clanSystem.GetActiveEvent();
            if (evt == null || eventTimerText == null) return;

            long remaining = evt.endTimestamp - System.DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            if (remaining <= 0)
            {
                eventTimerText.text = "Tiempo agotado";
                return;
            }

            int hours = (int)(remaining / 3600);
            int minutes = (int)((remaining % 3600) / 60);
            eventTimerText.text = $"Tiempo restante: {hours}h {minutes}m";
        }

        private void RefreshMembers()
        {
            foreach (var item in _spawnedItems) Destroy(item);
            _spawnedItems.Clear();

            if (memberItemPrefab == null || memberListContainer == null) return;

            var ranking = _clanSystem.GetMemberRanking();
            int rank = 1;
            foreach (var member in ranking)
            {
                var obj = Instantiate(memberItemPrefab, memberListContainer);
                _spawnedItems.Add(obj);

                var text = obj.GetComponentInChildren<Text>();
                if (text)
                {
                    string rankIcon = rank switch { 1 => "🥇", 2 => "🥈", 3 => "🥉", _ => $"#{rank}" };
                    string roleStr = member.rank switch
                    {
                        ClanRank.Leader => " [Lider]",
                        ClanRank.CoLeader => " [Co-Lider]",
                        ClanRank.Elder => " [Anciano]",
                        _ => ""
                    };
                    text.text = $"{rankIcon} {member.playerName}{roleStr} - Nv.{member.level} - Donado: {member.totalDonated:F0}";
                }
                rank++;
            }
        }

        private void RefreshRanking()
        {
            _clanSystem.UpdateGlobalScore();
            var clan = _clanSystem.ClanState;
            if (globalRankText) globalRankText.text = clan.globalRank > 0 ? $"Ranking Global: #{clan.globalRank}" : "Sin ranking";
            if (globalScoreText) globalScoreText.text = $"Puntuacion: {clan.globalScore:F0}";
        }

        private void OnCreateClan()
        {
            string name = clanNameInput != null ? clanNameInput.text : "Mi Clan";
            if (string.IsNullOrEmpty(name)) name = "Clan Evolvion";
            _clanSystem.CreateClan(name);
            RefreshAll();
        }

        private void OnJoinClan()
        {
            _clanSystem.JoinClan("simulated_clan_001");
            RefreshAll();
        }

        private void OnLeaveClan()
        {
            _clanSystem.LeaveClan();
            RefreshAll();
        }

        private void Donate(ResourceType type, double amount)
        {
            bool success = type == ResourceType.Energy
                ? _clanSystem.DonateEnergy(amount)
                : _clanSystem.DonateResource(type, amount);

            if (success)
                RefreshAll();
        }

        private void OnClaimEventReward()
        {
            _clanSystem.ClaimClanEventRewards();
            RefreshEvent();
        }

        private void OnStartEvent()
        {
            var events = _clanSystem.availableClanEvents;
            if (events != null && events.Length > 0)
            {
                var randomEvent = events[Random.Range(0, events.Length)];
                _clanSystem.StartClanEvent(randomEvent.eventId);
                RefreshEvent();
            }
        }
    }
}
