using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

namespace ProjectEvolvion
{
    public class ShopUI : MonoBehaviour
    {
        [Header("Tabs")]
        public Button shopTab;
        public Button vipTab;
        public Button battlePassTab;
        public Button chestsTab;

        [Header("Shop Tab")]
        public GameObject shopPanel;
        public Transform shopItemContainer;
        public GameObject shopItemPrefab;

        [Header("VIP Tab")]
        public GameObject vipPanel;
        public Text vipStatusText;
        public Text vipTimerText;
        public Button vipPurchaseButton;
        public Button vipDailyClaimButton;
        public Button vipWeeklyClaimButton;
        public Text vipBenefitsText;

        [Header("Battle Pass Tab")]
        public GameObject battlePassPanel;
        public Text battlePassLevelText;
        public Slider battlePassExpSlider;
        public Text battlePassExpText;
        public Transform battlePassRewardContainer;
        public GameObject battlePassRewardPrefab;
        public Button premiumPassButton;
        public Text premiumPassStatusText;

        [Header("Chests Tab")]
        public GameObject chestsPanel;
        public Transform chestContainer;
        public GameObject chestItemPrefab;

        [Header("Ad Reward")]
        public Button watchAdButton;
        public Text adsRemainingText;

        [Header("Boost Display")]
        public Text activeBoostText;

        [Header("Navigation")]
        public Button closeButton;

        private string _currentTab = "shop";
        private List<GameObject> _spawnedItems = new List<GameObject>();

        private void Start()
        {
            if (closeButton) closeButton.onClick.AddListener(Close);
            if (shopTab) shopTab.onClick.AddListener(() => SwitchTab("shop"));
            if (vipTab) vipTab.onClick.AddListener(() => SwitchTab("vip"));
            if (battlePassTab) battlePassTab.onClick.AddListener(() => SwitchTab("battlepass"));
            if (chestsTab) chestsTab.onClick.AddListener(() => SwitchTab("chests"));
            if (watchAdButton) watchAdButton.onClick.AddListener(OnWatchAd);
            if (vipPurchaseButton) vipPurchaseButton.onClick.AddListener(OnPurchaseVIP);
            if (vipDailyClaimButton) vipDailyClaimButton.onClick.AddListener(OnClaimVIPDaily);
            if (vipWeeklyClaimButton) vipWeeklyClaimButton.onClick.AddListener(OnClaimVIPWeekly);
            if (premiumPassButton) premiumPassButton.onClick.AddListener(OnPurchasePremiumPass);
        }

        private void OnEnable()
        {
            SwitchTab(_currentTab);
        }

        private void Update()
        {
            UpdateBoostDisplay();
            UpdateAdCounter();
        }

        private void SwitchTab(string tab)
        {
            _currentTab = tab;
            if (shopPanel) shopPanel.SetActive(tab == "shop");
            if (vipPanel) vipPanel.SetActive(tab == "vip");
            if (battlePassPanel) battlePassPanel.SetActive(tab == "battlepass");
            if (chestsPanel) chestsPanel.SetActive(tab == "chests");

            switch (tab)
            {
                case "shop": RefreshShop(); break;
                case "vip": RefreshVIP(); break;
                case "battlepass": RefreshBattlePass(); break;
                case "chests": RefreshChests(); break;
            }
        }

        // ============ SHOP TAB ============

        private void RefreshShop()
        {
            ClearSpawned();
            var shop = GameManager.Instance.shopSystem;

            // Featured items first
            var featured = shop.GetFeaturedItems();
            foreach (var item in featured)
                SpawnShopItem(item, shopItemContainer);

            // Then regular packs
            var packs = shop.GetItemsByType(ShopItemType.ResourcePack);
            foreach (var item in packs)
                SpawnShopItem(item, shopItemContainer);

            var diamonds = shop.GetItemsByType(ShopItemType.DiamondPack);
            foreach (var item in diamonds)
                SpawnShopItem(item, shopItemContainer);
        }

