using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using System.Collections.Generic;

namespace ProjectEvolvion
{
    public class PopupController : MonoBehaviour
    {
        [Header("Popup Panel")]
        public GameObject popupPanel;
        public Text popupTitleText;
        public Text popupMessageText;
        public Image popupIcon;
        public Button popupCloseButton;

        [Header("Settings")]
        public float autoHideDelay = 3f;
        public bool autoHide = true;

        private Queue<PopupData> _popupQueue = new Queue<PopupData>();
        private bool _isShowingPopup = false;

        private void Start()
        {
            if (popupPanel) popupPanel.SetActive(false);
            if (popupCloseButton) popupCloseButton.onClick.AddListener(HidePopup);

            // Subscribe to events that trigger popups
            GameEvents.OnAchievementUnlocked += OnAchievementUnlocked;
            GameEvents.OnCardObtained += OnCardObtained;
            GameEvents.OnEraAdvanced += OnEraAdvanced;
            GameEvents.OnEquipmentFused += OnEquipmentFused;
            GameEvents.OnCardSetCompleted += OnCardSetCompleted;
        }

        private void OnDestroy()
        {
            GameEvents.OnAchievementUnlocked -= OnAchievementUnlocked;
            GameEvents.OnCardObtained -= OnCardObtained;
            GameEvents.OnEraAdvanced -= OnEraAdvanced;
            GameEvents.OnEquipmentFused -= OnEquipmentFused;
            GameEvents.OnCardSetCompleted -= OnCardSetCompleted;
        }

        private void OnAchievementUnlocked(string achievementId)
        {
            var achievements = GameManager.Instance.achievementSystem.GetAllAchievements();
            var achievement = achievements.Find(a => a.achievementId == achievementId);
            if (achievement != null)
            {
                EnqueuePopup("Logro Desbloqueado!", achievement.name + "\n" + achievement.description);
            }
        }

        private void OnCardObtained(CardData card)
        {
            EnqueuePopup("Nueva Carta!", card.cardName, card.artwork);
        }

        private void OnEraAdvanced(string planetId, EraType era)
        {
            string eraName = era switch
            {
                EraType.StoneAge => "Edad de Piedra",
                EraType.TribalAge => "Edad Tribal",
                EraType.BronzeAge => "Edad del Bronce",
                _ => era.ToString()
            };
            EnqueuePopup("Nueva Era!", $"Has avanzado a la {eraName}");
        }

        private void OnEquipmentFused(EquipmentData equipment)
        {
            EnqueuePopup("Fusion Exitosa!", $"Obtuviste: {equipment.equipmentName} [{equipment.rarity}]");
        }

        private void OnCardSetCompleted(string planetId, EraType era)
        {
            EnqueuePopup("Set Completado!", $"Completaste el set de cartas de {era}.\nRecompensas recibidas!");
        }

        public void EnqueuePopup(string title, string message, Sprite icon = null)
        {
            _popupQueue.Enqueue(new PopupData { title = title, message = message, icon = icon });
            if (!_isShowingPopup)
                ShowNextPopup();
        }

        private void ShowNextPopup()
        {
            if (_popupQueue.Count == 0)
            {
                _isShowingPopup = false;
                return;
            }

            _isShowingPopup = true;
            var data = _popupQueue.Dequeue();

            if (popupTitleText) popupTitleText.text = data.title;
            if (popupMessageText) popupMessageText.text = data.message;
            if (popupIcon) popupIcon.sprite = data.icon;
            if (popupIcon) popupIcon.gameObject.SetActive(data.icon != null);

            if (popupPanel) popupPanel.SetActive(true);

            if (autoHide)
                StartCoroutine(AutoHideCoroutine());
        }

        private IEnumerator AutoHideCoroutine()
        {
            yield return new WaitForSeconds(autoHideDelay);
            HidePopup();
        }

        private void HidePopup()
        {
            StopAllCoroutines();
            if (popupPanel) popupPanel.SetActive(false);
            _isShowingPopup = false;

            // Show next queued popup
            if (_popupQueue.Count > 0)
                ShowNextPopup();
        }

        private struct PopupData
        {
            public string title;
            public string message;
            public Sprite icon;
        }
    }
}
