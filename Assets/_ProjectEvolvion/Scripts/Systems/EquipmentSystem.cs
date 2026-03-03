using UnityEngine;
using System.Collections.Generic;
using System.Linq;

namespace ProjectEvolvion
{
    public class EquipmentSystem : MonoBehaviour
    {
        private PlayerState _state;
        private GameDatabase _db;

        public void Initialize(PlayerState state, GameDatabase db)
        {
            _state = state;
            _db = db;
        }

        public void AddEquipment(string equipmentDataId)
        {
            var data = _db.GetEquipment(equipmentDataId);
            if (data == null) return;

            var instance = new EquipmentInstance
            {
                instanceId = System.Guid.NewGuid().ToString(),
                equipmentDataId = equipmentDataId
            };
            _state.aris.equipmentInventory.Add(instance);
            GameEvents.RaiseEquipmentObtained(data);
        }

        public bool Equip(string instanceId)
        {
            var instance = _state.aris.equipmentInventory.Find(e => e.instanceId == instanceId);
            if (instance == null) return false;

            var data = _db.GetEquipment(instance.equipmentDataId);
            if (data == null) return false;

            // Unequip current item in this slot (move back to inventory)
            string currentEquipped = _state.aris.GetEquippedId(data.slot);
            // No need to remove from inventory, just change the reference

            _state.aris.SetEquipped(data.slot, instance.equipmentDataId);
            GameEvents.RaiseEquipmentEquipped(data.slot, data);
            return true;
        }

        public void Unequip(EquipmentSlot slot)
        {
            _state.aris.SetEquipped(slot, null);
        }

        public bool FuseEquipment(List<string> instanceIds)
        {
            if (instanceIds.Count < 3) return false;

            var instances = new List<EquipmentInstance>();
            string commonDataId = null;

            foreach (var id in instanceIds)
            {
                var inst = _state.aris.equipmentInventory.Find(e => e.instanceId == id);
                if (inst == null) return false;

                if (commonDataId == null)
                    commonDataId = inst.equipmentDataId;
                else if (inst.equipmentDataId != commonDataId)
                    return false;

                instances.Add(inst);
            }

            var data = _db.GetEquipment(commonDataId);
            if (data == null || data.nextRarityEquipment == null) return false;

            // Remove the 3 items
            for (int i = 0; i < 3; i++)
            {
                // If any is equipped, unequip first
                if (_state.aris.GetEquippedId(data.slot) == instances[i].equipmentDataId)
                    Unequip(data.slot);

                _state.aris.equipmentInventory.Remove(instances[i]);
            }

            // Add the fused result
            AddEquipment(data.nextRarityEquipment.equipmentId);
            GameEvents.RaiseEquipmentFused(data.nextRarityEquipment);

            Debug.Log($"[EquipmentSystem] Fused 3x {data.equipmentName} into {data.nextRarityEquipment.equipmentName}");
            return true;
        }

        public void RecycleEquipment(string instanceId)
        {
            var instance = _state.aris.equipmentInventory.Find(e => e.instanceId == instanceId);
            if (instance == null) return;

            var data = _db.GetEquipment(instance.equipmentDataId);
            if (data == null) return;

            // If equipped, unequip
            if (_state.aris.GetEquippedId(data.slot) == instance.equipmentDataId)
                Unequip(data.slot);

            // Give recycle rewards
            var resourceSystem = GameManager.Instance.resourceSystem;
            if (data.recycleReward != null)
            {
                foreach (var reward in data.recycleReward)
                    resourceSystem.AddResource(reward.resourceType, reward.amount);
            }

            _state.aris.equipmentInventory.Remove(instance);
        }

        public List<EquipmentInstance> GetInventory() => _state.aris.equipmentInventory;

        public List<EquipmentInstance> GetEquipmentBySlot(EquipmentSlot slot) =>
            _state.aris.equipmentInventory
                .Where(e => _db.GetEquipment(e.equipmentDataId)?.slot == slot)
                .ToList();

        public List<EquipmentInstance> GetFusionCandidates(string equipmentDataId) =>
            _state.aris.equipmentInventory
                .Where(e => e.equipmentDataId == equipmentDataId)
                .ToList();

        public EquipmentData GetEquippedData(EquipmentSlot slot)
        {
            string id = _state.aris.GetEquippedId(slot);
            return string.IsNullOrEmpty(id) ? null : _db.GetEquipment(id);
        }
    }
}
