using UnityEngine;

namespace ProjectEvolvion
{
    public class ResourceSystem : MonoBehaviour
    {
        private PlayerState _state;

        public void Initialize(PlayerState state)
        {
            _state = state;
        }

        public double GetResource(ResourceType type) => _state.GetResource(type);

        public bool CanAfford(ResourceCost[] costs) => _state.CanAfford(costs);

        public bool CanAffordScaled(ResourceCost[] baseCosts, double multiplier, int level)
        {
            foreach (var cost in baseCosts)
            {
                double scaledCost = cost.amount * System.Math.Pow(multiplier, level);
                if (_state.GetResource(cost.resourceType) < scaledCost)
                    return false;
            }
            return true;
        }

        public void AddResource(ResourceType type, double amount)
        {
            _state.AddResource(type, amount);
            GameEvents.RaiseResourceChanged(type, _state.GetResource(type));
        }

        public bool SpendResource(ResourceType type, double amount)
        {
            if (_state.SpendResource(type, amount))
            {
                GameEvents.RaiseResourceChanged(type, _state.GetResource(type));
                GameEvents.RaiseResourceSpent(type, amount);
                return true;
            }
            return false;
        }

        public bool SpendCosts(ResourceCost[] costs)
        {
            if (!_state.CanAfford(costs)) return false;

            foreach (var cost in costs)
            {
                _state.SpendResource(cost.resourceType, cost.amount);
                GameEvents.RaiseResourceChanged(cost.resourceType, _state.GetResource(cost.resourceType));
            }
            return true;
        }

        public bool SpendScaledCosts(ResourceCost[] baseCosts, double multiplier, int level)
        {
            if (!CanAffordScaled(baseCosts, multiplier, level)) return false;

            foreach (var cost in baseCosts)
            {
                double scaledCost = cost.amount * System.Math.Pow(multiplier, level);
                _state.SpendResource(cost.resourceType, scaledCost);
                GameEvents.RaiseResourceChanged(cost.resourceType, _state.GetResource(cost.resourceType));
            }
            return true;
        }

        public void ExchangeOldResources(ResourceType oldType, ResourceType newType, double amount, double exchangeRate)
        {
            if (_state.GetResource(oldType) >= amount)
            {
                SpendResource(oldType, amount);
                AddResource(newType, amount * exchangeRate);
            }
        }
    }
}
