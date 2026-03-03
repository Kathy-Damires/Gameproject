using UnityEngine;
using UnityEngine.UI;

namespace ProjectEvolvion
{
    public class PrestigeUI : MonoBehaviour
    {
        [Header("Status")]
        public Text prestigeLevelText;
        public Text multiplierText;
        public Text productionText;
        public Text currentResourcesText;
        public Text accumulatedResourcesText;

        [Header("Prestige Reset")]
        public Button prestigeResetButton;
        public Text prestigeGainPreviewText;

        [Header("Upgrades")]
        public Transform upgradeContainer;
        public GameObject upgradeItemPrefab;

        [Header("Controls")]
        public Button startStopButton;
        public Text startStopButtonText;
        public Button closeButton;

        private PrestigeSystem _prestigeSystem;

        private void Start()
        {
            _prestigeSystem = GameManager.Instance.prestigeSystem;
            _prestigeSystem.InitializeDefaultUpgrades();

            if (closeButton) closeButton.onClick.AddListener(() => FindObjectOfType<UIManager>().ShowOnlyPanel(PanelType.Planet));
            if (startStopButton) startStopButton.onClick.AddListener(OnStartStopClicked);
            if (prestigeResetButton) prestigeResetButton.onClick.AddListener(OnPrestigeResetClicked);

            GameEvents.OnPrestigeReset += OnPrestigeReset;
        }

        private void OnDestroy()
        {
            GameEvents.OnPrestigeReset -= OnPrestigeReset;
        }

        private void OnEnable()
        {
            RefreshUpgrades();
            UpdateDisplay();
        }

        private void Update()
        {
            if (gameObject.activeInHierarchy)
                UpdateDisplay();
        }

        private void UpdateDisplay()
        {
            var state = _prestigeSystem.State;

            if (prestigeLevelText) prestigeLevelText.text = $"Nivel de Prestigio: {state.prestigeLevel}";
            if (multiplierText) multiplierText.text = $"Multiplicador: {state.prestigeMultiplier:F1}x";
            if (productionText) productionText.text = $"Produccion: {_prestigeSystem.GetCurrentProduction():F1}/s";
            if (currentResourcesText) currentResourcesText.text = $"Recursos actuales: {state.currentRunResources:F0}";
            if (accumulatedResourcesText) accumulatedResourcesText.text = $"Acumulados: {state.accumulatedResources:F0}";

            // Prestige preview
            double gain = _prestigeSystem.GetPrestigeGainPreview();
            if (prestigeGainPreviewText) prestigeGainPreviewText.text = $"Prestigio al reiniciar: +{gain:F0}";
            if (prestigeResetButton) prestigeResetButton.interactable = _prestigeSystem.CanPrestigeReset();

            // Start/Stop button
            if (startStopButtonText)
                startStopButtonText.text = _prestigeSystem.IsActive ? "Detener" : "Iniciar";
        }

        private void OnStartStopClicked()
        {
            if (_prestigeSystem.IsActive)
                _prestigeSystem.StopPrestigeMode();
            else
                _prestigeSystem.StartPrestigeMode();
        }

        private void OnPrestigeResetClicked()
        {
            _prestigeSystem.PerformPrestigeReset();
        }

        private void OnPrestigeReset(int level, double multiplier)
        {
            RefreshUpgrades();
        }

        private void RefreshUpgrades()
        {
            if (upgradeContainer == null || upgradeItemPrefab == null) return;

            // Clear existing
            foreach (Transform child in upgradeContainer)
                Destroy(child.gameObject);

            foreach (var upgrade in _prestigeSystem.State.upgrades)
            {
                var item = Instantiate(upgradeItemPrefab, upgradeContainer);
                var text = item.GetComponentInChildren<Text>();
                if (text)
                {
                    string status = upgrade.isPurchased ? "[Comprado]" : $"Costo: {upgrade.cost:F0}";
                    text.text = $"{upgrade.upgradeName} ({upgrade.multiplier:F1}x) - {status}";
                }

                var button = item.GetComponent<Button>();
                if (button)
                {
                    var upg = upgrade;
                    button.interactable = !upgrade.isPurchased;
                    button.onClick.AddListener(() =>
                    {
                        _prestigeSystem.PurchaseUpgrade(upg.upgradeId);
                        RefreshUpgrades();
                    });
                }
            }
        }
    }
}
