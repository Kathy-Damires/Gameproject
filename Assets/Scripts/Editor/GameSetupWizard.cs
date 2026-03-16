using UnityEngine;
using UnityEditor;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using System.IO;
using System.Collections.Generic;

namespace ProjectEvolvion.Editor
{
    public class GameSetupWizard : EditorWindow
    {
        [MenuItem("Evolvion/Setup Completo del Juego")]
        public static void SetupGame()
        {
            if (EditorUtility.DisplayDialog("Setup Evolvion",
                "Esto creara todos los ScriptableObjects, Prefabs y configurara la escena.\n\nContinuar?",
                "Si, crear todo", "Cancelar"))
            {
                CreateAllScriptableObjects();
                CreateAllPrefabs();
                SetupScene();
                AssetDatabase.SaveAssets();
                AssetDatabase.Refresh();
                Debug.Log("[Evolvion] Setup completo! Presiona Play para jugar.");
                EditorUtility.DisplayDialog("Listo!", "Setup completo.\nPresiona Play para ejecutar el juego.", "OK");
            }
        }

        [MenuItem("Evolvion/1 - Crear ScriptableObjects")]
        public static void CreateAllScriptableObjects()
        {
            CreateTools();
            CreateStructures();
            CreateEnemies();
            CreateEquipment();
            CreateCards();
            CreateEras();
            CreatePlanets();
            CreateShopItems();
            CreateClanEvents();
            AssetDatabase.SaveAssets();
            Debug.Log("[Evolvion] ScriptableObjects creados.");
        }

        [MenuItem("Evolvion/2 - Crear Prefabs")]
        public static void CreateAllPrefabs()
        {
            CreateUIPrefabs();
            AssetDatabase.SaveAssets();
            Debug.Log("[Evolvion] Prefabs creados.");
        }

        [MenuItem("Evolvion/3 - Configurar Escena")]
        public static void SetupScene()
        {
            SetupMainScene();
            Debug.Log("[Evolvion] Escena configurada.");
        }

        // ============================================================
        // TOOLS
        // ============================================================
        static void CreateTools()
        {
            EnsureFolder("Assets/ScriptableObjects/Tools");

            var toolDefs = new[]
            {
                ("tool_stone_pick", "Pico de Piedra", EraType.StoneAge, Rarity.Common, 10f),
                ("tool_stone_pick_clear", "Pico de Piedra Pulido", EraType.StoneAge, Rarity.Clear, 20f),
                ("tool_stone_pick_epic", "Pico de Piedra Maestro", EraType.StoneAge, Rarity.Epic, 35f),
                ("tool_tribal_axe", "Hacha Tribal", EraType.TribalAge, Rarity.Common, 12f),
                ("tool_tribal_axe_clear", "Hacha Tribal Afilada", EraType.TribalAge, Rarity.Clear, 24f),
                ("tool_bronze_hammer", "Martillo de Bronce", EraType.BronzeAge, Rarity.Common, 15f),
                ("tool_bronze_hammer_clear", "Martillo de Bronce Fino", EraType.BronzeAge, Rarity.Clear, 30f),
                ("tool_classical_chisel", "Cincel Clasico", EraType.ClassicalAge, Rarity.Common, 18f),
                ("tool_middle_forge", "Forja Medieval", EraType.MiddleAge, Rarity.Common, 20f),
                ("tool_industrial_drill", "Taladro Industrial", EraType.IndustrialAge, Rarity.Common, 25f),
                ("tool_robot_laser", "Laser Robotico", EraType.RobotAge, Rarity.Common, 30f),
                ("tool_space_plasma", "Cortador de Plasma", EraType.SpaceAge, Rarity.Common, 35f),
                ("tool_singularity_quantum", "Herramienta Cuantica", EraType.SingularityAge, Rarity.Common, 50f),
            };

            foreach (var (id, name, era, rarity, bonus) in toolDefs)
            {
                var tool = CreateOrLoad<ToolData>($"Assets/ScriptableObjects/Tools/{id}.asset");
                tool.toolId = id;
                tool.toolName = name;
                tool.description = $"Herramienta de la {era}";
                tool.era = era;
                tool.rarity = rarity;
                tool.productionBonusPercent = bonus;
                tool.fusionRequiredCount = 3;
                EditorUtility.SetDirty(tool);
            }

            // Link fusion chains
            LinkToolFusion("tool_stone_pick", "tool_stone_pick_clear");
            LinkToolFusion("tool_stone_pick_clear", "tool_stone_pick_epic");
            LinkToolFusion("tool_tribal_axe", "tool_tribal_axe_clear");
            LinkToolFusion("tool_bronze_hammer", "tool_bronze_hammer_clear");
        }

        static void LinkToolFusion(string fromId, string toId)
        {
            var from = AssetDatabase.LoadAssetAtPath<ToolData>($"Assets/ScriptableObjects/Tools/{fromId}.asset");
            var to = AssetDatabase.LoadAssetAtPath<ToolData>($"Assets/ScriptableObjects/Tools/{toId}.asset");
            if (from != null && to != null)
            {
                from.nextRarityTool = to;
                EditorUtility.SetDirty(from);
            }
        }

        // ============================================================
        // STRUCTURES
        // ============================================================
        static void CreateStructures()
        {
            EnsureFolder("Assets/ScriptableObjects/Structures");

            var structDefs = new[]
            {
                ("struct_quarry", "Cantera", EraType.StoneAge, ResourceType.Stone, 1.0, 10.0, "tool_stone_pick"),
                ("struct_woodcamp", "Campamento Madero", EraType.StoneAge, ResourceType.Wood, 0.8, 8.0, ""),
                ("struct_huntcamp", "Campamento de Caza", EraType.StoneAge, ResourceType.Food, 0.6, 12.0, ""),
                ("struct_tribal_farm", "Granja Tribal", EraType.TribalAge, ResourceType.Food, 2.0, 50.0, "tool_tribal_axe"),
                ("struct_tribal_mine", "Mina Tribal", EraType.TribalAge, ResourceType.Stone, 2.5, 60.0, ""),
                ("struct_tribal_lumber", "Aserradero Tribal", EraType.TribalAge, ResourceType.Wood, 2.2, 55.0, ""),
                ("struct_bronze_forge", "Forja de Bronce", EraType.BronzeAge, ResourceType.Bronze, 3.0, 200.0, "tool_bronze_hammer"),
                ("struct_bronze_quarry", "Gran Cantera", EraType.BronzeAge, ResourceType.Stone, 5.0, 180.0, ""),
                ("struct_bronze_farm", "Granja Avanzada", EraType.BronzeAge, ResourceType.Food, 4.0, 150.0, ""),
                ("struct_classical_temple", "Templo", EraType.ClassicalAge, ResourceType.Stone, 8.0, 500.0, "tool_classical_chisel"),
                ("struct_classical_market", "Mercado", EraType.ClassicalAge, ResourceType.Food, 7.0, 450.0, ""),
                ("struct_middle_castle", "Castillo", EraType.MiddleAge, ResourceType.Stone, 15.0, 2000.0, "tool_middle_forge"),
                ("struct_middle_mill", "Molino", EraType.MiddleAge, ResourceType.Food, 12.0, 1500.0, ""),
                ("struct_industrial_factory", "Fabrica", EraType.IndustrialAge, ResourceType.Bronze, 25.0, 8000.0, "tool_industrial_drill"),
                ("struct_industrial_powerplant", "Planta Electrica", EraType.IndustrialAge, ResourceType.Energy, 5.0, 10000.0, ""),
                ("struct_robot_assembler", "Ensamblador", EraType.RobotAge, ResourceType.Bronze, 50.0, 30000.0, "tool_robot_laser"),
                ("struct_robot_reactor", "Reactor", EraType.RobotAge, ResourceType.Energy, 15.0, 35000.0, ""),
                ("struct_space_station", "Estacion Espacial", EraType.SpaceAge, ResourceType.Energy, 30.0, 100000.0, "tool_space_plasma"),
                ("struct_space_colony", "Colonia", EraType.SpaceAge, ResourceType.Food, 80.0, 90000.0, ""),
                ("struct_singularity_nexus", "Nexo Cuantico", EraType.SingularityAge, ResourceType.Energy, 100.0, 500000.0, "tool_singularity_quantum"),
            };

            foreach (var (id, name, era, resource, prod, cost, toolId) in structDefs)
            {
                var s = CreateOrLoad<StructureData>($"Assets/ScriptableObjects/Structures/{id}.asset");
                s.structureId = id;
                s.structureName = name;
                s.description = $"Estructura de la {era}";
                s.era = era;
                s.producedResource = resource;
                s.baseProductionPerSecond = prod;
                s.productionMultiplierPerLevel = 1.15;
                s.upgradeCostMultiplier = 1.5;
                s.maxLevel = 100;
                s.buildCost = new ResourceCost[]
                {
                    new ResourceCost { resourceType = GetPrimaryCostResource(era), amount = cost }
                };

                if (!string.IsNullOrEmpty(toolId))
                    s.associatedTool = AssetDatabase.LoadAssetAtPath<ToolData>($"Assets/ScriptableObjects/Tools/{toolId}.asset");

                EditorUtility.SetDirty(s);
            }
        }

        static ResourceType GetPrimaryCostResource(EraType era)
        {
            return era switch
            {
                EraType.StoneAge => ResourceType.Stone,
                EraType.TribalAge => ResourceType.Wood,
                EraType.BronzeAge => ResourceType.Bronze,
                EraType.ClassicalAge => ResourceType.Stone,
                EraType.MiddleAge => ResourceType.Wood,
                EraType.IndustrialAge => ResourceType.Bronze,
                EraType.RobotAge => ResourceType.Bronze,
                EraType.SpaceAge => ResourceType.Energy,
                EraType.SingularityAge => ResourceType.Energy,
                _ => ResourceType.Stone
            };
        }

        // ============================================================
        // ENEMIES
        // ============================================================
        static void CreateEnemies()
        {
            EnsureFolder("Assets/ScriptableObjects/Enemies");

            var enemyDefs = new[]
            {
                ("enemy_wolf", "Lobo Salvaje", EraType.StoneAge, 50, 8, 3, 1.2f, 10),
                ("enemy_bear", "Oso Cavernario", EraType.StoneAge, 80, 12, 5, 0.8f, 20),
                ("enemy_shaman", "Chaman Hostil", EraType.TribalAge, 70, 15, 8, 1.0f, 25),
                ("enemy_raider", "Saqueador Tribal", EraType.TribalAge, 90, 18, 10, 1.1f, 30),
                ("enemy_bronze_warrior", "Guerrero de Bronce", EraType.BronzeAge, 120, 22, 15, 0.9f, 45),
                ("enemy_bronze_archer", "Arquero de Bronce", EraType.BronzeAge, 80, 28, 8, 1.3f, 40),
                ("enemy_gladiator", "Gladiador", EraType.ClassicalAge, 150, 30, 20, 0.8f, 60),
                ("enemy_centurion", "Centurion", EraType.ClassicalAge, 200, 35, 25, 0.7f, 80),
                ("enemy_knight", "Caballero Oscuro", EraType.MiddleAge, 250, 40, 30, 0.6f, 100),
                ("enemy_dragon", "Dragon Joven", EraType.MiddleAge, 400, 50, 20, 0.5f, 150),
                ("enemy_automaton", "Automaton", EraType.IndustrialAge, 300, 45, 40, 1.0f, 120),
                ("enemy_mech", "Mech de Guerra", EraType.RobotAge, 500, 60, 50, 0.8f, 200),
                ("enemy_alien", "Alienigena", EraType.SpaceAge, 600, 70, 45, 1.2f, 300),
                ("enemy_void", "Entidad del Vacio", EraType.SingularityAge, 1000, 100, 60, 1.0f, 500),
            };

            foreach (var (id, name, era, hp, atk, def, spd, xp) in enemyDefs)
            {
                var e = CreateOrLoad<EnemyData>($"Assets/ScriptableObjects/Enemies/{id}.asset");
                e.enemyId = id;
                e.enemyName = name;
                e.description = $"Enemigo de la {era}";
                e.era = era;
                e.maxHP = hp;
                e.attack = atk;
                e.defense = def;
                e.attackSpeed = spd;
                e.experienceReward = xp;
                e.cardDropChance = 0.1f;
                e.equipmentDropChance = 0.05f;
                e.resourceRewards = new ResourceReward[]
                {
                    new ResourceReward
                    {
                        resourceType = GetPrimaryCostResource(era),
                        minAmount = xp * 0.5,
                        maxAmount = xp * 2.0
                    }
                };
                EditorUtility.SetDirty(e);
            }
        }

