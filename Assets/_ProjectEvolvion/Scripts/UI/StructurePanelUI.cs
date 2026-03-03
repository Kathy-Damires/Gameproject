using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

namespace ProjectEvolvion
{
    public class StructurePanelUI : MonoBehaviour
    {
        [Header("References")]
        public Transform structureListContainer;
        public GameObject structureItemPrefab;
        public Button closeButton;

        [Header("Detail Panel")]
        public GameObject detailPanel;
        public Text detailNameText;
        public Text detailLevelText;
        public Text detailProductionText;
        public Text detailCostText;
        public Button buildUpgradeButton;
        public Text buildUpgradeButtonText;

        private List<GameObject> _spawnedItems = new List<GameObject>();
        private string _selectedStructureId;

        private void OnEnable()
        {
            RefreshStructureList();
            if (detailPanel) detailPanel.SetActive(false);
        }

        private void Start()
        {
            if (closeButton)
                closeButton.onClick.AddListener(() => FindObjectOfType<UIManager>().ShowOnlyPanel(PanelType.Planet));

            if (buildUpgradeButton)
                buildUpgradeButton.onClick.AddListener(OnBuildUpgradeClicked);

            GameEvents.OnStructureBuilt += OnStructureChanged;
            GameEvents.OnStructureUpgraded += OnStructureChanged;
        }

        private void OnDestroy()
        {
            GameEvents.OnStructureBuilt -= OnStructureChanged;
            GameEvents.OnStructureUpgraded -= OnStructureChanged;
        }

        private void RefreshStructureList()
        {
            foreach (var item in _spawnedItems)
                Destroy(item);
            _spawnedItems.Clear();

            if (structureItemPrefab == null || structureListContainer == null) return;

            var structures = GameManager.Instance.structureSystem.GetAvailableStructures();
            var planet = GameManager.Instance.PlayerState.GetActivePlanet();

            foreach (var structData in structures)
            {
                var item = Instantiate(structureItemPrefab, structureListContainer);
                _spawnedItems.Add(item);

                var structState = planet.GetStructure(structData.structureId);
                bool isBuilt = structState != null && structState.isBuilt;

                var nameText = item.GetComponentInChildren<Text>();
                if (nameText)
                {
                    string info = isBuilt ? $"Nv.{structState.level}" : "Sin construir";
                    nameText.text = $"{structData.structureName} - {info}";
                }

                var button = item.GetComponent<Button>();
                if (button)
                {
                    string id = structData.structureId;
                    button.onClick.AddListener(() => SelectStructure(id));
                }
            }
        }

        private void SelectStructure(string structureId)
        {
            _selectedStructureId = structureId;
            if (detailPanel) detailPanel.SetActive(true);
            RefreshDetail();
        }

        private void RefreshDetail()
        {
            var gm = GameManager.Instance;
            var data = gm.database.GetStructure(_selectedStructureId);
            if (data == null) return;

            var planet = gm.PlayerState.GetActivePlanet();
            var state = planet?.GetStructure(_selectedStructureId);
            bool isBuilt = state != null && state.isBuilt;

            if (detailNameText) detailNameText.text = data.structureName;

            if (isBuilt)
            {
                if (detailLevelText) detailLevelText.text = $"Nivel: {state.level}/{data.maxLevel}";

                double production = gm.structureSystem.CalculateProduction(data, state);
                if (detailProductionText)
                    detailProductionText.text = $"+{production:F1} {data.producedResource}/s";

                double nextCost = data.buildCost[0].amount * System.Math.Pow(data.upgradeCostMultiplier, state.level);
                if (detailCostText)
                    detailCostText.text = $"Mejorar: {nextCost:F0} {data.buildCost[0].resourceType}";

                if (buildUpgradeButtonText) buildUpgradeButtonText.text = "Mejorar";
                if (buildUpgradeButton) buildUpgradeButton.interactable = state.level < data.maxLevel &&
                    gm.resourceSystem.CanAffordScaled(data.buildCost, data.upgradeCostMultiplier, state.level);
            }
            else
            {
                if (detailLevelText) detailLevelText.text = "Sin construir";
                if (detailProductionText) detailProductionText.text = $"+{data.baseProductionPerSecond:F1} {data.producedResource}/s";

                string costStr = "";
                foreach (var cost in data.buildCost)
                    costStr += $"{cost.amount:F0} {cost.resourceType} ";
                if (detailCostText) detailCostText.text = $"Costo: {costStr}";

                if (buildUpgradeButtonText) buildUpgradeButtonText.text = "Construir";
                if (buildUpgradeButton) buildUpgradeButton.interactable = gm.resourceSystem.CanAfford(data.buildCost);
            }
        }

        private void OnBuildUpgradeClicked()
        {
            var gm = GameManager.Instance;
            var planet = gm.PlayerState.GetActivePlanet();
            var state = planet?.GetStructure(_selectedStructureId);
            bool isBuilt = state != null && state.isBuilt;

            if (isBuilt)
                gm.structureSystem.UpgradeStructure(_selectedStructureId);
            else
                gm.structureSystem.BuildStructure(_selectedStructureId);

            RefreshDetail();
        }

        private void OnStructureChanged(string structureId, int level)
        {
            RefreshStructureList();
            if (structureId == _selectedStructureId)
                RefreshDetail();
        }
    }
}
