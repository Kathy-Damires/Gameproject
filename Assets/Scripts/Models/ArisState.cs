using System;
using System.Collections.Generic;

namespace ProjectEvolvion
{
    [Serializable]
    public class ArisState
    {
        public int level = 1;
        public int experience = 0;
        public int experienceToNextLevel = 100;

        // Base stats
        public int baseHP = 100;
        public int baseAttack = 10;
        public int baseDefense = 5;

        // Skins
        public string currentSkin = "Default";
        public List<string> unlockedSkins = new List<string> { "Default" };

        // Equipped items (by slot)
        public string equippedHelmetId;
        public string equippedWeaponId;
        public string equippedArmorId;
        public string equippedGadgetId;

        // Inventory
        public List<EquipmentInstance> equipmentInventory = new List<EquipmentInstance>();

        public int GetTotalHP(GameDatabase db) => baseHP + GetEquipmentStat(db, e => e.hpBonus);
        public int GetTotalAttack(GameDatabase db) => baseAttack + GetEquipmentStat(db, e => e.attackBonus);
        public int GetTotalDefense(GameDatabase db) => baseDefense + GetEquipmentStat(db, e => e.defenseBonus);

        private int GetEquipmentStat(GameDatabase db, Func<EquipmentData, int> statGetter)
        {
            int total = 0;
            total += GetStatFromSlot(db, equippedHelmetId, statGetter);
            total += GetStatFromSlot(db, equippedWeaponId, statGetter);
            total += GetStatFromSlot(db, equippedArmorId, statGetter);
            total += GetStatFromSlot(db, equippedGadgetId, statGetter);
            return total;
        }

        private int GetStatFromSlot(GameDatabase db, string equipId, Func<EquipmentData, int> statGetter)
        {
            if (string.IsNullOrEmpty(equipId)) return 0;
            var data = db.GetEquipment(equipId);
            return data != null ? statGetter(data) : 0;
        }

        public void AddExperience(int amount)
        {
            experience += amount;
            while (experience >= experienceToNextLevel)
            {
                experience -= experienceToNextLevel;
                level++;
                experienceToNextLevel = (int)(experienceToNextLevel * 1.2f);
                baseHP += 5;
                baseAttack += 2;
                baseDefense += 1;
            }
        }

        public string GetEquippedId(EquipmentSlot slot)
        {
            return slot switch
            {
                EquipmentSlot.Helmet => equippedHelmetId,
                EquipmentSlot.Weapon => equippedWeaponId,
                EquipmentSlot.Armor => equippedArmorId,
                EquipmentSlot.Gadget => equippedGadgetId,
                _ => null
            };
        }

        public void SetEquipped(EquipmentSlot slot, string equipmentId)
        {
            switch (slot)
            {
                case EquipmentSlot.Helmet: equippedHelmetId = equipmentId; break;
                case EquipmentSlot.Weapon: equippedWeaponId = equipmentId; break;
                case EquipmentSlot.Armor: equippedArmorId = equipmentId; break;
                case EquipmentSlot.Gadget: equippedGadgetId = equipmentId; break;
            }
        }
    }

    [Serializable]
    public class EquipmentInstance
    {
        public string instanceId;
        public string equipmentDataId;
    }
}