        // ============================================================
        // EQUIPMENT
        // ============================================================
        static void CreateEquipment()
        {
            EnsureFolder("Assets/ScriptableObjects/Equipment");

            var equipDefs = new[]
            {
                // StoneAge
                ("equip_stone_helmet", "Casco de Piedra", EraType.StoneAge, EquipmentSlot.Helmet, Rarity.Common, 0, 5, 10, 0f),
                ("equip_stone_club", "Garrote", EraType.StoneAge, EquipmentSlot.Weapon, Rarity.Common, 8, 0, 0, 0f),
                ("equip_stone_hide", "Armadura de Piel", EraType.StoneAge, EquipmentSlot.Armor, Rarity.Common, 0, 8, 15, 0f),
                ("equip_stone_charm", "Amuleto Primitivo", EraType.StoneAge, EquipmentSlot.Gadget, Rarity.Common, 3, 3, 5, 5f),
                // TribalAge
                ("equip_tribal_mask", "Mascara Tribal", EraType.TribalAge, EquipmentSlot.Helmet, Rarity.Common, 2, 10, 20, 0f),
                ("equip_tribal_spear", "Lanza Tribal", EraType.TribalAge, EquipmentSlot.Weapon, Rarity.Common, 15, 0, 0, 0f),
                ("equip_tribal_leather", "Armadura de Cuero", EraType.TribalAge, EquipmentSlot.Armor, Rarity.Common, 0, 15, 25, 0f),
                ("equip_tribal_totem", "Totem Mistico", EraType.TribalAge, EquipmentSlot.Gadget, Rarity.Common, 5, 5, 10, 8f),
                // BronzeAge
                ("equip_bronze_helm", "Yelmo de Bronce", EraType.BronzeAge, EquipmentSlot.Helmet, Rarity.Clear, 5, 18, 30, 0f),
                ("equip_bronze_sword", "Espada de Bronce", EraType.BronzeAge, EquipmentSlot.Weapon, Rarity.Clear, 25, 2, 0, 0f),
                ("equip_bronze_plate", "Coraza de Bronce", EraType.BronzeAge, EquipmentSlot.Armor, Rarity.Clear, 0, 25, 40, 0f),
                ("equip_bronze_ring", "Anillo de Bronce", EraType.BronzeAge, EquipmentSlot.Gadget, Rarity.Clear, 8, 8, 15, 10f),
                // Epic/Legendary examples
                ("equip_dragon_helm", "Yelmo de Dragon", EraType.MiddleAge, EquipmentSlot.Helmet, Rarity.Epic, 15, 30, 60, 5f),
                ("equip_excalibur", "Excalibur", EraType.MiddleAge, EquipmentSlot.Weapon, Rarity.Legendary, 80, 10, 0, 15f),
                ("equip_mech_armor", "Armadura Mecanica", EraType.RobotAge, EquipmentSlot.Armor, Rarity.Epic, 10, 60, 100, 10f),
                ("equip_quantum_gadget", "Dispositivo Cuantico", EraType.SingularityAge, EquipmentSlot.Gadget, Rarity.Legendary, 50, 50, 50, 25f),
            };

            foreach (var (id, name, era, slot, rarity, atk, def, hp, special) in equipDefs)
            {
                var eq = CreateOrLoad<EquipmentData>($"Assets/ScriptableObjects/Equipment/{id}.asset");
                eq.equipmentId = id;
                eq.equipmentName = name;
                eq.description = $"Equipamiento {rarity} de la {era}";
                eq.era = era;
                eq.slot = slot;
                eq.rarity = rarity;
                eq.attackBonus = atk;
                eq.defenseBonus = def;
                eq.hpBonus = hp;
                eq.specialEffectValue = special;
                eq.fusionRequiredCount = 3;
                eq.recycleReward = new ResourceCost[]
                {
                    new ResourceCost { resourceType = ResourceType.Bronze, amount = (int)rarity * 20 + 10 }
                };
                EditorUtility.SetDirty(eq);
            }
        }

        // ============================================================
        // CARDS
        // ============================================================
        static void CreateCards()
        {
            EnsureFolder("Assets/ScriptableObjects/Cards");

            var eraNames = new Dictionary<EraType, string[]>
            {
                { EraType.StoneAge, new[] { "Piedra Angular", "Fuego Primordial", "Cueva Sagrada", "Mamut Lanudo", "Rio Antiguo", "Cielo Nocturno", "Primer Amanecer", "Hueso Tallado", "Pintura Rupestre" } },
                { EraType.TribalAge, new[] { "Danza Ritual", "Totem Ancestral", "Chaman Sabio", "Hoguera Tribal", "Caza Mayor", "Luna Llena", "Tambor de Guerra", "Espiritu Animal", "Vision Mistica" } },
                { EraType.BronzeAge, new[] { "Lingote de Bronce", "Rueda Inventada", "Escritura Antigua", "Comercio Maritimo", "Templo Dorado", "Armada Naval", "Codigo de Leyes", "Irrigacion", "Astronomia" } },
            };

            int cardIndex = 0;
            foreach (var kvp in eraNames)
            {
                var era = kvp.Key;
                var names = kvp.Value;
                for (int i = 0; i < names.Length; i++)
                {
                    string id = $"card_{era.ToString().ToLower()}_{i}";
                    var card = CreateOrLoad<CardData>($"Assets/ScriptableObjects/Cards/{id}.asset");
                    card.cardId = id;
                    card.cardName = names[i];
                    card.description = $"Carta coleccionable: {names[i]}";
                    card.era = era;
                    card.planetId = "planet_porera";
                    card.rarity = i < 5 ? Rarity.Common : (i < 7 ? Rarity.Clear : (i < 8 ? Rarity.Epic : Rarity.Legendary));
                    card.setIndex = i;
                    card.setCompletionReward = new ResourceCost[]
                    {
                        new ResourceCost { resourceType = ResourceType.Diamonds, amount = 10 }
                    };
                    EditorUtility.SetDirty(card);
                    cardIndex++;
                }
            }
        }

        // ============================================================
        // ERAS
        // ============================================================
        static void CreateEras()
        {
            EnsureFolder("Assets/ScriptableObjects/Eras");

            var eraDefs = new (string id, string name, EraType type, EraType prev, double unlockCost)[]
            {
                ("era_stone", "Edad de Piedra", EraType.StoneAge, EraType.StoneAge, 0),
                ("era_tribal", "Edad Tribal", EraType.TribalAge, EraType.StoneAge, 100),
                ("era_bronze", "Edad del Bronce", EraType.BronzeAge, EraType.TribalAge, 500),
                ("era_classical", "Edad Clasica", EraType.ClassicalAge, EraType.BronzeAge, 2000),
                ("era_middle", "Edad Media", EraType.MiddleAge, EraType.ClassicalAge, 8000),
                ("era_industrial", "Edad Industrial", EraType.IndustrialAge, EraType.MiddleAge, 30000),
                ("era_robot", "Edad Robot", EraType.RobotAge, EraType.IndustrialAge, 100000),
                ("era_space", "Edad Espacial", EraType.SpaceAge, EraType.RobotAge, 500000),
                ("era_singularity", "Singularidad", EraType.SingularityAge, EraType.SpaceAge, 2000000),
            };

            foreach (var (id, name, type, prev, cost) in eraDefs)
            {
                var era = CreateOrLoad<EraData>($"Assets/ScriptableObjects/Eras/{id}.asset");
                era.eraId = id;
                era.eraName = name;
                era.eraType = type;
                era.description = $"La {name} de la civilizacion";
                era.previousEra = prev;

                if (cost > 0)
                {
                    era.unlockCost = new ResourceCost[]
                    {
                        new ResourceCost { resourceType = GetPrimaryCostResource(prev), amount = cost }
                    };
                }
                else
                {
                    era.unlockCost = new ResourceCost[0];
                }

                // Assign structures for this era
                var structs = new List<StructureData>();
                var allStructs = FindAllAssets<StructureData>("Assets/ScriptableObjects/Structures");
                foreach (var s in allStructs)
                    if (s.era == type) structs.Add(s);
                era.structures = structs.ToArray();

                // Assign enemies for this era
                var enemyList = new List<EnemyData>();
                var allEnemies = FindAllAssets<EnemyData>("Assets/ScriptableObjects/Enemies");
                foreach (var e in allEnemies)
                    if (e.era == type) enemyList.Add(e);
                era.enemies = enemyList.ToArray();

                // Assign equipment for this era
                var equipList = new List<EquipmentData>();
                var allEquip = FindAllAssets<EquipmentData>("Assets/ScriptableObjects/Equipment");
                foreach (var eq in allEquip)
                    if (eq.era == type) equipList.Add(eq);
                era.availableEquipment = equipList.ToArray();

                // Assign cards for this era
                var cardList = new List<CardData>();
                var allCards = FindAllAssets<CardData>("Assets/ScriptableObjects/Cards");
                foreach (var c in allCards)
                    if (c.era == type) cardList.Add(c);
                era.cards = cardList.ToArray();

                // Assign tools for this era
                var toolList = new List<ToolData>();
                var allTools = FindAllAssets<ToolData>("Assets/ScriptableObjects/Tools");
                foreach (var t in allTools)
                    if (t.era == type) toolList.Add(t);
                era.tools = toolList.ToArray();

                EditorUtility.SetDirty(era);
            }
        }

        // ============================================================
        // PLANETS
        // ============================================================
        static void CreatePlanets()
        {
            EnsureFolder("Assets/ScriptableObjects/Planets");

            var planet = CreateOrLoad<PlanetData>("Assets/ScriptableObjects/Planets/planet_porera.asset");
            planet.planetId = "planet_porera";
            planet.planetName = "Porera";
            planet.description = "El planeta natal. Aqui comienza tu viaje a traves de las eras.";
            planet.cardsPerEra = 9;

            var allEras = FindAllAssets<EraData>("Assets/ScriptableObjects/Eras");
            System.Array.Sort(allEras, (a, b) => a.eraType.CompareTo(b.eraType));
            planet.eras = allEras;

            EditorUtility.SetDirty(planet);
        }

