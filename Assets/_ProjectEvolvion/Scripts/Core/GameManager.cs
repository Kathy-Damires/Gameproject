using UnityEngine;

namespace ProjectEvolvion
{
    public class GameManager : MonoBehaviour
    {
        public static GameManager Instance { get; private set; }

        [Header("Core")]
        public GameDatabase database;
        public SaveSystem saveSystem;
        public TimeManager timeManager;

        [Header("Systems")]
        public ResourceSystem resourceSystem;
        public StructureSystem structureSystem;
        public PlanetSystem planetSystem;
        public ToolSystem toolSystem;
        public EquipmentSystem equipmentSystem;
        public CombatSystem combatSystem;
        public CardSystem cardSystem;
        public PrestigeSystem prestigeSystem;
        public AchievementSystem achievementSystem;
        public ShopSystem shopSystem;
        public ClanSystem clanSystem;

        public PlayerState PlayerState { get; private set; }

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);

            InitializeGame();
        }

        private void InitializeGame()
        {
            // Initialize database lookups
            database.Initialize();

            // Load or create player state
            PlayerState = saveSystem.LoadGame();

            // Initialize all systems
            resourceSystem.Initialize(PlayerState);
            structureSystem.Initialize(PlayerState, database);
            planetSystem.Initialize(PlayerState, database);
            toolSystem.Initialize(PlayerState, database);
            equipmentSystem.Initialize(PlayerState, database);
            combatSystem.Initialize(PlayerState, database);
            cardSystem.Initialize(PlayerState, database);
            prestigeSystem.Initialize(PlayerState);
            achievementSystem.Initialize(PlayerState);
            shopSystem.Initialize(PlayerState, database);
            clanSystem.Initialize(PlayerState, database);

            // Calculate offline earnings
            ProcessOfflineEarnings();

            Debug.Log("[GameManager] Game initialized successfully");
        }

        private void Update()
        {
            float dt = Time.deltaTime;

            // Tick idle systems
            structureSystem.Tick(dt);
            prestigeSystem.Tick(dt);

            // Auto-save
            saveSystem.UpdateAutoSave(PlayerState);
        }

        private void ProcessOfflineEarnings()
        {
            float offlineSeconds = timeManager.CalculateOfflineSeconds(PlayerState.lastSaveTimestamp);

            if (offlineSeconds > 60f) // At least 1 minute offline
            {
                double totalProductionPerSec = structureSystem.GetTotalProductionPerSecond();
                double offlineEarnings = timeManager.CalculateOfflineEarnings(offlineSeconds, totalProductionPerSec);

                if (offlineEarnings > 0)
                {
                    // Distribute offline earnings proportionally to active structures
                    structureSystem.DistributeOfflineEarnings(offlineSeconds);

                    Debug.Log($"[GameManager] Offline earnings: {offlineEarnings:F0} resources for {offlineSeconds:F0}s");
                }
            }
        }

        private void OnApplicationPause(bool pauseStatus)
        {
            if (pauseStatus)
                saveSystem.SaveGame(PlayerState);
        }

        private void OnApplicationQuit()
        {
            saveSystem.SaveGame(PlayerState);
        }

        public void ManualSave()
        {
            saveSystem.SaveGame(PlayerState);
        }
    }
}