        private void SpawnShopItem(ShopData item, Transform container)
        {
            if (shopItemPrefab == null || container == null) return;

            var obj = Instantiate(shopItemPrefab, container);
            _spawnedItems.Add(obj);

            var nameText = obj.transform.Find("Name")?.GetComponent<Text>();
            if (nameText) nameText.text = item.itemName;

            var descText = obj.transform.Find("Description")?.GetComponent<Text>();
            if (descText) descText.text = item.description;

            var priceText = obj.transform.Find("Price")?.GetComponent<Text>();
            if (priceText)
            {
                string currency = item.currencyType switch
                {
                    ShopCurrencyType.Diamonds => "diamantes",
                    ShopCurrencyType.RealMoney => "USD",
                    ShopCurrencyType.Energy => "energia",
                    ShopCurrencyType.AdWatch => "Ver anuncio",
                    _ => ""
                };
                priceText.text = item.currencyType == ShopCurrencyType.AdWatch
                    ? "Gratis (Ad)"
                    : $"{item.price} {currency}";
            }

            var button = obj.GetComponentInChildren<Button>();
            if (button)
            {
                string id = item.itemId;
                button.onClick.AddListener(() => PurchaseItem(id));
            }
        }

        private void PurchaseItem(string itemId)
        {
            var shop = GameManager.Instance.shopSystem;
            var item = shop.GetShopItem(itemId);
            if (item == null) return;

            bool success = item.currencyType switch
            {
                ShopCurrencyType.Diamonds => shop.PurchaseWithDiamonds(itemId),
                ShopCurrencyType.Energy => shop.PurchaseWithEnergy(itemId),
                ShopCurrencyType.AdWatch => shop.WatchAdForReward(itemId),
                ShopCurrencyType.RealMoney => shop.ProcessIAP(itemId),
                _ => false
            };

            if (success)
                RefreshShop();
        }

        // ============ VIP TAB ============

        private void RefreshVIP()
        {
            var shopState = GameManager.Instance.PlayerState.shop;
            bool isActive = shopState.IsVIPActive();

            if (vipStatusText) vipStatusText.text = isActive ? "VIP ACTIVO" : "VIP INACTIVO";

            if (vipTimerText)
            {
                if (isActive)
                {
                    long remaining = shopState.vipExpirationTimestamp - System.DateTimeOffset.UtcNow.ToUnixTimeSeconds();
                    int days = (int)(remaining / 86400);
                    vipTimerText.text = $"Expira en: {days} dias";
                }
                else
                {
                    vipTimerText.text = "";
                }
            }

            if (vipPurchaseButton) vipPurchaseButton.gameObject.SetActive(!isActive);
            if (vipDailyClaimButton) vipDailyClaimButton.interactable = shopState.CanClaimVIPDaily();
            if (vipWeeklyClaimButton) vipWeeklyClaimButton.interactable = shopState.CanClaimVIPWeekly();

            if (vipBenefitsText) vipBenefitsText.text =
                "Beneficios VIP:\n" +
                "- +20% produccion global\n" +
                "- 5 diamantes diarios\n" +
                "- 20 energia diaria\n" +
                "- Recursos diarios segun era\n" +
                "- 25 diamantes semanales\n" +
                "- 100 energia semanal\n" +
                "- +20 EXP pase de batalla diario";
        }

        private void OnPurchaseVIP()
        {
            GameManager.Instance.shopSystem.ProcessIAP("vip_monthly");
            RefreshVIP();
        }

        private void OnClaimVIPDaily()
        {
            GameManager.Instance.shopSystem.ClaimVIPDailyReward();
            RefreshVIP();
        }

        private void OnClaimVIPWeekly()
        {
            GameManager.Instance.shopSystem.ClaimVIPWeeklyReward();
            RefreshVIP();
        }