        // ============================================================
        // SHOP ITEMS
        // ============================================================
        static void CreateShopItems()
        {
            EnsureFolder("Assets/ScriptableObjects/Shop");

            // Resource packs
            var stonePack = CreateOrLoad<ShopData>("Assets/ScriptableObjects/Shop/shop_stone_pack.asset");
            stonePack.itemId = "shop_stone_pack";
            stonePack.itemName = "Pack de Piedra";
            stonePack.description = "500 piedras al instante";
            stonePack.itemType = ShopItemType.ResourcePack;
            stonePack.currencyType = ShopCurrencyType.Diamonds;
            stonePack.price = 10;
            stonePack.resourceRewards = new ResourceCost[] { new ResourceCost { resourceType = ResourceType.Stone, amount = 500 } };
            EditorUtility.SetDirty(stonePack);

            var woodPack = CreateOrLoad<ShopData>("Assets/ScriptableObjects/Shop/shop_wood_pack.asset");
            woodPack.itemId = "shop_wood_pack";
            woodPack.itemName = "Pack de Madera";
            woodPack.description = "500 maderas al instante";
            woodPack.itemType = ShopItemType.ResourcePack;
            woodPack.currencyType = ShopCurrencyType.Diamonds;
            woodPack.price = 10;
            woodPack.resourceRewards = new ResourceCost[] { new ResourceCost { resourceType = ResourceType.Wood, amount = 500 } };
            EditorUtility.SetDirty(woodPack);

            // Chest
            var chest = CreateOrLoad<ShopData>("Assets/ScriptableObjects/Shop/shop_basic_chest.asset");
            chest.itemId = "shop_basic_chest";
            chest.itemName = "Cofre Basico";
            chest.description = "Contiene 1-3 items aleatorios";
            chest.itemType = ShopItemType.Chest;
            chest.currencyType = ShopCurrencyType.Diamonds;
            chest.price = 50;
            chest.chestMinItems = 1;
            chest.chestMaxItems = 3;
            chest.chestEpicChance = 0.1f;
            chest.chestLegendaryChance = 0.02f;
            EditorUtility.SetDirty(chest);

            // Boost
            var boost = CreateOrLoad<ShopData>("Assets/ScriptableObjects/Shop/shop_boost_2x.asset");
            boost.itemId = "shop_boost_2x";
            boost.itemName = "Boost x2 (30min)";
            boost.description = "Duplica la produccion por 30 minutos";
            boost.itemType = ShopItemType.Boost;
            boost.currencyType = ShopCurrencyType.Diamonds;
            boost.price = 20;
            boost.boostMultiplier = 2f;
            boost.boostDurationMinutes = 30f;
            EditorUtility.SetDirty(boost);

            // Ad reward
            var ad = CreateOrLoad<ShopData>("Assets/ScriptableObjects/Shop/shop_ad_reward.asset");
            ad.itemId = "shop_ad_reward";
            ad.itemName = "Ver Anuncio";
            ad.description = "Mira un anuncio y recibe diamantes gratis";
            ad.itemType = ShopItemType.AdReward;
            ad.currencyType = ShopCurrencyType.AdWatch;
            ad.price = 1;
            ad.diamondReward = 5;
            EditorUtility.SetDirty(ad);

            // Diamond pack
            var diamondPack = CreateOrLoad<ShopData>("Assets/ScriptableObjects/Shop/shop_diamond_100.asset");
            diamondPack.itemId = "shop_diamond_100";
            diamondPack.itemName = "100 Diamantes";
            diamondPack.description = "Compra 100 diamantes";
            diamondPack.itemType = ShopItemType.DiamondPack;
            diamondPack.currencyType = ShopCurrencyType.RealMoney;
            diamondPack.price = 0.99;
            diamondPack.diamondReward = 100;
            diamondPack.isFeatured = true;
            EditorUtility.SetDirty(diamondPack);
        }

        // ============================================================
        // CLAN EVENTS
        // ============================================================
        static void CreateClanEvents()
        {
            EnsureFolder("Assets/ScriptableObjects/ClanEvents");

            var collectEvent = CreateOrLoad<ClanEventData>("Assets/ScriptableObjects/ClanEvents/clan_event_collect.asset");
            collectEvent.eventId = "clan_event_collect";
            collectEvent.eventName = "Gran Recoleccion";
            collectEvent.description = "Recolecta recursos entre todo el clan";
            collectEvent.eventType = ClanEventType.CollectResources;
            collectEvent.targetAmount = 10000;
            collectEvent.durationHours = 48;
            collectEvent.diamondReward = 50;
            collectEvent.energyReward = 20;
            collectEvent.battlePassExpReward = 30;
            collectEvent.individualRewards = new ResourceCost[]
            {
                new ResourceCost { resourceType = ResourceType.Diamonds, amount = 20 }
            };
            collectEvent.clanRewards = new ResourceCost[]
            {
                new ResourceCost { resourceType = ResourceType.Energy, amount = 50 }
            };
            EditorUtility.SetDirty(collectEvent);

            var combatEvent = CreateOrLoad<ClanEventData>("Assets/ScriptableObjects/ClanEvents/clan_event_combat.asset");
            combatEvent.eventId = "clan_event_combat";
            combatEvent.eventName = "Caza Grupal";
            combatEvent.description = "Derroten enemigos juntos";
            combatEvent.eventType = ClanEventType.DefeatEnemies;
            combatEvent.targetAmount = 50;
            combatEvent.durationHours = 24;
            combatEvent.diamondReward = 30;
            combatEvent.energyReward = 15;
            combatEvent.battlePassExpReward = 20;
            combatEvent.individualRewards = new ResourceCost[]
            {
                new ResourceCost { resourceType = ResourceType.Diamonds, amount = 15 }
            };
            combatEvent.clanRewards = new ResourceCost[]
            {
                new ResourceCost { resourceType = ResourceType.Energy, amount = 30 }
            };
            EditorUtility.SetDirty(combatEvent);
        }

        // ============================================================
        // UI PREFABS
        // ============================================================
        static void CreateUIPrefabs()
        {
            EnsureFolder("Assets/Prefabs");

            // Structure Slot Prefab (for PlanetView)
            CreateButtonPrefab("Assets/Prefabs/StructureSlotPrefab.prefab", "StructureSlot", 200, 50, new Color(0.2f, 0.2f, 0.3f));

            // Structure Item Prefab (for StructurePanel list)
            CreateButtonPrefab("Assets/Prefabs/StructureItemPrefab.prefab", "StructureItem", 280, 45, new Color(0.25f, 0.2f, 0.15f));

            // Inventory Item Prefab (for Equipment)
            CreateButtonPrefab("Assets/Prefabs/InventoryItemPrefab.prefab", "InventoryItem", 80, 80, new Color(0.15f, 0.25f, 0.15f));

            // Card Item Prefab
            CreateButtonPrefab("Assets/Prefabs/CardItemPrefab.prefab", "CardItem", 90, 120, new Color(0.2f, 0.15f, 0.3f));

            // Shop Item Prefab
            CreateButtonPrefab("Assets/Prefabs/ShopItemPrefab.prefab", "ShopItem", 150, 60, new Color(0.3f, 0.25f, 0.1f));

            // Chest Item Prefab
            CreateButtonPrefab("Assets/Prefabs/ChestItemPrefab.prefab", "ChestItem", 150, 60, new Color(0.35f, 0.2f, 0.1f));

            // Member Item Prefab
            CreateButtonPrefab("Assets/Prefabs/MemberItemPrefab.prefab", "MemberItem", 250, 40, new Color(0.15f, 0.15f, 0.25f));

            // Upgrade Item Prefab (Prestige)
            CreateButtonPrefab("Assets/Prefabs/UpgradeItemPrefab.prefab", "UpgradeItem", 250, 50, new Color(0.3f, 0.1f, 0.3f));

            // Battle Pass Reward Prefab
            CreateButtonPrefab("Assets/Prefabs/BattlePassRewardPrefab.prefab", "BPReward", 120, 50, new Color(0.1f, 0.3f, 0.3f));
        }

        static void CreateButtonPrefab(string path, string name, float width, float height, Color bgColor)
        {
            var go = new GameObject(name, typeof(RectTransform), typeof(CanvasRenderer), typeof(Image), typeof(Button));
            var rt = go.GetComponent<RectTransform>();
            rt.sizeDelta = new Vector2(width, height);
            var img = go.GetComponent<Image>();
            img.color = bgColor;

            // Add a text child
            var textGO = new GameObject("Text", typeof(RectTransform), typeof(CanvasRenderer), typeof(Text));
            textGO.transform.SetParent(go.transform, false);
            var textRT = textGO.GetComponent<RectTransform>();
            textRT.anchorMin = Vector2.zero;
            textRT.anchorMax = Vector2.one;
            textRT.offsetMin = new Vector2(5, 2);
            textRT.offsetMax = new Vector2(-5, -2);
            var text = textGO.GetComponent<Text>();
            text.text = name;
            text.color = Color.white;
            text.fontSize = 12;
            text.alignment = TextAnchor.MiddleCenter;
            text.resizeTextForBestFit = true;
            text.resizeTextMinSize = 8;
            text.resizeTextMaxSize = 14;

            PrefabUtility.SaveAsPrefabAsset(go, path);
            Object.DestroyImmediate(go);
        }

        // ============================================================
        // SCENE SETUP
        // ============================================================
        static void SetupMainScene()
        {
            // Check if GameManager already exists
            if (Object.FindObjectOfType<GameManager>() != null)
            {
                Debug.Log("[Evolvion] La escena ya tiene un GameManager. Saltando setup de escena.");
                return;
            }

            // === GAME MANAGER ===
            var gmGO = new GameObject("GameManager");
            var gm = gmGO.AddComponent<GameManager>();
            var db = gmGO.AddComponent<GameDatabase>();
            var save = gmGO.AddComponent<SaveSystem>();
            var time = gmGO.AddComponent<TimeManager>();

            // Systems
            var resSys = gmGO.AddComponent<ResourceSystem>();
            var structSys = gmGO.AddComponent<StructureSystem>();
            var planetSys = gmGO.AddComponent<PlanetSystem>();
            var toolSys = gmGO.AddComponent<ToolSystem>();
            var equipSys = gmGO.AddComponent<EquipmentSystem>();
            var combatSys = gmGO.AddComponent<CombatSystem>();
            var cardSys = gmGO.AddComponent<CardSystem>();
            var prestigeSys = gmGO.AddComponent<PrestigeSystem>();
            var achieveSys = gmGO.AddComponent<AchievementSystem>();
            var shopSys = gmGO.AddComponent<ShopSystem>();
            var clanSys = gmGO.AddComponent<ClanSystem>();

            // Assign references
            gm.database = db;
            gm.saveSystem = save;
            gm.timeManager = time;
            gm.resourceSystem = resSys;
            gm.structureSystem = structSys;
            gm.planetSystem = planetSys;
            gm.toolSystem = toolSys;
            gm.equipmentSystem = equipSys;
            gm.combatSystem = combatSys;
            gm.cardSystem = cardSys;
            gm.prestigeSystem = prestigeSys;
            gm.achievementSystem = achieveSys;
            gm.shopSystem = shopSys;
            gm.clanSystem = clanSys;

            // Populate ShopSystem and ClanSystem catalogs
            shopSys.shopItems = FindAllAssets<ShopData>("Assets/ScriptableObjects/Shop");
            shopSys.battlePassRewards = FindAllAssets<BattlePassRewardData>("Assets/ScriptableObjects/Shop");
            clanSys.availableClanEvents = FindAllAssets<ClanEventData>("Assets/ScriptableObjects/ClanEvents");

            // Populate GameDatabase
            db.planets = FindAllAssets<PlanetData>("Assets/ScriptableObjects/Planets");
            db.eras = FindAllAssets<EraData>("Assets/ScriptableObjects/Eras");
            db.structures = FindAllAssets<StructureData>("Assets/ScriptableObjects/Structures");
            db.tools = FindAllAssets<ToolData>("Assets/ScriptableObjects/Tools");
            db.enemies = FindAllAssets<EnemyData>("Assets/ScriptableObjects/Enemies");
            db.equipment = FindAllAssets<EquipmentData>("Assets/ScriptableObjects/Equipment");
            db.cards = FindAllAssets<CardData>("Assets/ScriptableObjects/Cards");

            // === EVENT SYSTEM ===
            if (Object.FindObjectOfType<EventSystem>() == null)
            {
                var esGO = new GameObject("EventSystem");
                esGO.AddComponent<EventSystem>();
                esGO.AddComponent<StandaloneInputModule>();
            }

            // === MAIN CANVAS ===
            var canvasGO = new GameObject("MainCanvas");
            var canvas = canvasGO.AddComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvas.sortingOrder = 0;
            var scaler = canvasGO.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;
            canvasGO.AddComponent<GraphicRaycaster>();

            // UI Manager
            var uiManager = canvasGO.AddComponent<UIManager>();

            // Create panels
            var hudPanel = CreatePanel(canvasGO.transform, "HUDPanel", Color.clear);
            var planetPanel = CreatePanel(canvasGO.transform, "PlanetPanel", new Color(0.05f, 0.05f, 0.1f, 0.95f));
            var structurePanel = CreatePanel(canvasGO.transform, "StructurePanel", new Color(0.08f, 0.05f, 0.02f, 0.95f));
            var combatPanel = CreatePanel(canvasGO.transform, "CombatPanel", new Color(0.1f, 0.02f, 0.02f, 0.95f));
            var equipmentPanel = CreatePanel(canvasGO.transform, "EquipmentPanel", new Color(0.02f, 0.08f, 0.02f, 0.95f));
            var cardAlbumPanel = CreatePanel(canvasGO.transform, "CardAlbumPanel", new Color(0.05f, 0.02f, 0.1f, 0.95f));
            var prestigePanel = CreatePanel(canvasGO.transform, "PrestigePanel", new Color(0.1f, 0.02f, 0.1f, 0.95f));
            var popupPanel = CreatePanel(canvasGO.transform, "PopupPanel", Color.clear);
            var shopPanel = CreatePanel(canvasGO.transform, "ShopPanel", new Color(0.1f, 0.08f, 0.02f, 0.95f));
            var clanPanel = CreatePanel(canvasGO.transform, "ClanPanel", new Color(0.02f, 0.05f, 0.1f, 0.95f));

            // Assign to UIManager
            uiManager.hudPanel = hudPanel;
            uiManager.planetPanel = planetPanel;
            uiManager.structurePanel = structurePanel;
            uiManager.combatPanel = combatPanel;
            uiManager.equipmentPanel = equipmentPanel;
            uiManager.cardAlbumPanel = cardAlbumPanel;
            uiManager.prestigePanel = prestigePanel;
            uiManager.popupPanel = popupPanel;
            uiManager.shopPanel = shopPanel;
            uiManager.clanPanel = clanPanel;

            // === HUD SETUP ===
            var hudCtrl = hudPanel.AddComponent<HUDController>();
            SetupHUD(hudPanel.transform, hudCtrl, uiManager);

            // === PLANET VIEW SETUP ===
            var planetCtrl = planetPanel.AddComponent<PlanetViewController>();
            SetupPlanetView(planetPanel.transform, planetCtrl);

            // === STRUCTURE PANEL SETUP ===
            var structCtrl = structurePanel.AddComponent<StructurePanelUI>();
            SetupStructurePanel(structurePanel.transform, structCtrl);

            // === COMBAT PANEL SETUP ===
            var combatCtrl = combatPanel.AddComponent<CombatUI>();
            SetupCombatPanel(combatPanel.transform, combatCtrl, uiManager);

            // === EQUIPMENT PANEL SETUP ===
            var equipCtrl = equipmentPanel.AddComponent<EquipmentUI>();
            SetupEquipmentPanel(equipmentPanel.transform, equipCtrl);

            // === CARD ALBUM SETUP ===
            var cardCtrl = cardAlbumPanel.AddComponent<CardAlbumUI>();
            SetupCardAlbumPanel(cardAlbumPanel.transform, cardCtrl);

            // === PRESTIGE PANEL SETUP ===
            var prestCtrl = prestigePanel.AddComponent<PrestigeUI>();
            SetupPrestigePanel(prestigePanel.transform, prestCtrl);

            // === POPUP SETUP ===
            var popupCtrl = popupPanel.AddComponent<PopupController>();
            SetupPopupPanel(popupPanel.transform, popupCtrl);

            // === SHOP PANEL SETUP ===
            var shopCtrl = shopPanel.AddComponent<ShopUI>();
            SetupShopPanel(shopPanel.transform, shopCtrl);

            // === CLAN PANEL SETUP ===
            var clanCtrl = clanPanel.AddComponent<ClanUI>();
            SetupClanPanel(clanPanel.transform, clanCtrl);

            // Mark scene dirty
            UnityEditor.SceneManagement.EditorSceneManager.MarkSceneDirty(
                UnityEditor.SceneManagement.EditorSceneManager.GetActiveScene());

            Debug.Log("[Evolvion] Escena configurada. Guarda la escena con Ctrl+S!");
        }

