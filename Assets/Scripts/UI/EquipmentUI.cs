using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

namespace ProjectEvolvion
{
    public class EquipmentUI : MonoBehaviour
    {
        [Header("Equipped Slots")]
        public Text helmetText;
        public Text weaponText;
        public Text armorText;
        public Text gadgetText;

        [Header("Inventory")]
        public Transform inventoryContainer;
        public GameObject inventoryItemPrefab;

        [Header("Fusion")]
        public Button fuseButton;
        public Text fuseInfoText;

        [Header("Detail")]
        public GameObject detailPanel;
        public Text detailNameText;
        public Text detailStatsText;
        public Text detailRarityText;
        public Button equipButton;
        public Button recycleButton;

        [Header("Navigation")]
        public Button closeButton;

        private List<GameObject> _spawnedItems = new List<GameObject>();
        private string _selectedInstanceId;
        private List<string> _selectedForFusion = new List<string>();

        private void Start()
        {
            if (closeButton) closeButton.onClick.AddListener(() => FindObjectOfType<UIManager>().ShowOnlyPanel(PanelType.Planet));
            if (equipButton) equipButton.onClick.AddListener(OnEquipClicked);
            if (recycleButton) recycleButton.onClick.AddListener(OnRecycleClicked);
            if (fuseButton) fuseButton.onClick.AddListener(OnFuseClicked);

            GameEvents.OnEquipmentObtained += (eq) => RefreshAll();
            GameEvents.OnEquipmentEquipped += (slot, eq) => RefreshAll();
            GameEvents.OnEquipmentFused += (eq) => RefreshAll();
        }

        private void OnEnable()
        {
            RefreshAll();
            if (detailPanel) detailPanel.SetActive(false);
        }

        private void RefreshAll()
        {
            RefreshEquippedSlots();
            RefreshInventory();
        }

        private void RefreshEquippedSlots()
        {
            if (GameManager.Instance == null || GameManager.Instance.equipmentSystem == null) return;
            var equipSystem = GameManager.Instance.equipmentSystem;
            UpdateSlotText(helmetText, equipSystem.GetEquippedData(EquipmentSlot.Helmet), "Casco");
            UpdateSlotText(weaponText, equipSystem.GetEquippedData(EquipmentSlot.Weapon), "Arma");
            UpdateSlotText(armorText, equipSystem.GetEquippedData(EquipmentSlot.Armor), "Armadura");
            UpdateSlotText(gadgetText, equipSystem.GetEquippedData(EquipmentSlot.Gadget), "Gadget");
        }

        private void UpdateSlotText(Text text, EquipmentData data, string slotName)
        {
            if (text == null) return;
            text.text = data != null ? $"{slotName}: {data.equipmentName} [{data.rarity}]" : $"{slotName}: Vacio";
        }

        private void RefreshInventory()
        {
            foreach (var item in _spawnedItems)
                Destroy(item);
            _spawnedItems.Clear();

            if (inventoryItemPrefab == null || inventoryContainer == null) return;

            var inventory = GameManager.Instance.equipmentSystem.GetInventory();
            foreach (var instance in inventory)
            {
                var data = GameManager.Instance.database.GetEquipment(instance.equipmentDataId);
                if (data == null) continue;

                var item = Instantiate(inventoryItemPrefab, inventoryContainer);
                _spawnedItems.Add(item);

                var nameText = item.GetComponentInChildren<Text>();
                if (nameText) nameText.text = $"{data.equipmentName} [{data.rarity}]";

                var button = item.GetComponent<Button>();
                if (button)
                {
                    string id = instance.instanceId;
                    button.onClick.AddListener(() => SelectItem(id));
                }
            }
        }

        private void SelectItem(string instanceId)
        {
            _selectedInstanceId = instanceId;
            if (detailPanel) detailPanel.SetActive(true);

            var instance = GameManager.Instance.equipmentSystem.GetInventory()
                .Find(e => e.instanceId == instanceId);
            if (instance == null) return;

            var data = GameManager.Instance.database.GetEquipment(instance.equipmentDataId);
            if (data == null) return;

            if (detailNameText) detailNameText.text = data.equipmentName;
            if (detailRarityText) detailRarityText.text = $"Rareza: {GetRarityName(data.rarity)}";
            if (detailStatsText) detailStatsText.text = $"ATK: +{data.attackBonus}  DEF: +{data.defenseBonus}  HP: +{data.hpBonus}";

            // Check if can fuse
            var candidates = GameManager.Instance.equipmentSystem.GetFusionCandidates(data.equipmentId);
            bool canFuse = candidates.Count >= 3 && data.nextRarityEquipment != null;
            if (fuseButton) fuseButton.interactable = canFuse;
            if (fuseInfoText) fuseInfoText.text = canFuse
                ? $"Fusionar 3x → {data.nextRarityEquipment.equipmentName}"
                : $"Tienes {candidates.Count}/3 para fusion";
        }

        private void OnEquipClicked()
        {
            if (string.IsNullOrEmpty(_selectedInstanceId)) return;
            GameManager.Instance.equipmentSystem.Equip(_selectedInstanceId);
        }

        private void OnRecycleClicked()
        {
            if (string.IsNullOrEmpty(_selectedInstanceId)) return;
            GameManager.Instance.equipmentSystem.RecycleEquipment(_selectedInstanceId);
            if (detailPanel) detailPanel.SetActive(false);
            _selectedInstanceId = null;
        }

        private void OnFuseClicked()
        {
            if (string.IsNullOrEmpty(_selectedInstanceId)) return;

            var instance = GameManager.Instance.equipmentSystem.GetInventory()
                .Find(e => e.instanceId == _selectedInstanceId);
            if (instance == null) return;

            var candidates = GameManager.Instance.equipmentSystem.GetFusionCandidates(instance.equipmentDataId);
            if (candidates.Count < 3) return;

            var toFuse = new List<string> { candidates[0].instanceId, candidates[1].instanceId, candidates[2].instanceId };
            GameManager.Instance.equipmentSystem.FuseEquipment(toFuse);
            if (detailPanel) detailPanel.SetActive(false);
            _selectedInstanceId = null;
        }

        private string GetRarityName(Rarity rarity) => rarity switch
        {
            Rarity.Common => "Comun",
            Rarity.Clear => "Claro",
            Rarity.Epic => "Epico",
            Rarity.Legendary => "Legendario",
            _ => rarity.ToString()
        };
    }
}
