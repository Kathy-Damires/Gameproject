using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

namespace ProjectEvolvion
{
    public class CardAlbumUI : MonoBehaviour
    {
        [Header("Album Info")]
        public Text albumTitleText;
        public Text progressText;
        public Slider progressSlider;

        [Header("Era Tabs")]
        public Button stoneAgeTab;
        public Button tribalAgeTab;
        public Button bronzeAgeTab;

        [Header("Card Grid")]
        public Transform cardGridContainer;
        public GameObject cardItemPrefab;

        [Header("Card Detail")]
        public GameObject cardDetailPanel;
        public Text cardNameText;
        public Text cardDescriptionText;
        public Text cardRarityText;
        public Image cardArtwork;

        [Header("Navigation")]
        public Button closeButton;

        private List<GameObject> _spawnedCards = new List<GameObject>();
        private EraType _selectedEra = EraType.StoneAge;

        private void Start()
        {
            if (closeButton) closeButton.onClick.AddListener(() => FindObjectOfType<UIManager>().ShowOnlyPanel(PanelType.Planet));

            if (stoneAgeTab) stoneAgeTab.onClick.AddListener(() => SelectEra(EraType.StoneAge));
            if (tribalAgeTab) tribalAgeTab.onClick.AddListener(() => SelectEra(EraType.TribalAge));
            if (bronzeAgeTab) bronzeAgeTab.onClick.AddListener(() => SelectEra(EraType.BronzeAge));

            GameEvents.OnCardObtained += OnCardObtained;
        }

        private void OnDestroy()
        {
            GameEvents.OnCardObtained -= OnCardObtained;
        }

        private void OnEnable()
        {
            if (cardDetailPanel) cardDetailPanel.SetActive(false);
            SelectEra(_selectedEra);
        }

        private void SelectEra(EraType era)
        {
            _selectedEra = era;
            RefreshCardGrid();
            UpdateProgress();
        }

        private void RefreshCardGrid()
        {
            foreach (var card in _spawnedCards)
                Destroy(card);
            _spawnedCards.Clear();

            if (cardItemPrefab == null || cardGridContainer == null) return;

            var gm = GameManager.Instance;
            var planet = gm.PlayerState.GetActivePlanet();
            if (planet == null) return;

            var cards = gm.database.GetCardsForPlanetAndEra(planet.planetId, _selectedEra);

            foreach (var cardData in cards)
            {
                var cardObj = Instantiate(cardItemPrefab, cardGridContainer);
                _spawnedCards.Add(cardObj);

                bool owned = gm.cardSystem.HasCard(cardData.cardId);

                var nameText = cardObj.GetComponentInChildren<Text>();
                if (nameText)
                    nameText.text = owned ? cardData.cardName : "???";

                var image = cardObj.GetComponentInChildren<Image>();
                if (image && owned && cardData.artwork != null)
                    image.sprite = cardData.artwork;

                // Dim unowned cards
                var canvasGroup = cardObj.GetComponent<CanvasGroup>();
                if (canvasGroup == null)
                    canvasGroup = cardObj.AddComponent<CanvasGroup>();
                canvasGroup.alpha = owned ? 1f : 0.4f;

                if (owned)
                {
                    var button = cardObj.GetComponent<Button>();
                    if (button)
                    {
                        var data = cardData;
                        button.onClick.AddListener(() => ShowCardDetail(data));
                    }
                }
            }
        }

        private void UpdateProgress()
        {
            var gm = GameManager.Instance;
            var planet = gm.PlayerState.GetActivePlanet();
            if (planet == null) return;

            int owned = gm.cardSystem.GetSetProgress(planet.planetId, _selectedEra);
            int total = gm.cardSystem.GetSetTotal(planet.planetId, _selectedEra);

            if (progressText) progressText.text = $"{owned}/{total} cartas";
            if (progressSlider && total > 0) progressSlider.value = (float)owned / total;

            string eraName = _selectedEra switch
            {
                EraType.StoneAge => "Edad de Piedra",
                EraType.TribalAge => "Edad Tribal",
                EraType.BronzeAge => "Edad del Bronce",
                _ => _selectedEra.ToString()
            };
            if (albumTitleText) albumTitleText.text = $"Album: {eraName}";
        }

        private void ShowCardDetail(CardData data)
        {
            if (cardDetailPanel) cardDetailPanel.SetActive(true);
            if (cardNameText) cardNameText.text = data.cardName;
            if (cardDescriptionText) cardDescriptionText.text = data.description;
            if (cardRarityText) cardRarityText.text = $"Rareza: {data.rarity}";
            if (cardArtwork && data.artwork) cardArtwork.sprite = data.artwork;
        }

        private void OnCardObtained(CardData card)
        {
            if (gameObject.activeInHierarchy)
            {
                RefreshCardGrid();
                UpdateProgress();
            }
        }
    }
}
