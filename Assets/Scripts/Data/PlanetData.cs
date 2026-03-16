using UnityEngine;

namespace ProjectEvolvion
{
    [CreateAssetMenu(fileName = "NewPlanet", menuName = "Evolvion/Planet Data")]
    public class PlanetData : ScriptableObject
    {
        public string planetId;
        public string planetName;
        [TextArea(2, 4)]
        public string description;
        public Sprite icon;
        public EraData[] eras;
        public int cardsPerEra = 9;
    }
}