        // ============================================================
        // HUD SETUP
        // ============================================================
        static void SetupHUD(Transform parent, HUDController ctrl, UIManager uiManager)
        {
            // Top bar with resources
            var topBar = CreateUIElement(parent, "TopBar", new Vector2(0, 0), new Vector2(1, 1),
                new Vector2(0, -40), new Vector2(0, -10), new Color(0.1f, 0.1f, 0.15f, 0.9f));

            // Resource texts
            ctrl.stoneText = CreateText(topBar.transform, "StoneText", "Stone: 0", TextAnchor.MiddleLeft,
                new Vector2(0, 0.5f), new Vector2(0.16f, 1f), new Vector2(10, 0), new Vector2(0, 0)).GetComponent<Text>();
            ctrl.woodText = CreateText(topBar.transform, "WoodText", "Wood: 0", TextAnchor.MiddleLeft,
                new Vector2(0.16f, 0.5f), new Vector2(0.33f, 1f), new Vector2(0, 0), new Vector2(0, 0)).GetComponent<Text>();
            ctrl.foodText = CreateText(topBar.transform, "FoodText", "Food: 0", TextAnchor.MiddleLeft,
                new Vector2(0.33f, 0.5f), new Vector2(0.5f, 1f), new Vector2(0, 0), new Vector2(0, 0)).GetComponent<Text>();
            ctrl.bronzeText = CreateText(topBar.transform, "BronzeText", "Bronze: 0", TextAnchor.MiddleLeft,
                new Vector2(0, 0), new Vector2(0.16f, 0.5f), new Vector2(10, 0), new Vector2(0, 0)).GetComponent<Text>();
            ctrl.energyText = CreateText(topBar.transform, "EnergyText", "Energy: 0", TextAnchor.MiddleLeft,
                new Vector2(0.16f, 0), new Vector2(0.33f, 0.5f), new Vector2(0, 0), new Vector2(0, 0)).GetComponent<Text>();
            ctrl.diamondText = CreateText(topBar.transform, "DiamondText", "Diamonds: 0", TextAnchor.MiddleLeft,
                new Vector2(0.33f, 0), new Vector2(0.5f, 0.5f), new Vector2(0, 0), new Vector2(0, 0)).GetComponent<Text>();

            // Era info
            ctrl.eraText = CreateText(topBar.transform, "EraText", "Edad de Piedra", TextAnchor.MiddleCenter,
                new Vector2(0.55f, 0.5f), new Vector2(0.85f, 1f), new Vector2(0, 0), new Vector2(0, 0)).GetComponent<Text>();
            ctrl.arisLevelText = CreateText(topBar.transform, "ArisLevelText", "Aris Nv.1", TextAnchor.MiddleCenter,
                new Vector2(0.85f, 0.5f), new Vector2(1f, 1f), new Vector2(0, -5), new Vector2(-5, 0)).GetComponent<Text>();

            // Era progress slider
            var sliderGO = new GameObject("EraProgressSlider", typeof(RectTransform), typeof(Slider));
            sliderGO.transform.SetParent(topBar.transform, false);
            var sliderRT = sliderGO.GetComponent<RectTransform>();
            sliderRT.anchorMin = new Vector2(0.55f, 0f);
            sliderRT.anchorMax = new Vector2(1f, 0.45f);
            sliderRT.offsetMin = new Vector2(5, 5);
            sliderRT.offsetMax = new Vector2(-5, -2);

            // Slider background
            var sliderBg = CreateUIElement(sliderGO.transform, "Background", Vector2.zero, Vector2.one,
                Vector2.zero, Vector2.zero, new Color(0.2f, 0.2f, 0.2f));
            var fillArea = new GameObject("Fill Area", typeof(RectTransform));
            fillArea.transform.SetParent(sliderGO.transform, false);
            var fillAreaRT = fillArea.GetComponent<RectTransform>();
            fillAreaRT.anchorMin = Vector2.zero;
            fillAreaRT.anchorMax = Vector2.one;
            fillAreaRT.offsetMin = Vector2.zero;
            fillAreaRT.offsetMax = Vector2.zero;
            var fill = CreateUIElement(fillArea.transform, "Fill", Vector2.zero, new Vector2(0.5f, 1),
                Vector2.zero, Vector2.zero, new Color(0.2f, 0.6f, 0.2f));

            var slider = sliderGO.GetComponent<Slider>();
            slider.fillRect = fill.GetComponent<RectTransform>();
            slider.interactable = false;
            ctrl.eraProgressSlider = slider;

            // Bottom bar with navigation buttons
            var bottomBar = CreateUIElement(parent, "BottomBar", new Vector2(0, 0), new Vector2(1, 0),
                new Vector2(0, 0), new Vector2(0, 70), new Color(0.1f, 0.1f, 0.15f, 0.95f));

            string[] btnNames = { "Estructuras", "Combate", "Equipo", "Cartas", "Prestigio", "Tienda", "Clan", "Avanzar Era" };
            for (int i = 0; i < btnNames.Length; i++)
            {
                float xMin = (float)i / btnNames.Length;
                float xMax = (float)(i + 1) / btnNames.Length;
                var btn = CreateButton(bottomBar.transform, btnNames[i] + "Btn", btnNames[i],
                    new Vector2(xMin, 0), new Vector2(xMax, 1), new Vector2(2, 5), new Vector2(-2, -5),
                    new Color(0.2f, 0.25f, 0.35f));

                var buttonComp = btn.GetComponent<Button>();
                switch (i)
                {
                    case 0: ctrl.structuresButton = buttonComp; break;
                    case 1: ctrl.combatButton = buttonComp; break;
                    case 2: ctrl.equipmentButton = buttonComp; break;
                    case 3: ctrl.cardsButton = buttonComp; break;
                    case 4: ctrl.prestigeButton = buttonComp; break;
                    case 5:
                        buttonComp.onClick.AddListener(() => uiManager.ShowOnlyPanel(PanelType.Shop));
                        break;
                    case 6:
                        buttonComp.onClick.AddListener(() => uiManager.ShowOnlyPanel(PanelType.Clan));
                        break;
                    case 7: ctrl.advanceEraButton = buttonComp; break;
                }
            }
        }

        // ============================================================
        // PLANET VIEW SETUP
        // ============================================================
        static void SetupPlanetView(Transform parent, PlanetViewController ctrl)
        {
            // Title area
            var title = CreateText(parent, "PlanetName", "Porera", TextAnchor.MiddleCenter,
                new Vector2(0.1f, 0.88f), new Vector2(0.9f, 0.95f), Vector2.zero, Vector2.zero);
            ctrl.planetNameText = title.GetComponent<Text>();
            title.GetComponent<Text>().fontSize = 24;

            var eraName = CreateText(parent, "EraName", "Edad de Piedra", TextAnchor.MiddleCenter,
                new Vector2(0.2f, 0.83f), new Vector2(0.8f, 0.88f), Vector2.zero, Vector2.zero);
            ctrl.eraNameText = eraName.GetComponent<Text>();

            // Structure container with vertical layout
            var container = new GameObject("StructureContainer", typeof(RectTransform), typeof(VerticalLayoutGroup), typeof(ContentSizeFitter));
            container.transform.SetParent(parent, false);
            var contRT = container.GetComponent<RectTransform>();
            contRT.anchorMin = new Vector2(0.05f, 0.15f);
            contRT.anchorMax = new Vector2(0.95f, 0.82f);
            contRT.offsetMin = Vector2.zero;
            contRT.offsetMax = Vector2.zero;
            var vlg = container.GetComponent<VerticalLayoutGroup>();
            vlg.spacing = 8;
            vlg.childForceExpandWidth = true;
            vlg.childForceExpandHeight = false;
            vlg.childControlWidth = true;
            vlg.childControlHeight = false;

            ctrl.structureContainer = container.transform;

            // Load prefab
            var prefab = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Prefabs/StructureSlotPrefab.prefab");
            ctrl.structureSlotPrefab = prefab;
        }

