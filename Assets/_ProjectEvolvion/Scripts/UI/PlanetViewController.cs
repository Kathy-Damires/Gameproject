using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

namespace ProjectEvolvion
{
    public class PlanetViewController : MonoBehaviour
    {
        [Header("Planet Display")]
        public Text planetNameText;
        public Text eraNameText;
        public Image planetImage;
        public Transform structureContainer;

        [Header("Planet Selection")]
        public Button[] planetButtons;

        [Header("Structure Slots")]
        public GameObject structureSlotPrefab;

        private List<GameObject> _spawnedSlots = new List<GameObject>();

        private void Start()
        {
            GameEvents.OnEraAdvanced += OnEraAdvanced;
            GameEvents.OnStructureBuilt += OnStructureChanged;
            GameEvents.OnStructureUpgraded += OnStructureChanged;

            RefreshView();
        }

        private void OnDestroy()
        {
            GameEvents.OnEraAdvanced -= OnEraAdvanced;
            GameEvents.OnStructureBuilt -= OnStructureChanged;
            GameEvents.OnStructureUpgraded -= OnStructureChanged;
        }

        public void RefreshView()
        {
            var gm = GameManager.Instance;
            var planet = gm.PlayerState.GetActivePlanet();
            if (planet == null) return;

            var planetData = gm.database.GetPlanet(planet.planetId);
            if (planetNameText && planetData != null) planetNameText.text = planetData.planetName;

            var eraData = gm.planetSystem.GetCurrentEraData();
            if (eraNameText && eraData != null) eraNameText.text = eraData.eraName;

            RefreshStructureSlots();
        }

        private void RefreshStructureSlots()
        {
            // Clear existing slots
            foreach (var slot in _spawnedSlots)
                Destroy(slot);
            _spawnedSlots.Clear();

            if (structureSlotPrefab == null || structureContainer == null) return;

            var availableStructures = GameManager.Instance.structureSystem.GetAvailableStructures();
            var planet = GameManager.Instance.PlayerState.GetActivePlanet();

            foreach (var structData in availableStructures)
            {
                var slot = Instantiate(structureSlotPrefab, structureContainer);
                _spawnedSlots.Add(slot);

                var structState = planet.GetStructure(structData.structureId);
                bool isBuilt = structState != null && structState.isBuilt;

                // Setup slot UI
                var nameText = slot.GetComponentInChildren<Text>();
                if (nameText)
                {
                    string levelStr = isBuilt ? $" (Nv.{structState.level})" : " [Construir]";
                    nameText.text = structData.structureName + levelStr;
                }
            }
        }

        private void OnEraAdvanced(string planetId, EraType era) => RefreshView();
        private void OnStructureChanged(string structureId, int level) => RefreshView();
    }
}
