using UnityEngine;
using System.Collections.Generic;

namespace ProjectEvolvion
{
    public class CombatSystem : MonoBehaviour
    {
        private PlayerState _state;
        private GameDatabase _db;

        // Combat state
        private CombatState _combatState = CombatState.Idle;
        private EnemyData _currentEnemy;
        private int _enemyCurrentHP;
        private int _arisCurrentHP;
        private float _attackTimer;
        private float _enemyAttackTimer;
        private int _currentEnemyIndex;
        private List<EnemyData> _currentEnemyList;

        public CombatState CurrentState => _combatState;
        public EnemyData CurrentEnemy => _currentEnemy;
        public int EnemyCurrentHP => _enemyCurrentHP;
        public int ArisCurrentHP => _arisCurrentHP;
        public int ArisMaxHP => _state.aris.GetTotalHP(_db);

        public void Initialize(PlayerState state, GameDatabase db)
        {
            _state = state;
            _db = db;
        }

        public bool StartCombat()
        {
            if (_combatState != CombatState.Idle) return false;

            var planet = _state.GetActivePlanet();
            if (planet == null) return false;

            _currentEnemyList = new List<EnemyData>(_db.GetEnemiesForEra(planet.currentEra));
            if (_currentEnemyList.Count == 0) return false;

            _currentEnemyIndex = 0;
            StartFight(_currentEnemyList[0]);
            return true;
        }

        private void StartFight(EnemyData enemy)
        {
            _currentEnemy = enemy;
            _enemyCurrentHP = enemy.maxHP;
            _arisCurrentHP = _state.aris.GetTotalHP(_db);
            _attackTimer = 0f;
            _enemyAttackTimer = 0f;
            _combatState = CombatState.PlayerTurn;

            GameEvents.RaiseCombatStarted(enemy);
        }

        public void UpdateCombat(float deltaTime)
        {
            if (_combatState != CombatState.PlayerTurn && _combatState != CombatState.EnemyTurn)
                return;

            // Auto-combat: both sides attack on timers
            _attackTimer += deltaTime;
            _enemyAttackTimer += deltaTime;

            // Aris attacks every 1 second
            if (_attackTimer >= 1f)
            {
                _attackTimer = 0f;
                PerformArisAttack();
            }

            // Enemy attacks based on their speed
            if (_currentEnemy != null && _enemyAttackTimer >= _currentEnemy.attackSpeed)
            {
                _enemyAttackTimer = 0f;
                PerformEnemyAttack();
            }
        }

        private void PerformArisAttack()
        {
            int attack = _state.aris.GetTotalAttack(_db);
            int defense = _currentEnemy.defense;
            int damage = Mathf.Max(1, attack - defense / 2);

            // Add some variance
            damage = Mathf.RoundToInt(damage * Random.Range(0.85f, 1.15f));

            _enemyCurrentHP -= damage;
            GameEvents.RaiseDamageDealt(damage);

            if (_enemyCurrentHP <= 0)
            {
                OnEnemyDefeated();
            }
        }

        private void PerformEnemyAttack()
        {
            int attack = _currentEnemy.attack;
            int defense = _state.aris.GetTotalDefense(_db);
            int damage = Mathf.Max(1, attack - defense / 2);

            damage = Mathf.RoundToInt(damage * Random.Range(0.85f, 1.15f));

            _arisCurrentHP -= damage;
            GameEvents.RaiseDamageReceived(damage);

            if (_arisCurrentHP <= 0)
            {
                OnArisDefeated();
            }
        }

        private void OnEnemyDefeated()
        {
            _state.totalEnemiesDefeated++;
            _state.aris.AddExperience(_currentEnemy.experienceReward);

            // Distribute rewards
            DistributeRewards();

            // Check if there are more enemies in this level
            _currentEnemyIndex++;
            if (_currentEnemyIndex < _currentEnemyList.Count)
            {
                StartFight(_currentEnemyList[_currentEnemyIndex]);
            }
            else
            {
                _combatState = CombatState.Victory;
                GameEvents.RaiseCombatEnded(_currentEnemy, true);
            }
        }

        private void OnArisDefeated()
        {
            _combatState = CombatState.Defeat;
            GameEvents.RaiseCombatEnded(_currentEnemy, false);
        }

        private void DistributeRewards()
        {
            var resourceSystem = GameManager.Instance.resourceSystem;

            // Resource rewards
            if (_currentEnemy.resourceRewards != null)
            {
                foreach (var reward in _currentEnemy.resourceRewards)
                {
                    double amount = Random.Range((float)reward.minAmount, (float)reward.maxAmount);
                    resourceSystem.AddResource(reward.resourceType, amount);
                }
            }

            // Card drop
            if (Random.value <= _currentEnemy.cardDropChance)
            {
                TryDropCard();
            }

            // Equipment drop
            if (Random.value <= _currentEnemy.equipmentDropChance)
            {
                TryDropEquipment();
            }
        }

        private void TryDropCard()
        {
            var planet = _state.GetActivePlanet();
            if (planet == null) return;

            var cards = _db.GetCardsForPlanetAndEra(planet.planetId, planet.currentEra);
            if (cards.Length == 0) return;

            var card = cards[Random.Range(0, cards.Length)];
            GameManager.Instance.cardSystem.UnlockCard(card.cardId);
        }

        private void TryDropEquipment()
        {
            var planet = _state.GetActivePlanet();
            if (planet == null) return;

            var equipment = _db.GetEquipmentForEra(planet.currentEra);
            if (equipment.Length == 0) return;

            // Weighted by rarity: Common 70%, Clear 20%, Epic 8%, Legendary 2%
            float roll = Random.value;
            Rarity targetRarity;
            if (roll < 0.70f) targetRarity = Rarity.Common;
            else if (roll < 0.90f) targetRarity = Rarity.Clear;
            else if (roll < 0.98f) targetRarity = Rarity.Epic;
            else targetRarity = Rarity.Legendary;

            var filteredEquipment = System.Array.FindAll(equipment, e => e.rarity == targetRarity);
            if (filteredEquipment.Length == 0)
                filteredEquipment = System.Array.FindAll(equipment, e => e.rarity == Rarity.Common);

            if (filteredEquipment.Length > 0)
            {
                var drop = filteredEquipment[Random.Range(0, filteredEquipment.Length)];
                GameManager.Instance.equipmentSystem.AddEquipment(drop.equipmentId);
            }
        }

        public void EndCombat()
        {
            _combatState = CombatState.Idle;
            _currentEnemy = null;
            _currentEnemyList = null;
        }

        public List<EnemyData> GetAvailableEnemies()
        {
            var planet = _state.GetActivePlanet();
            if (planet == null) return new List<EnemyData>();
            return new List<EnemyData>(_db.GetEnemiesForEra(planet.currentEra));
        }
    }
}
