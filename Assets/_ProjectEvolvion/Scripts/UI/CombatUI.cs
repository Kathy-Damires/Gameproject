using UnityEngine;
using UnityEngine.UI;

namespace ProjectEvolvion
{
    public class CombatUI : MonoBehaviour
    {
        [Header("Aris")]
        public Text arisNameText;
        public Slider arisHPBar;
        public Text arisHPText;
        public Text arisStatsText;

        [Header("Enemy")]
        public Text enemyNameText;
        public Slider enemyHPBar;
        public Text enemyHPText;
        public Image enemyIcon;

        [Header("Combat Info")]
        public Text combatLogText;
        public Text rewardsText;

        [Header("Buttons")]
        public Button startCombatButton;
        public Button endCombatButton;
        public Button closeButton;

        [Header("Result Panel")]
        public GameObject resultPanel;
        public Text resultTitleText;
        public Text resultDetailsText;

        private CombatSystem _combatSystem;

        private void Start()
        {
            _combatSystem = GameManager.Instance.combatSystem;

            if (startCombatButton) startCombatButton.onClick.AddListener(OnStartCombat);
            if (endCombatButton) endCombatButton.onClick.AddListener(OnEndCombat);
            if (closeButton) closeButton.onClick.AddListener(() => FindObjectOfType<UIManager>().ShowOnlyPanel(PanelType.Planet));

            GameEvents.OnDamageDealt += OnDamageDealt;
            GameEvents.OnDamageReceived += OnDamageReceived;
            GameEvents.OnCombatEnded += OnCombatEnded;
        }

        private void OnDestroy()
        {
            GameEvents.OnDamageDealt -= OnDamageDealt;
            GameEvents.OnDamageReceived -= OnDamageReceived;
            GameEvents.OnCombatEnded -= OnCombatEnded;
        }

        private void OnEnable()
        {
            if (resultPanel) resultPanel.SetActive(false);
            UpdateIdleState();
        }

        private void Update()
        {
            if (_combatSystem.CurrentState == CombatState.PlayerTurn ||
                _combatSystem.CurrentState == CombatState.EnemyTurn)
            {
                _combatSystem.UpdateCombat(Time.deltaTime);
                UpdateCombatBars();
            }
        }

        private void UpdateIdleState()
        {
            var aris = GameManager.Instance.PlayerState.aris;
            var db = GameManager.Instance.database;

            if (arisNameText) arisNameText.text = $"Aris Nv.{aris.level}";
            if (arisStatsText) arisStatsText.text = $"ATK:{aris.GetTotalAttack(db)} DEF:{aris.GetTotalDefense(db)} HP:{aris.GetTotalHP(db)}";

            if (startCombatButton) startCombatButton.gameObject.SetActive(true);
            if (endCombatButton) endCombatButton.gameObject.SetActive(false);

            if (combatLogText) combatLogText.text = "Listo para el combate";
        }

        private void OnStartCombat()
        {
            if (_combatSystem.StartCombat())
            {
                if (startCombatButton) startCombatButton.gameObject.SetActive(false);
                if (endCombatButton) endCombatButton.gameObject.SetActive(true);
                if (resultPanel) resultPanel.SetActive(false);

                UpdateEnemyInfo();
                UpdateCombatBars();
                if (combatLogText) combatLogText.text = "Combate iniciado!";
            }
        }

        private void UpdateEnemyInfo()
        {
            var enemy = _combatSystem.CurrentEnemy;
            if (enemy == null) return;

            if (enemyNameText) enemyNameText.text = enemy.enemyName;
            if (enemyIcon) enemyIcon.sprite = enemy.icon;
        }

        private void UpdateCombatBars()
        {
            if (_combatSystem.CurrentEnemy == null) return;

            // Aris HP
            float arisHPPercent = (float)_combatSystem.ArisCurrentHP / _combatSystem.ArisMaxHP;
            if (arisHPBar) arisHPBar.value = Mathf.Clamp01(arisHPPercent);
            if (arisHPText) arisHPText.text = $"{Mathf.Max(0, _combatSystem.ArisCurrentHP)}/{_combatSystem.ArisMaxHP}";

            // Enemy HP
            float enemyHPPercent = (float)_combatSystem.EnemyCurrentHP / _combatSystem.CurrentEnemy.maxHP;
            if (enemyHPBar) enemyHPBar.value = Mathf.Clamp01(enemyHPPercent);
            if (enemyHPText) enemyHPText.text = $"{Mathf.Max(0, _combatSystem.EnemyCurrentHP)}/{_combatSystem.CurrentEnemy.maxHP}";
        }

        private void OnDamageDealt(int damage)
        {
            if (combatLogText) combatLogText.text = $"Aris hace {damage} de dano!";
        }

        private void OnDamageReceived(int damage)
        {
            if (combatLogText) combatLogText.text = $"Aris recibe {damage} de dano!";
        }

        private void OnCombatEnded(EnemyData enemy, bool victory)
        {
            if (resultPanel) resultPanel.SetActive(true);

            if (victory)
            {
                if (resultTitleText) resultTitleText.text = "Victoria!";
                if (resultDetailsText) resultDetailsText.text = $"Derrotaste a {enemy.enemyName}\n+{enemy.experienceReward} EXP";
            }
            else
            {
                if (resultTitleText) resultTitleText.text = "Derrota";
                if (resultDetailsText) resultDetailsText.text = "Aris ha caido. Mejora tu equipamiento e intentalo de nuevo.";
            }

            if (endCombatButton) endCombatButton.gameObject.SetActive(true);
        }

        private void OnEndCombat()
        {
            _combatSystem.EndCombat();
            UpdateIdleState();
            if (resultPanel) resultPanel.SetActive(false);
        }
    }
}
