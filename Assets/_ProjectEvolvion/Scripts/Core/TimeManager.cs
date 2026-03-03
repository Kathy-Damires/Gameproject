using UnityEngine;

namespace ProjectEvolvion
{
    public class TimeManager : MonoBehaviour
    {
        public const float MAX_OFFLINE_HOURS = 24f;

        public float CalculateOfflineSeconds(long lastSaveTimestamp)
        {
            long now = System.DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            float elapsedSeconds = now - lastSaveTimestamp;

            if (elapsedSeconds < 0) return 0f;

            float maxSeconds = MAX_OFFLINE_HOURS * 3600f;
            return Mathf.Min(elapsedSeconds, maxSeconds);
        }

        public double CalculateOfflineEarnings(float offlineSeconds, double productionPerSecond)
        {
            // Offline earnings are 50% of real-time to incentivize active play
            return productionPerSecond * offlineSeconds * 0.5;
        }
    }
}