        // ============================================================
        // STRUCTURE PANEL SETUP
        // ============================================================
        static void SetupStructurePanel(Transform parent, StructurePanelUI ctrl)
        {
            var title = CreateText(parent, "Title", "ESTRUCTURAS", TextAnchor.MiddleCenter,
                new Vector2(0.1f, 0.92f), new Vector2(0.7f, 0.98f), Vector2.zero, Vector2.zero);
            title.GetComponent<Text>().fontSize = 22;

            // Close button
            var closeBtn = CreateButton(parent, "CloseBtn", "X",
                new Vector2(0.85f, 0.93f), new Vector2(0.95f, 0.98f), Vector2.zero, Vector2.zero,
                new Color(0.5f, 0.1f, 0.1f));
            ctrl.closeButton = closeBtn.GetComponent<Button>();

            // List container
            var scrollView = CreateScrollView(parent, "StructureList",
                new Vector2(0.05f, 0.35f), new Vector2(0.95f, 0.92f));
            ctrl.structureListContainer = scrollView.transform.Find("Viewport/Content");

            var prefab = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Prefabs/StructureItemPrefab.prefab");
            ctrl.structureItemPrefab = prefab;

            // Detail panel
            var detailPanel = CreateUIElement(parent, "DetailPanel",
                new Vector2(0.05f, 0.05f), new Vector2(0.95f, 0.33f),
                Vector2.zero, Vector2.zero, new Color(0.15f, 0.12f, 0.08f, 0.95f));
            ctrl.detailPanel = detailPanel;

            ctrl.detailNameText = CreateText(detailPanel.transform, "DetailName", "Nombre", TextAnchor.MiddleCenter,
                new Vector2(0.05f, 0.75f), new Vector2(0.95f, 0.95f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.detailLevelText = CreateText(detailPanel.transform, "DetailLevel", "Nivel: 0", TextAnchor.MiddleLeft,
                new Vector2(0.05f, 0.55f), new Vector2(0.5f, 0.75f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.detailProductionText = CreateText(detailPanel.transform, "DetailProd", "+0/s", TextAnchor.MiddleLeft,
                new Vector2(0.5f, 0.55f), new Vector2(0.95f, 0.75f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.detailCostText = CreateText(detailPanel.transform, "DetailCost", "Costo: 0", TextAnchor.MiddleLeft,
                new Vector2(0.05f, 0.35f), new Vector2(0.95f, 0.55f), Vector2.zero, Vector2.zero).GetComponent<Text>();

            var buildBtn = CreateButton(detailPanel.transform, "BuildUpgradeBtn", "Construir",
                new Vector2(0.2f, 0.05f), new Vector2(0.8f, 0.3f), new Vector2(0, 0), new Vector2(0, 0),
                new Color(0.1f, 0.4f, 0.1f));
            ctrl.buildUpgradeButton = buildBtn.GetComponent<Button>();
            ctrl.buildUpgradeButtonText = buildBtn.GetComponentInChildren<Text>();
        }

        // ============================================================
        // COMBAT PANEL SETUP
        // ============================================================
        static void SetupCombatPanel(Transform parent, CombatUI ctrl, UIManager uiManager)
        {
            var title = CreateText(parent, "Title", "COMBATE", TextAnchor.MiddleCenter,
                new Vector2(0.1f, 0.92f), new Vector2(0.9f, 0.98f), Vector2.zero, Vector2.zero);
            title.GetComponent<Text>().fontSize = 22;

            // Aris info
            ctrl.arisNameText = CreateText(parent, "ArisName", "Aris", TextAnchor.MiddleCenter,
                new Vector2(0.05f, 0.82f), new Vector2(0.45f, 0.88f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.arisStatsText = CreateText(parent, "ArisStats", "ATK:0 DEF:0 HP:0", TextAnchor.MiddleCenter,
                new Vector2(0.05f, 0.88f), new Vector2(0.45f, 0.92f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.arisHPText = CreateText(parent, "ArisHP", "HP: 100/100", TextAnchor.MiddleCenter,
                new Vector2(0.05f, 0.76f), new Vector2(0.45f, 0.82f), Vector2.zero, Vector2.zero).GetComponent<Text>();

            var arisSliderGO = CreateSlider(parent, "ArisHPBar",
                new Vector2(0.05f, 0.72f), new Vector2(0.45f, 0.76f), new Color(0.2f, 0.7f, 0.2f));
            ctrl.arisHPBar = arisSliderGO.GetComponent<Slider>();

            // Enemy info
            ctrl.enemyNameText = CreateText(parent, "EnemyName", "Enemigo", TextAnchor.MiddleCenter,
                new Vector2(0.55f, 0.82f), new Vector2(0.95f, 0.88f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.enemyHPText = CreateText(parent, "EnemyHP", "HP: 50/50", TextAnchor.MiddleCenter,
                new Vector2(0.55f, 0.76f), new Vector2(0.95f, 0.82f), Vector2.zero, Vector2.zero).GetComponent<Text>();

            var enemySliderGO = CreateSlider(parent, "EnemyHPBar",
                new Vector2(0.55f, 0.72f), new Vector2(0.95f, 0.76f), new Color(0.7f, 0.2f, 0.2f));
            ctrl.enemyHPBar = enemySliderGO.GetComponent<Slider>();

            // Combat log and rewards
            ctrl.combatLogText = CreateText(parent, "CombatLog", "Esperando combate...", TextAnchor.UpperLeft,
                new Vector2(0.05f, 0.25f), new Vector2(0.95f, 0.70f), new Vector2(10, 10), new Vector2(-10, -10)).GetComponent<Text>();
            ctrl.combatLogText.fontSize = 11;
            ctrl.rewardsText = CreateText(parent, "RewardsText", "", TextAnchor.MiddleCenter,
                new Vector2(0.05f, 0.20f), new Vector2(0.95f, 0.25f), Vector2.zero, Vector2.zero).GetComponent<Text>();

            // Result panel
            var resultPanel = CreateUIElement(parent, "ResultPanel",
                new Vector2(0.15f, 0.35f), new Vector2(0.85f, 0.65f),
                Vector2.zero, Vector2.zero, new Color(0.05f, 0.05f, 0.1f, 0.95f));
            ctrl.resultPanel = resultPanel;
            ctrl.resultTitleText = CreateText(resultPanel.transform, "ResultTitle", "Victoria!", TextAnchor.MiddleCenter,
                new Vector2(0.1f, 0.5f), new Vector2(0.9f, 0.9f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.resultTitleText.fontSize = 20;
            ctrl.resultDetailsText = CreateText(resultPanel.transform, "ResultDetails", "", TextAnchor.MiddleCenter,
                new Vector2(0.1f, 0.1f), new Vector2(0.9f, 0.5f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            resultPanel.SetActive(false);

            // Buttons
            var startBtn = CreateButton(parent, "StartCombatBtn", "Iniciar Combate",
                new Vector2(0.1f, 0.08f), new Vector2(0.35f, 0.18f), Vector2.zero, Vector2.zero,
                new Color(0.1f, 0.4f, 0.1f));
            ctrl.startCombatButton = startBtn.GetComponent<Button>();

            var endBtn = CreateButton(parent, "EndCombatBtn", "Terminar",
                new Vector2(0.37f, 0.08f), new Vector2(0.63f, 0.18f), Vector2.zero, Vector2.zero,
                new Color(0.4f, 0.3f, 0.1f));
            ctrl.endCombatButton = endBtn.GetComponent<Button>();

            var closeBtn = CreateButton(parent, "CloseCombatBtn", "Volver",
                new Vector2(0.65f, 0.08f), new Vector2(0.9f, 0.18f), Vector2.zero, Vector2.zero,
                new Color(0.4f, 0.1f, 0.1f));
            ctrl.closeButton = closeBtn.GetComponent<Button>();
        }

        // ============================================================
        // EQUIPMENT PANEL SETUP
        // ============================================================
        static void SetupEquipmentPanel(Transform parent, EquipmentUI ctrl)
        {
            var title = CreateText(parent, "Title", "EQUIPAMIENTO", TextAnchor.MiddleCenter,
                new Vector2(0.1f, 0.92f), new Vector2(0.9f, 0.98f), Vector2.zero, Vector2.zero);
            title.GetComponent<Text>().fontSize = 22;

            // Equipped slots (container with Image + child Text)
            var helmetSlot = CreateUIElement(parent, "Slot_Casco",
                new Vector2(0.01f, 0.78f), new Vector2(0.24f, 0.90f), Vector2.zero, Vector2.zero, new Color(0.15f, 0.2f, 0.15f, 0.5f));
            ctrl.helmetText = CreateText(helmetSlot.transform, "Text", "[Casco]\nVacio", TextAnchor.MiddleCenter,
                Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.helmetText.fontSize = 10;

            var weaponSlot = CreateUIElement(parent, "Slot_Arma",
                new Vector2(0.26f, 0.78f), new Vector2(0.49f, 0.90f), Vector2.zero, Vector2.zero, new Color(0.15f, 0.2f, 0.15f, 0.5f));
            ctrl.weaponText = CreateText(weaponSlot.transform, "Text", "[Arma]\nVacio", TextAnchor.MiddleCenter,
                Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.weaponText.fontSize = 10;

            var armorSlot = CreateUIElement(parent, "Slot_Armadura",
                new Vector2(0.51f, 0.78f), new Vector2(0.74f, 0.90f), Vector2.zero, Vector2.zero, new Color(0.15f, 0.2f, 0.15f, 0.5f));
            ctrl.armorText = CreateText(armorSlot.transform, "Text", "[Armadura]\nVacio", TextAnchor.MiddleCenter,
                Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.armorText.fontSize = 10;

            var gadgetSlot = CreateUIElement(parent, "Slot_Gadget",
                new Vector2(0.76f, 0.78f), new Vector2(0.99f, 0.90f), Vector2.zero, Vector2.zero, new Color(0.15f, 0.2f, 0.15f, 0.5f));
            ctrl.gadgetText = CreateText(gadgetSlot.transform, "Text", "[Gadget]\nVacio", TextAnchor.MiddleCenter,
                Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.gadgetText.fontSize = 10;

            // Inventory scroll
            var scrollView = CreateScrollView(parent, "InventoryList",
                new Vector2(0.05f, 0.30f), new Vector2(0.95f, 0.76f));
            ctrl.inventoryContainer = scrollView.transform.Find("Viewport/Content");
            ctrl.inventoryItemPrefab = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Prefabs/InventoryItemPrefab.prefab");

            // Detail panel
            var detailPanel = CreateUIElement(parent, "DetailPanel",
                new Vector2(0.05f, 0.05f), new Vector2(0.95f, 0.28f),
                Vector2.zero, Vector2.zero, new Color(0.12f, 0.15f, 0.12f, 0.95f));
            ctrl.detailPanel = detailPanel;

            ctrl.detailNameText = CreateText(detailPanel.transform, "DetailName", "Nombre", TextAnchor.MiddleCenter,
                new Vector2(0.05f, 0.75f), new Vector2(0.95f, 0.95f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.detailRarityText = CreateText(detailPanel.transform, "DetailRarity", "Rareza: Comun", TextAnchor.MiddleLeft,
                new Vector2(0.05f, 0.55f), new Vector2(0.5f, 0.75f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.detailStatsText = CreateText(detailPanel.transform, "DetailStats", "ATK:0 DEF:0 HP:0", TextAnchor.MiddleLeft,
                new Vector2(0.5f, 0.55f), new Vector2(0.95f, 0.75f), Vector2.zero, Vector2.zero).GetComponent<Text>();

            // Fusion info
            ctrl.fuseInfoText = CreateText(detailPanel.transform, "FuseInfo", "0/3 para fusion", TextAnchor.MiddleCenter,
                new Vector2(0.05f, 0.35f), new Vector2(0.95f, 0.55f), Vector2.zero, Vector2.zero).GetComponent<Text>();

            // Buttons row
            var equipBtn = CreateButton(detailPanel.transform, "EquipBtn", "Equipar",
                new Vector2(0.02f, 0.02f), new Vector2(0.25f, 0.32f), Vector2.zero, Vector2.zero,
                new Color(0.1f, 0.3f, 0.4f));
            ctrl.equipButton = equipBtn.GetComponent<Button>();

            var fuseBtn = CreateButton(detailPanel.transform, "FuseBtn", "Fusionar",
                new Vector2(0.27f, 0.02f), new Vector2(0.50f, 0.32f), Vector2.zero, Vector2.zero,
                new Color(0.4f, 0.2f, 0.4f));
            ctrl.fuseButton = fuseBtn.GetComponent<Button>();

            var recycleBtn = CreateButton(detailPanel.transform, "RecycleBtn", "Reciclar",
                new Vector2(0.52f, 0.02f), new Vector2(0.75f, 0.32f), Vector2.zero, Vector2.zero,
                new Color(0.3f, 0.3f, 0.1f));
            ctrl.recycleButton = recycleBtn.GetComponent<Button>();

            // Close button (top right of main panel)
            var closeBtn = CreateButton(parent, "CloseBtn", "X",
                new Vector2(0.90f, 0.93f), new Vector2(0.98f, 0.98f), Vector2.zero, Vector2.zero,
                new Color(0.4f, 0.1f, 0.1f));
            ctrl.closeButton = closeBtn.GetComponent<Button>();
        }

        // ============================================================
        // CARD ALBUM SETUP
        // ============================================================
        static void SetupCardAlbumPanel(Transform parent, CardAlbumUI ctrl)
        {
            // Album title
            ctrl.albumTitleText = CreateText(parent, "AlbumTitle", "ALBUM DE CARTAS", TextAnchor.MiddleCenter,
                new Vector2(0.1f, 0.92f), new Vector2(0.9f, 0.98f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.albumTitleText.fontSize = 22;

            // Era tabs (individual fields)
            var tabContainer = CreateUIElement(parent, "TabContainer",
                new Vector2(0.05f, 0.85f), new Vector2(0.95f, 0.92f),
                Vector2.zero, Vector2.zero, Color.clear);

            var stoneTab = CreateButton(tabContainer.transform, "Tab_Piedra", "Piedra",
                new Vector2(0, 0), new Vector2(0.33f, 1), new Vector2(2, 0), new Vector2(-2, 0),
                new Color(0.15f, 0.1f, 0.25f));
            ctrl.stoneAgeTab = stoneTab.GetComponent<Button>();

            var tribalTab = CreateButton(tabContainer.transform, "Tab_Tribal", "Tribal",
                new Vector2(0.33f, 0), new Vector2(0.66f, 1), new Vector2(2, 0), new Vector2(-2, 0),
                new Color(0.15f, 0.1f, 0.25f));
            ctrl.tribalAgeTab = tribalTab.GetComponent<Button>();

            var bronzeTab = CreateButton(tabContainer.transform, "Tab_Bronce", "Bronce",
                new Vector2(0.66f, 0), new Vector2(1f, 1), new Vector2(2, 0), new Vector2(-2, 0),
                new Color(0.15f, 0.1f, 0.25f));
            ctrl.bronzeAgeTab = bronzeTab.GetComponent<Button>();

            // Progress
            ctrl.progressText = CreateText(parent, "ProgressText", "0/9 cartas", TextAnchor.MiddleCenter,
                new Vector2(0.1f, 0.80f), new Vector2(0.7f, 0.85f), Vector2.zero, Vector2.zero).GetComponent<Text>();

            var progressSliderGO = CreateSlider(parent, "ProgressSlider",
                new Vector2(0.7f, 0.80f), new Vector2(0.95f, 0.85f), new Color(0.6f, 0.4f, 0.8f));
            ctrl.progressSlider = progressSliderGO.GetComponent<Slider>();

            // Card grid
            var scrollView = CreateScrollView(parent, "CardGrid",
                new Vector2(0.05f, 0.20f), new Vector2(0.95f, 0.79f));
            ctrl.cardGridContainer = scrollView.transform.Find("Viewport/Content");
            // Replace VerticalLayout with GridLayout on content
            Object.DestroyImmediate(ctrl.cardGridContainer.GetComponent<VerticalLayoutGroup>());
            var gridLayout = ctrl.cardGridContainer.gameObject.AddComponent<GridLayoutGroup>();
            gridLayout.cellSize = new Vector2(90, 120);
            gridLayout.spacing = new Vector2(10, 10);
            gridLayout.padding = new RectOffset(10, 10, 10, 10);

            ctrl.cardItemPrefab = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Prefabs/CardItemPrefab.prefab");

            // Card detail panel
            var cardDetail = CreateUIElement(parent, "CardDetailPanel",
                new Vector2(0.15f, 0.30f), new Vector2(0.85f, 0.70f),
                Vector2.zero, Vector2.zero, new Color(0.1f, 0.05f, 0.15f, 0.98f));
            ctrl.cardDetailPanel = cardDetail;
            ctrl.cardNameText = CreateText(cardDetail.transform, "CardName", "Nombre", TextAnchor.MiddleCenter,
                new Vector2(0.05f, 0.75f), new Vector2(0.95f, 0.95f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.cardDescriptionText = CreateText(cardDetail.transform, "CardDesc", "Descripcion", TextAnchor.MiddleCenter,
                new Vector2(0.05f, 0.45f), new Vector2(0.95f, 0.75f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.cardRarityText = CreateText(cardDetail.transform, "CardRarity", "Rareza: Comun", TextAnchor.MiddleCenter,
                new Vector2(0.05f, 0.25f), new Vector2(0.95f, 0.45f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            cardDetail.SetActive(false);

            // Close button
            var closeBtn = CreateButton(parent, "CloseBtn", "Volver",
                new Vector2(0.35f, 0.05f), new Vector2(0.65f, 0.13f), Vector2.zero, Vector2.zero,
                new Color(0.4f, 0.1f, 0.1f));
            ctrl.closeButton = closeBtn.GetComponent<Button>();
        }

        // ============================================================
        // PRESTIGE PANEL SETUP
        // ============================================================
        static void SetupPrestigePanel(Transform parent, PrestigeUI ctrl)
        {
            var title = CreateText(parent, "Title", "PRESTIGIO", TextAnchor.MiddleCenter,
                new Vector2(0.1f, 0.92f), new Vector2(0.9f, 0.98f), Vector2.zero, Vector2.zero);
            title.GetComponent<Text>().fontSize = 22;

            ctrl.prestigeLevelText = CreateText(parent, "PrestigeLevel", "Nivel de Prestigio: 0", TextAnchor.MiddleCenter,
                new Vector2(0.05f, 0.85f), new Vector2(0.95f, 0.91f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.multiplierText = CreateText(parent, "Multiplier", "Multiplicador: x1.0", TextAnchor.MiddleCenter,
                new Vector2(0.05f, 0.79f), new Vector2(0.95f, 0.85f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.productionText = CreateText(parent, "Production", "Produccion: 0/s", TextAnchor.MiddleCenter,
                new Vector2(0.05f, 0.73f), new Vector2(0.95f, 0.79f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.currentResourcesText = CreateText(parent, "CurrentRes", "Recursos actuales: 0", TextAnchor.MiddleCenter,
                new Vector2(0.05f, 0.67f), new Vector2(0.95f, 0.73f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.accumulatedResourcesText = CreateText(parent, "AccumulatedRes", "Acumulados: 0", TextAnchor.MiddleCenter,
                new Vector2(0.05f, 0.61f), new Vector2(0.95f, 0.67f), Vector2.zero, Vector2.zero).GetComponent<Text>();

            // Prestige preview
            ctrl.prestigeGainPreviewText = CreateText(parent, "Preview", "Prestigio al reiniciar: +0", TextAnchor.MiddleCenter,
                new Vector2(0.05f, 0.54f), new Vector2(0.95f, 0.61f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.prestigeGainPreviewText.fontSize = 12;
            ctrl.prestigeGainPreviewText.color = Color.yellow;

            // Upgrades scroll
            var scrollView = CreateScrollView(parent, "UpgradeList",
                new Vector2(0.05f, 0.25f), new Vector2(0.95f, 0.53f));
            ctrl.upgradeContainer = scrollView.transform.Find("Viewport/Content");
            ctrl.upgradeItemPrefab = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Prefabs/UpgradeItemPrefab.prefab");

            // Buttons
            var resetBtn = CreateButton(parent, "ResetBtn", "PRESTIGIAR",
                new Vector2(0.05f, 0.08f), new Vector2(0.32f, 0.20f), Vector2.zero, Vector2.zero,
                new Color(0.5f, 0.1f, 0.5f));
            ctrl.prestigeResetButton = resetBtn.GetComponent<Button>();

            var startStopBtn = CreateButton(parent, "StartStopBtn", "Iniciar",
                new Vector2(0.34f, 0.08f), new Vector2(0.65f, 0.20f), Vector2.zero, Vector2.zero,
                new Color(0.3f, 0.1f, 0.3f));
            ctrl.startStopButton = startStopBtn.GetComponent<Button>();
            ctrl.startStopButtonText = startStopBtn.GetComponentInChildren<Text>();

            var closeBtn = CreateButton(parent, "CloseBtn", "Volver",
                new Vector2(0.67f, 0.08f), new Vector2(0.95f, 0.20f), Vector2.zero, Vector2.zero,
                new Color(0.4f, 0.1f, 0.1f));
            ctrl.closeButton = closeBtn.GetComponent<Button>();
        }

        // ============================================================
        // POPUP SETUP
        // ============================================================
        static void SetupPopupPanel(Transform parent, PopupController ctrl)
        {
            var popup = CreateUIElement(parent, "PopupPanel",
                new Vector2(0.1f, 0.70f), new Vector2(0.9f, 0.88f),
                Vector2.zero, Vector2.zero, new Color(0.1f, 0.1f, 0.2f, 0.95f));

            ctrl.popupPanel = popup;
            ctrl.popupTitleText = CreateText(popup.transform, "PopupTitle", "Titulo", TextAnchor.MiddleCenter,
                new Vector2(0.05f, 0.55f), new Vector2(0.95f, 0.95f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.popupTitleText.fontSize = 16;
            ctrl.popupMessageText = CreateText(popup.transform, "PopupMessage", "Mensaje", TextAnchor.MiddleCenter,
                new Vector2(0.05f, 0.1f), new Vector2(0.85f, 0.55f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.popupMessageText.fontSize = 12;

            // Close button for popup
            var popupCloseBtn = CreateButton(popup.transform, "PopupCloseBtn", "X",
                new Vector2(0.88f, 0.7f), new Vector2(0.98f, 0.95f), Vector2.zero, Vector2.zero,
                new Color(0.4f, 0.1f, 0.1f));
            ctrl.popupCloseButton = popupCloseBtn.GetComponent<Button>();

            popup.SetActive(false);
        }

        // ============================================================
        // SHOP PANEL SETUP
        // ============================================================
        static void SetupShopPanel(Transform parent, ShopUI ctrl)
        {
            var title = CreateText(parent, "Title", "TIENDA", TextAnchor.MiddleCenter,
                new Vector2(0.1f, 0.92f), new Vector2(0.9f, 0.98f), Vector2.zero, Vector2.zero);
            title.GetComponent<Text>().fontSize = 22;

            // Tabs (individual fields)
            var tabContainer = CreateUIElement(parent, "ShopTabs",
                new Vector2(0.05f, 0.85f), new Vector2(0.95f, 0.92f),
                Vector2.zero, Vector2.zero, Color.clear);

            var shopTabBtn = CreateButton(tabContainer.transform, "ShopTab_Tienda", "Tienda",
                new Vector2(0, 0), new Vector2(0.25f, 1), new Vector2(2, 0), new Vector2(-2, 0),
                new Color(0.25f, 0.2f, 0.1f));
            ctrl.shopTab = shopTabBtn.GetComponent<Button>();

            var vipTabBtn = CreateButton(tabContainer.transform, "ShopTab_VIP", "VIP",
                new Vector2(0.25f, 0), new Vector2(0.5f, 1), new Vector2(2, 0), new Vector2(-2, 0),
                new Color(0.25f, 0.2f, 0.1f));
            ctrl.vipTab = vipTabBtn.GetComponent<Button>();

            var bpTabBtn = CreateButton(tabContainer.transform, "ShopTab_Pase", "Pase",
                new Vector2(0.5f, 0), new Vector2(0.75f, 1), new Vector2(2, 0), new Vector2(-2, 0),
                new Color(0.25f, 0.2f, 0.1f));
            ctrl.battlePassTab = bpTabBtn.GetComponent<Button>();

            var chestTabBtn = CreateButton(tabContainer.transform, "ShopTab_Cofres", "Cofres",
                new Vector2(0.75f, 0), new Vector2(1f, 1), new Vector2(2, 0), new Vector2(-2, 0),
                new Color(0.25f, 0.2f, 0.1f));
            ctrl.chestsTab = chestTabBtn.GetComponent<Button>();

            // --- Shop sub-panel ---
            var shopSubPanel = CreatePanel(parent, "ShopSubPanel", Color.clear);
            ctrl.shopPanel = shopSubPanel;
            var shopScroll = CreateScrollView(shopSubPanel.transform, "ShopItems",
                new Vector2(0.05f, 0.15f), new Vector2(0.95f, 0.84f));
            ctrl.shopItemContainer = shopScroll.transform.Find("Viewport/Content");
            ctrl.shopItemPrefab = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Prefabs/ShopItemPrefab.prefab");

            // --- VIP sub-panel ---
            var vipSubPanel = CreatePanel(parent, "VIPSubPanel", Color.clear);
            ctrl.vipPanel = vipSubPanel;
            ctrl.vipStatusText = CreateText(vipSubPanel.transform, "VIPStatus", "VIP INACTIVO", TextAnchor.MiddleCenter,
                new Vector2(0.1f, 0.72f), new Vector2(0.9f, 0.82f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.vipTimerText = CreateText(vipSubPanel.transform, "VIPTimer", "", TextAnchor.MiddleCenter,
                new Vector2(0.1f, 0.65f), new Vector2(0.9f, 0.72f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.vipBenefitsText = CreateText(vipSubPanel.transform, "VIPBenefits", "Beneficios VIP", TextAnchor.UpperLeft,
                new Vector2(0.05f, 0.25f), new Vector2(0.95f, 0.64f), new Vector2(10, 10), new Vector2(-10, -10)).GetComponent<Text>();
            ctrl.vipBenefitsText.fontSize = 11;
            var vipBuyBtn = CreateButton(vipSubPanel.transform, "VIPBuyBtn", "Comprar VIP",
                new Vector2(0.1f, 0.15f), new Vector2(0.5f, 0.24f), Vector2.zero, Vector2.zero,
                new Color(0.4f, 0.3f, 0.1f));
            ctrl.vipPurchaseButton = vipBuyBtn.GetComponent<Button>();
            var vipDailyBtn = CreateButton(vipSubPanel.transform, "VIPDailyBtn", "Diario",
                new Vector2(0.52f, 0.15f), new Vector2(0.72f, 0.24f), Vector2.zero, Vector2.zero,
                new Color(0.1f, 0.3f, 0.1f));
            ctrl.vipDailyClaimButton = vipDailyBtn.GetComponent<Button>();
            var vipWeeklyBtn = CreateButton(vipSubPanel.transform, "VIPWeeklyBtn", "Semanal",
                new Vector2(0.74f, 0.15f), new Vector2(0.95f, 0.24f), Vector2.zero, Vector2.zero,
                new Color(0.1f, 0.1f, 0.3f));
            ctrl.vipWeeklyClaimButton = vipWeeklyBtn.GetComponent<Button>();

            // --- Battle Pass sub-panel ---
            var bpSubPanel = CreatePanel(parent, "BattlePassSubPanel", Color.clear);
            ctrl.battlePassPanel = bpSubPanel;
            ctrl.battlePassLevelText = CreateText(bpSubPanel.transform, "BPLevel", "Nivel 0", TextAnchor.MiddleCenter,
                new Vector2(0.1f, 0.75f), new Vector2(0.5f, 0.82f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.battlePassExpText = CreateText(bpSubPanel.transform, "BPExp", "0/100 EXP", TextAnchor.MiddleCenter,
                new Vector2(0.5f, 0.75f), new Vector2(0.9f, 0.82f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            var bpSliderGO = CreateSlider(bpSubPanel.transform, "BPExpSlider",
                new Vector2(0.1f, 0.70f), new Vector2(0.9f, 0.75f), new Color(0.2f, 0.6f, 0.8f));
            ctrl.battlePassExpSlider = bpSliderGO.GetComponent<Slider>();
            ctrl.premiumPassStatusText = CreateText(bpSubPanel.transform, "PremiumStatus", "Comprar Premium", TextAnchor.MiddleCenter,
                new Vector2(0.1f, 0.63f), new Vector2(0.6f, 0.70f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            var premBtn = CreateButton(bpSubPanel.transform, "PremiumBtn", "Premium",
                new Vector2(0.62f, 0.63f), new Vector2(0.9f, 0.70f), Vector2.zero, Vector2.zero,
                new Color(0.4f, 0.3f, 0.1f));
            ctrl.premiumPassButton = premBtn.GetComponent<Button>();
            var bpRewardScroll = CreateScrollView(bpSubPanel.transform, "BPRewards",
                new Vector2(0.05f, 0.15f), new Vector2(0.95f, 0.62f));
            ctrl.battlePassRewardContainer = bpRewardScroll.transform.Find("Viewport/Content");
            ctrl.battlePassRewardPrefab = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Prefabs/BattlePassRewardPrefab.prefab");

            // --- Chests sub-panel ---
            var chestSubPanel = CreatePanel(parent, "ChestsSubPanel", Color.clear);
            ctrl.chestsPanel = chestSubPanel;
            var chestScroll = CreateScrollView(chestSubPanel.transform, "ChestItems",
                new Vector2(0.05f, 0.15f), new Vector2(0.95f, 0.84f));
            ctrl.chestContainer = chestScroll.transform.Find("Viewport/Content");
            ctrl.chestItemPrefab = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Prefabs/ChestItemPrefab.prefab");

            // Ad reward
            var adBtn = CreateButton(parent, "WatchAdBtn", "Ver Anuncio",
                new Vector2(0.05f, 0.05f), new Vector2(0.3f, 0.13f), Vector2.zero, Vector2.zero,
                new Color(0.1f, 0.3f, 0.3f));
            ctrl.watchAdButton = adBtn.GetComponent<Button>();
            ctrl.adsRemainingText = CreateText(parent, "AdsRemaining", "Anuncios: 10", TextAnchor.MiddleLeft,
                new Vector2(0.32f, 0.05f), new Vector2(0.55f, 0.13f), Vector2.zero, Vector2.zero).GetComponent<Text>();

            // Boost display
            ctrl.activeBoostText = CreateText(parent, "ActiveBoost", "", TextAnchor.MiddleCenter,
                new Vector2(0.56f, 0.05f), new Vector2(0.78f, 0.13f), Vector2.zero, Vector2.zero).GetComponent<Text>();

            // Close button
            var closeBtn = CreateButton(parent, "CloseBtn", "Volver",
                new Vector2(0.80f, 0.05f), new Vector2(0.95f, 0.13f), Vector2.zero, Vector2.zero,
                new Color(0.4f, 0.1f, 0.1f));
            ctrl.closeButton = closeBtn.GetComponent<Button>();
        }

        // ============================================================
        // CLAN PANEL SETUP
        // ============================================================
        static void SetupClanPanel(Transform parent, ClanUI ctrl)
        {
            var title = CreateText(parent, "Title", "CLAN", TextAnchor.MiddleCenter,
                new Vector2(0.1f, 0.92f), new Vector2(0.9f, 0.98f), Vector2.zero, Vector2.zero);
            title.GetComponent<Text>().fontSize = 22;

            // --- No Clan Panel ---
            var noClanPanel = CreatePanel(parent, "NoClanPanel", Color.clear);
            ctrl.noClanPanel = noClanPanel;

            CreateText(noClanPanel.transform, "NoClanTitle", "No estas en un clan", TextAnchor.MiddleCenter,
                new Vector2(0.1f, 0.65f), new Vector2(0.9f, 0.75f), Vector2.zero, Vector2.zero);

            // Clan name input
            var inputGO = new GameObject("ClanNameInput", typeof(RectTransform), typeof(CanvasRenderer), typeof(Image), typeof(InputField));
            inputGO.transform.SetParent(noClanPanel.transform, false);
            var inputRT = inputGO.GetComponent<RectTransform>();
            inputRT.anchorMin = new Vector2(0.1f, 0.55f);
            inputRT.anchorMax = new Vector2(0.9f, 0.63f);
            inputRT.offsetMin = Vector2.zero;
            inputRT.offsetMax = Vector2.zero;
            inputGO.GetComponent<Image>().color = new Color(0.2f, 0.2f, 0.25f);
            var inputTextGO = CreateText(inputGO.transform, "InputText", "", TextAnchor.MiddleLeft,
                new Vector2(0, 0), new Vector2(1, 1), new Vector2(10, 2), new Vector2(-10, -2));
            var placeholderGO = CreateText(inputGO.transform, "Placeholder", "Nombre del clan...", TextAnchor.MiddleLeft,
                new Vector2(0, 0), new Vector2(1, 1), new Vector2(10, 2), new Vector2(-10, -2));
            placeholderGO.GetComponent<Text>().color = new Color(1, 1, 1, 0.3f);
            var inputField = inputGO.GetComponent<InputField>();
            inputField.textComponent = inputTextGO.GetComponent<Text>();
            inputField.placeholder = placeholderGO.GetComponent<Text>();
            ctrl.clanNameInput = inputField;

            var createBtn = CreateButton(noClanPanel.transform, "CreateClanBtn", "Crear Clan",
                new Vector2(0.1f, 0.42f), new Vector2(0.48f, 0.52f), Vector2.zero, Vector2.zero,
                new Color(0.1f, 0.3f, 0.4f));
            ctrl.createClanButton = createBtn.GetComponent<Button>();

            var joinBtn = CreateButton(noClanPanel.transform, "JoinClanBtn", "Unirse a Clan",
                new Vector2(0.52f, 0.42f), new Vector2(0.9f, 0.52f), Vector2.zero, Vector2.zero,
                new Color(0.1f, 0.4f, 0.1f));
            ctrl.joinClanButton = joinBtn.GetComponent<Button>();

            // --- Clan Panel (when in clan) ---
            var clanPanel = CreatePanel(parent, "ClanInfoPanel", Color.clear);
            ctrl.clanPanel = clanPanel;

            ctrl.clanNameText = CreateText(clanPanel.transform, "ClanName", "Mi Clan", TextAnchor.MiddleCenter,
                new Vector2(0.05f, 0.85f), new Vector2(0.95f, 0.91f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.clanLevelText = CreateText(clanPanel.transform, "ClanLevel", "Nivel: 0", TextAnchor.MiddleLeft,
                new Vector2(0.05f, 0.80f), new Vector2(0.35f, 0.85f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.clanMembersText = CreateText(clanPanel.transform, "ClanMembers", "0/10", TextAnchor.MiddleCenter,
                new Vector2(0.35f, 0.80f), new Vector2(0.65f, 0.85f), Vector2.zero, Vector2.zero).GetComponent<Text>();

            var clanExpSliderGO = CreateSlider(clanPanel.transform, "ClanExpSlider",
                new Vector2(0.65f, 0.80f), new Vector2(0.95f, 0.85f), new Color(0.2f, 0.5f, 0.8f));
            ctrl.clanExpSlider = clanExpSliderGO.GetComponent<Slider>();

            // Donations
            ctrl.donationsRemainingText = CreateText(clanPanel.transform, "DonationsRemaining", "Donaciones: 5 restantes", TextAnchor.MiddleCenter,
                new Vector2(0.05f, 0.74f), new Vector2(0.95f, 0.80f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.totalDonatedText = CreateText(clanPanel.transform, "TotalDonated", "Total donado: 0", TextAnchor.MiddleCenter,
                new Vector2(0.05f, 0.69f), new Vector2(0.95f, 0.74f), Vector2.zero, Vector2.zero).GetComponent<Text>();

            var donateStoneBtn = CreateButton(clanPanel.transform, "DonateStoneBtn", "Donar Piedra",
                new Vector2(0.05f, 0.62f), new Vector2(0.33f, 0.69f), Vector2.zero, Vector2.zero,
                new Color(0.1f, 0.3f, 0.1f));
            ctrl.donateStoneButton = donateStoneBtn.GetComponent<Button>();

            var donateFoodBtn = CreateButton(clanPanel.transform, "DonateFoodBtn", "Donar Comida",
                new Vector2(0.35f, 0.62f), new Vector2(0.63f, 0.69f), Vector2.zero, Vector2.zero,
                new Color(0.3f, 0.3f, 0.1f));
            ctrl.donateFoodButton = donateFoodBtn.GetComponent<Button>();

            var donateEnergyBtn = CreateButton(clanPanel.transform, "DonateEnergyBtn", "Donar Energia",
                new Vector2(0.65f, 0.62f), new Vector2(0.95f, 0.69f), Vector2.zero, Vector2.zero,
                new Color(0.1f, 0.1f, 0.3f));
            ctrl.donateEnergyButton = donateEnergyBtn.GetComponent<Button>();

            // Event panel
            var eventPanel = CreateUIElement(clanPanel.transform, "EventPanel",
                new Vector2(0.05f, 0.48f), new Vector2(0.95f, 0.60f),
                Vector2.zero, Vector2.zero, new Color(0.1f, 0.1f, 0.15f, 0.5f));
            ctrl.eventPanel = eventPanel;
            ctrl.eventNameText = CreateText(eventPanel.transform, "EventName", "Evento: Ninguno", TextAnchor.MiddleLeft,
                new Vector2(0.02f, 0.5f), new Vector2(0.6f, 1f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.eventTimerText = CreateText(eventPanel.transform, "EventTimer", "", TextAnchor.MiddleRight,
                new Vector2(0.6f, 0.5f), new Vector2(0.98f, 1f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.eventProgressText = CreateText(eventPanel.transform, "EventProgress", "0/0", TextAnchor.MiddleLeft,
                new Vector2(0.02f, 0f), new Vector2(0.5f, 0.5f), Vector2.zero, Vector2.zero).GetComponent<Text>();

            var eventProgressSliderGO = CreateSlider(eventPanel.transform, "EventProgressSlider",
                new Vector2(0.5f, 0.05f), new Vector2(0.75f, 0.45f), new Color(0.6f, 0.4f, 0.1f));
            ctrl.eventProgressSlider = eventProgressSliderGO.GetComponent<Slider>();

            var claimEventBtn = CreateButton(eventPanel.transform, "ClaimEventBtn", "Reclamar",
                new Vector2(0.77f, 0.05f), new Vector2(0.98f, 0.45f), Vector2.zero, Vector2.zero,
                new Color(0.4f, 0.3f, 0.1f));
            ctrl.claimEventRewardButton = claimEventBtn.GetComponent<Button>();

            var startEventBtn = CreateButton(clanPanel.transform, "StartEventBtn", "Iniciar Evento",
                new Vector2(0.05f, 0.42f), new Vector2(0.35f, 0.48f), Vector2.zero, Vector2.zero,
                new Color(0.2f, 0.3f, 0.4f));
            ctrl.startEventButton = startEventBtn.GetComponent<Button>();

            // Member list
            var scrollView = CreateScrollView(clanPanel.transform, "MemberList",
                new Vector2(0.05f, 0.18f), new Vector2(0.95f, 0.41f));
            ctrl.memberListContainer = scrollView.transform.Find("Viewport/Content");
            ctrl.memberItemPrefab = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Prefabs/MemberItemPrefab.prefab");

            // Ranking
            ctrl.globalRankText = CreateText(clanPanel.transform, "GlobalRank", "Ranking: -", TextAnchor.MiddleLeft,
                new Vector2(0.05f, 0.12f), new Vector2(0.5f, 0.18f), Vector2.zero, Vector2.zero).GetComponent<Text>();
            ctrl.globalScoreText = CreateText(clanPanel.transform, "GlobalScore", "Puntuacion: 0", TextAnchor.MiddleLeft,
                new Vector2(0.5f, 0.12f), new Vector2(0.95f, 0.18f), Vector2.zero, Vector2.zero).GetComponent<Text>();

            // Bottom buttons
            var leaveBtn = CreateButton(clanPanel.transform, "LeaveClanBtn", "Salir del Clan",
                new Vector2(0.05f, 0.04f), new Vector2(0.35f, 0.11f), Vector2.zero, Vector2.zero,
                new Color(0.4f, 0.1f, 0.1f));
            ctrl.leaveClanButton = leaveBtn.GetComponent<Button>();

            var closeBtn = CreateButton(parent, "CloseBtn", "Volver",
                new Vector2(0.65f, 0.04f), new Vector2(0.95f, 0.11f), Vector2.zero, Vector2.zero,
                new Color(0.3f, 0.15f, 0.15f));
            ctrl.closeButton = closeBtn.GetComponent<Button>();
        }

        // ============================================================
        // UTILITY METHODS
        // ============================================================

        static T CreateOrLoad<T>(string path) where T : ScriptableObject
        {
            var existing = AssetDatabase.LoadAssetAtPath<T>(path);
            if (existing != null) return existing;

            var asset = ScriptableObject.CreateInstance<T>();
            AssetDatabase.CreateAsset(asset, path);
            return asset;
        }

        static T[] FindAllAssets<T>(string folder) where T : Object
        {
            var guids = AssetDatabase.FindAssets($"t:{typeof(T).Name}", new[] { folder });
            var list = new List<T>();
            foreach (var guid in guids)
            {
                var path = AssetDatabase.GUIDToAssetPath(guid);
                var asset = AssetDatabase.LoadAssetAtPath<T>(path);
                if (asset != null) list.Add(asset);
            }
            return list.ToArray();
        }

        static void EnsureFolder(string path)
        {
            if (!AssetDatabase.IsValidFolder(path))
            {
                var parts = path.Split('/');
                string current = parts[0];
                for (int i = 1; i < parts.Length; i++)
                {
                    string next = current + "/" + parts[i];
                    if (!AssetDatabase.IsValidFolder(next))
                        AssetDatabase.CreateFolder(current, parts[i]);
                    current = next;
                }
            }
        }

        static GameObject CreatePanel(Transform parent, string name, Color bgColor)
        {
            var go = new GameObject(name, typeof(RectTransform), typeof(CanvasRenderer));
            go.transform.SetParent(parent, false);
            var rt = go.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            if (bgColor != Color.clear)
            {
                var img = go.AddComponent<Image>();
                img.color = bgColor;
            }

            return go;
        }

        static GameObject CreateUIElement(Transform parent, string name, Vector2 anchorMin, Vector2 anchorMax,
            Vector2 offsetMin, Vector2 offsetMax, Color bgColor)
        {
            var go = new GameObject(name, typeof(RectTransform), typeof(CanvasRenderer), typeof(Image));
            go.transform.SetParent(parent, false);
            var rt = go.GetComponent<RectTransform>();
            rt.anchorMin = anchorMin;
            rt.anchorMax = anchorMax;
            rt.offsetMin = offsetMin;
            rt.offsetMax = offsetMax;
            go.GetComponent<Image>().color = bgColor;
            return go;
        }

        static GameObject CreateText(Transform parent, string name, string text, TextAnchor alignment,
            Vector2 anchorMin, Vector2 anchorMax, Vector2 offsetMin, Vector2 offsetMax)
        {
            var go = new GameObject(name, typeof(RectTransform), typeof(CanvasRenderer), typeof(Text));
            go.transform.SetParent(parent, false);
            var rt = go.GetComponent<RectTransform>();
            rt.anchorMin = anchorMin;
            rt.anchorMax = anchorMax;
            rt.offsetMin = offsetMin;
            rt.offsetMax = offsetMax;
            var t = go.GetComponent<Text>();
            t.text = text;
            t.color = Color.white;
            t.fontSize = 13;
            t.alignment = alignment;
            t.resizeTextForBestFit = true;
            t.resizeTextMinSize = 8;
            t.resizeTextMaxSize = 18;
            t.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            return go;
        }

        static GameObject CreateButton(Transform parent, string name, string label,
            Vector2 anchorMin, Vector2 anchorMax, Vector2 offsetMin, Vector2 offsetMax, Color bgColor)
        {
            var go = new GameObject(name, typeof(RectTransform), typeof(CanvasRenderer), typeof(Image), typeof(Button));
            go.transform.SetParent(parent, false);
            var rt = go.GetComponent<RectTransform>();
            rt.anchorMin = anchorMin;
            rt.anchorMax = anchorMax;
            rt.offsetMin = offsetMin;
            rt.offsetMax = offsetMax;
            go.GetComponent<Image>().color = bgColor;

            var textGO = new GameObject("Text", typeof(RectTransform), typeof(CanvasRenderer), typeof(Text));
            textGO.transform.SetParent(go.transform, false);
            var textRT = textGO.GetComponent<RectTransform>();
            textRT.anchorMin = Vector2.zero;
            textRT.anchorMax = Vector2.one;
            textRT.offsetMin = new Vector2(2, 2);
            textRT.offsetMax = new Vector2(-2, -2);
            var t = textGO.GetComponent<Text>();
            t.text = label;
            t.color = Color.white;
            t.fontSize = 12;
            t.alignment = TextAnchor.MiddleCenter;
            t.resizeTextForBestFit = true;
            t.resizeTextMinSize = 7;
            t.resizeTextMaxSize = 14;
            t.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");

            return go;
        }

        static GameObject CreateSlider(Transform parent, string name,
            Vector2 anchorMin, Vector2 anchorMax, Color fillColor)
        {
            var go = new GameObject(name, typeof(RectTransform), typeof(Slider));
            go.transform.SetParent(parent, false);
            var rt = go.GetComponent<RectTransform>();
            rt.anchorMin = anchorMin;
            rt.anchorMax = anchorMax;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            var bg = CreateUIElement(go.transform, "Background", Vector2.zero, Vector2.one,
                Vector2.zero, Vector2.zero, new Color(0.2f, 0.2f, 0.2f));

            var fillArea = new GameObject("Fill Area", typeof(RectTransform));
            fillArea.transform.SetParent(go.transform, false);
            var fillRT = fillArea.GetComponent<RectTransform>();
            fillRT.anchorMin = Vector2.zero;
            fillRT.anchorMax = Vector2.one;
            fillRT.offsetMin = Vector2.zero;
            fillRT.offsetMax = Vector2.zero;

            var fill = CreateUIElement(fillArea.transform, "Fill", Vector2.zero, new Vector2(0.5f, 1),
                Vector2.zero, Vector2.zero, fillColor);

            var slider = go.GetComponent<Slider>();
            slider.fillRect = fill.GetComponent<RectTransform>();
            slider.interactable = false;
            slider.value = 1f;

            return go;
        }

        static GameObject CreateScrollView(Transform parent, string name, Vector2 anchorMin, Vector2 anchorMax)
        {
            var scrollGO = new GameObject(name, typeof(RectTransform), typeof(ScrollRect));
            scrollGO.transform.SetParent(parent, false);
            var scrollRT = scrollGO.GetComponent<RectTransform>();
            scrollRT.anchorMin = anchorMin;
            scrollRT.anchorMax = anchorMax;
            scrollRT.offsetMin = Vector2.zero;
            scrollRT.offsetMax = Vector2.zero;

            // Viewport
            var viewport = new GameObject("Viewport", typeof(RectTransform), typeof(CanvasRenderer), typeof(Image), typeof(Mask));
            viewport.transform.SetParent(scrollGO.transform, false);
            var vpRT = viewport.GetComponent<RectTransform>();
            vpRT.anchorMin = Vector2.zero;
            vpRT.anchorMax = Vector2.one;
            vpRT.offsetMin = Vector2.zero;
            vpRT.offsetMax = Vector2.zero;
            viewport.GetComponent<Image>().color = new Color(0.1f, 0.1f, 0.1f, 0.3f);
            viewport.GetComponent<Mask>().showMaskGraphic = true;

            // Content
            var content = new GameObject("Content", typeof(RectTransform), typeof(VerticalLayoutGroup), typeof(ContentSizeFitter));
            content.transform.SetParent(viewport.transform, false);
            var contentRT = content.GetComponent<RectTransform>();
            contentRT.anchorMin = new Vector2(0, 1);
            contentRT.anchorMax = new Vector2(1, 1);
            contentRT.pivot = new Vector2(0.5f, 1);
            contentRT.offsetMin = Vector2.zero;
            contentRT.offsetMax = Vector2.zero;
            var vlg = content.GetComponent<VerticalLayoutGroup>();
            vlg.spacing = 5;
            vlg.padding = new RectOffset(5, 5, 5, 5);
            vlg.childForceExpandWidth = true;
            vlg.childForceExpandHeight = false;
            vlg.childControlWidth = true;
            vlg.childControlHeight = false;
            var csf = content.GetComponent<ContentSizeFitter>();
            csf.verticalFit = ContentSizeFitter.FitMode.PreferredSize;

            var scrollRect = scrollGO.GetComponent<ScrollRect>();
            scrollRect.viewport = vpRT;
            scrollRect.content = contentRT;
            scrollRect.horizontal = false;
            scrollRect.vertical = true;

            return scrollGO;
        }
    }
}
