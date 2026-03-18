using UnityEngine;
using System.IO;

namespace ProjectEvolvion
{
    public class SaveSystem : MonoBehaviour
    {
        private const string SAVE_KEY = "evolvion_save";
        private string SaveFilePath => Path.Combine(Application.persistentDataPath, "evolvion_save.json");

        private float _autoSaveInterval = 30f;
        private float _autoSaveTimer;

        public PlayerState LoadGame()
        {
            // Try file first, then PlayerPrefs fallback
            if (File.Exists(SaveFilePath))
            {
                string json = File.ReadAllText(SaveFilePath);
                var state = JsonUtility.FromJson<PlayerState>(json);
                if (state != null)
                {
                    Debug.Log($"[SaveSystem] Game loaded from file");
                    GameEvents.RaiseGameLoaded();
                    return state;
                }
            }

            if (PlayerPrefs.HasKey(SAVE_KEY))
            {
                string json = PlayerPrefs.GetString(SAVE_KEY);
                var state = JsonUtility.FromJson<PlayerState>(json);
                if (state != null)
                {
                    Debug.Log($"[SaveSystem] Game loaded from PlayerPrefs");
                    GameEvents.RaiseGameLoaded();
                    return state;
                }
            }

            Debug.Log("[SaveSystem] No save found, creating new game");
            return CreateNewGame();
        }

        public void SaveGame(PlayerState state)
        {
            state.lastSaveTimestamp = System.DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            string json = JsonUtility.ToJson(state, true);

            // Save to file
            File.WriteAllText(SaveFilePath, json);

            // Backup to PlayerPrefs
            PlayerPrefs.SetString(SAVE_KEY, json);
            PlayerPrefs.Save();

            Debug.Log("[SaveSystem] Game saved");
            GameEvents.RaiseGameSaved();
        }

        public void DeleteSave()
        {
            if (File.Exists(SaveFilePath))
                File.Delete(SaveFilePath);
            PlayerPrefs.DeleteKey(SAVE_KEY);
            Debug.Log("[SaveSystem] Save deleted");
        }

        public void UpdateAutoSave(PlayerState state)
        {
            _autoSaveTimer += Time.deltaTime;
            if (_autoSaveTimer >= _autoSaveInterval)
            {
                _autoSaveTimer = 0f;
                SaveGame(state);
            }
        }

        private PlayerState CreateNewGame()
        {
            var state = new PlayerState
            {
                playerId = System.Guid.NewGuid().ToString(),
                lastSaveTimestamp = System.DateTimeOffset.UtcNow.ToUnixTimeSeconds()
            };

            // Initialize starting resources
            state.SetResource(ResourceType.Stone, 50);
            state.SetResource(ResourceType.Wood, 50);
            state.SetResource(ResourceType.Food, 30);
            state.SetResource(ResourceType.Bronze, 0);
            state.SetResource(ResourceType.Energy, 10);
            state.SetResource(ResourceType.Diamonds, 5);

            // Initialize planets
            state.planets.Add(new PlanetState
            {
                planetId = "planet_porera",
                currentEra = EraType.StoneAge,
                isUnlocked = true
            });
            state.planets.Add(new PlanetState
            {
                planetId = "planet_doresa",
                currentEra = EraType.StoneAge,
                isUnlocked = false
            });
            state.planets.Add(new PlanetState
            {
                planetId = "planet_aitherium",
                currentEra = EraType.StoneAge,
                isUnlocked = false
            });
            state.activePlanetId = "planet_porera";

            return state;
        }
    }
}
