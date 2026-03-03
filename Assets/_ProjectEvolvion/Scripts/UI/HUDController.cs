using UnityEngine;
using UnityEngine.UI;

namespace ProjectEvolvion
{
    public class HUDController : MonoBehaviour
    {
        [Header("Resource Texts")]
        public Text stoneText;
        public Text woodText;
        public Text foodText;
        public Text bronzeText;
        public Text energyText;
        public Text diamondText;

        [Header("Info")]
        public Text eraText;
        public Text planetNameText;
        public Text arisLevelText;
        public Slider eraProgressSlider;

        [Header("Buttons")]
        public Button structuresButton;
        public Button combatButton;
        public Button equipmentButton;
        public Button cardsButton;
        public Button prestigeButton;
        public Button advanceEraButton;

        private UIManager _uiManager;

        private void Start()
        {
            _uiManager = FindObjectOfType<UIManager>();

            // Button listeners
            if (structuresButton) structuresButton.onClick.AddListener(() => _uiManager.ShowOnlyPanel(PanelType.Structures));
            if (combatButton) combatButton.onClick.AddListener(() => _uiManager.ShowOnlyPanel(PanelType.Combat));
            if (equipmentButton) equipmentButton.onClick.AddListener(() => _uiManager.ShowOnlyPanel(PanelType.Equipment));
            if (cardsButton) cardsButton.onClick.AddListener(() => _uiManager.ShowOnlyPanel(PanelType.CardAlbum));
            if (prestigeButton) prestigeButton.onClick.AddListener(() => _uiManager.ShowOnlyPanel(PanelType.Prestige));
            if (advanceEraButton) advanceEraButton.onClick.AddListener(OnAdvanceEraClicked);

            // Subscribe to events
            GameEvents.OnResourceChanged += OnResourceChanged;
            GameEvents.OnEraAdvanced += OnEraAdvanced;
        }

        private void OnDestroy()
        {
            GameEvents.OnResourceChanged -= OnResourceChanged;
            GameEvents.OnEraAdvanced -= OnEraAdvanced;
        }

        private void Update()
        {
            UpdateResourceDisplay();
            UpdateEraInfo();
        }

        private void UpdateResourceDisplay()
        {
            var state = GameManager.Instance.PlayerState;
            if (stoneText) stoneText.text = FormatNumber(state.GetResource(ResourceType.Stone));
            if (woodText) woodText.text = FormatNumber(state.GetResource(ResourceType.Wood));
            if (foodText) foodText.text = FormatNumber(state.GetResource(ResourceType.Food));
            if (bronzeText) bronzeText.text = FormatNumber(state.GetResource(ResourceType.Bronze));
            if (energyText) energyText.text = FormatNumber(state.GetResource(ResourceType.Energy));
            if (diamondText) diamondText.text = FormatNumber(state.GetResource(ResourceType.Diamonds));
        }

        private void UpdateEraInfo()
        {
            var planetSystem = GameManager.Instance.planetSystem;
            if (eraText) eraText.text = GetEraDisplayName(planetSystem.GetCurrentEra());
            if (eraProgressSlider) eraProgressSlider.value = planetSystem.GetEraProgressPercent();
            if (arisLevelText) arisLevelText.text = $"Aris Nv.{GameManager.Instance.PlayerState.aris.level}";

            if (advanceEraButton) advanceEraButton.interactable = planetSystem.CanAdvanceEra();
        }

        private void OnResourceChanged(ResourceType type, double amount) { /* Updated in Update() */ }

        private void OnEraAdvanced(string planetId, EraType era)
        {
            if (eraText) eraText.text = GetEraDisplayName(era);
        }

        private void OnAdvanceEraClicked()
        {
            GameManager.Instance.planetSystem.AdvanceEra();
        }

        private string GetEraDisplayName(EraType era)
        {
            return era switch
            {
                EraType.StoneAge => "Edad de Piedra",
                EraType.TribalAge => "Edad Tribal",
                EraType.BronzeAge => "Edad del Bronce",
                EraType.ClassicalAge => "Edad Clasica",
                EraType.MiddleAge => "Edad Media",
                EraType.IndustrialAge => "Edad Industrial",
                EraType.RobotAge => "Edad Robot",
                EraType.SpaceAge => "Edad Espacial",
                EraType.SingularityAge => "Edad de la Singularidad",
                _ => era.ToString()
            };
        }

        private string FormatNumber(double value)
        {
            if (value >= 1_000_000_000) return $"{value / 1_000_000_000:F1}B";
            if (value >= 1_000_000) return $"{value / 1_000_000:F1}M";
            if (value >= 1_000) return $"{value / 1_000:F1}K";
            return $"{value:F0}";
        }
    }
}
