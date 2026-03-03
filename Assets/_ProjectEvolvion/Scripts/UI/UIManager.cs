using UnityEngine;
using System.Collections.Generic;

namespace ProjectEvolvion
{
    public class UIManager : MonoBehaviour
    {
        [Header("Panels")]
        public GameObject hudPanel;
        public GameObject planetPanel;
        public GameObject structurePanel;
        public GameObject combatPanel;
        public GameObject equipmentPanel;
        public GameObject cardAlbumPanel;
        public GameObject prestigePanel;
        public GameObject popupPanel;

        private Stack<PanelType> _panelStack = new Stack<PanelType>();
        private Dictionary<PanelType, GameObject> _panelMap;

        private void Start()
        {
            _panelMap = new Dictionary<PanelType, GameObject>
            {
                { PanelType.HUD, hudPanel },
                { PanelType.Planet, planetPanel },
                { PanelType.Structures, structurePanel },
                { PanelType.Combat, combatPanel },
                { PanelType.Equipment, equipmentPanel },
                { PanelType.CardAlbum, cardAlbumPanel },
                { PanelType.Prestige, prestigePanel },
                { PanelType.Popup, popupPanel }
            };

            HideAllPanels();
            ShowPanel(PanelType.HUD);
            ShowPanel(PanelType.Planet);
        }

        public void ShowPanel(PanelType type)
        {
            if (_panelMap.TryGetValue(type, out var panel) && panel != null)
            {
                panel.SetActive(true);
                _panelStack.Push(type);
            }
        }

        public void HidePanel(PanelType type)
        {
            if (_panelMap.TryGetValue(type, out var panel) && panel != null)
                panel.SetActive(false);
        }

        public void TogglePanel(PanelType type)
        {
            if (_panelMap.TryGetValue(type, out var panel) && panel != null)
            {
                if (panel.activeSelf)
                    HidePanel(type);
                else
                    ShowPanel(type);
            }
        }

        public void GoBack()
        {
            if (_panelStack.Count > 1)
            {
                var current = _panelStack.Pop();
                HidePanel(current);
            }
        }

        public void ShowOnlyPanel(PanelType type)
        {
            HideAllPanels();
            ShowPanel(PanelType.HUD); // HUD always visible
            ShowPanel(type);
        }

        private void HideAllPanels()
        {
            foreach (var kvp in _panelMap)
            {
                if (kvp.Value != null)
                    kvp.Value.SetActive(false);
            }
            _panelStack.Clear();
        }
    }
}