        // ============ BATTLE PASS TAB ============

        private void RefreshBattlePass()
        {
            var shopState = GameManager.Instance.PlayerState.shop;

            if (battlePassLevelText) battlePassLevelText.text = $"Nivel {shopState.battlePassLevel}";
            if (battlePassExpSlider) battlePassExpSlider.value = (float)shopState.battlePassExp / shopState.battlePassExpPerLevel;
            if (battlePassExpText) battlePassExpText.text = $"{shopState.battlePassExp}/{shopState.battlePassExpPerLevel} EXP";

            if (premiumPassStatusText)
                premiumPassStatusText.text = shopState.hasPremiumBattlePass ? "PREMIUM ACTIVO" : "Comprar Premium";
            if (premiumPassButton) premiumPassButton.interactable = !shopState.hasPremiumBattlePass;

            // Spawn reward items
            ClearSpawned();
            var rewards = GameManager.Instance.shopSystem.battlePassRewards;
            if (rewards == null || battlePassRewardPrefab == null || battlePassRewardContainer == null) return;

            foreach (var reward in rewards)
            {
                var obj = Instantiate(battlePassRewardPrefab, battlePassRewardContainer);
                _spawnedItems.Add(obj);

                var text = obj.GetComponentInChildren<Text>();
                if (text) text.text = $"Nv.{reward.level} {(reward.isPremium ? "[Premium]" : "[Gratis]")}\n{reward.description}";

                bool canClaim = reward.level <= shopState.battlePassLevel;
                bool claimed = reward.isPremium
                    ? shopState.claimedPremiumRewards.Contains(reward.level)
                    : shopState.claimedFreeRewards.Contains(reward.level);
                bool locked = reward.isPremium && !shopState.hasPremiumBattlePass;

                var button = obj.GetComponentInChildren<Button>();
                if (button)
                {
                    button.interactable = canClaim && !claimed && !locked;
                    int lvl = reward.level;
                    bool prem = reward.isPremium;
                    button.onClick.AddListener(() =>
                    {
                        GameManager.Instance.shopSystem.ClaimBattlePassReward(lvl, prem);
                        RefreshBattlePass();
                    });
                }
            }
        }

        private void OnPurchasePremiumPass()
        {
            GameManager.Instance.shopSystem.ProcessIAP("battle_pass_premium");
            RefreshBattlePass();
        }

        // ============ CHESTS TAB ============

        private void RefreshChests()
        {
            ClearSpawned();
            var chests = GameManager.Instance.shopSystem.GetItemsByType(ShopItemType.Chest);
            foreach (var chest in chests)
                SpawnShopItem(chest, chestContainer);
        }

        // ============ ADS ============

        private void OnWatchAd()
        {
            var shop = GameManager.Instance.shopSystem;
            var adItems = shop.GetItemsByType(ShopItemType.AdReward);
            if (adItems.Length > 0)
                shop.WatchAdForReward(adItems[0].itemId);
            UpdateAdCounter();
        }

        private void UpdateAdCounter()
        {
            int remaining = GameManager.Instance.shopSystem.GetRemainingAdsToday();
            if (adsRemainingText) adsRemainingText.text = $"Anuncios hoy: {remaining} restantes";
            if (watchAdButton) watchAdButton.interactable = remaining > 0;
        }

        // ============ BOOSTS ============

        private void UpdateBoostDisplay()
        {
            float mult = GameManager.Instance.shopSystem.GetCurrentBoostMultiplier();
            if (activeBoostText)
                activeBoostText.text = mult > 1f ? $"Boost activo: {mult:F1}x" : "";
        }

        private void Close()
        {
            FindObjectOfType<UIManager>().ShowOnlyPanel(PanelType.Planet);
        }

        private void ClearSpawned()
        {
            foreach (var obj in _spawnedItems)
                Destroy(obj);
            _spawnedItems.Clear();
        }
    }
}
