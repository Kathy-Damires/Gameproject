using UnityEngine;
using System.Collections.Generic;
using System.Linq;

namespace ProjectEvolvion
{
    public class ToolSystem : MonoBehaviour
    {
        private PlayerState _state;
        private GameDatabase _db;

        public void Initialize(PlayerState state, GameDatabase db)
        {
            _state = state;
            _db = db;
        }

        public void AddTool(string toolDataId)
        {
            var toolData = _db.GetTool(toolDataId);
            if (toolData == null) return;

            var instance = new ToolInstance
            {
                instanceId = System.Guid.NewGuid().ToString(),
                toolDataId = toolDataId
            };
            _state.toolInventory.Add(instance);
            GameEvents.RaiseToolObtained(toolData);
        }

        public bool AssignToolToStructure(string toolInstanceId, string structureId)
        {
            var tool = _state.toolInventory.Find(t => t.instanceId == toolInstanceId);
            if (tool == null) return false;

            var planet = _state.GetActivePlanet();
            var structState = planet?.GetStructure(structureId);
            if (structState == null || !structState.isBuilt) return false;

            // Unassign from current structure if already assigned elsewhere
            foreach (var s in planet.structures)
            {
                if (s.assignedToolId == toolInstanceId)
                    s.assignedToolId = null;
            }

            structState.assignedToolId = toolInstanceId;
            return true;
        }

        public bool FuseTools(List<string> toolInstanceIds)
        {
            if (toolInstanceIds.Count < 3) return false;

            // Verify all tools exist and are the same type/rarity
            var tools = new List<ToolInstance>();
            string commonToolDataId = null;

            foreach (var id in toolInstanceIds)
            {
                var tool = _state.toolInventory.Find(t => t.instanceId == id);
                if (tool == null) return false;

                if (commonToolDataId == null)
                    commonToolDataId = tool.toolDataId;
                else if (tool.toolDataId != commonToolDataId)
                    return false;

                tools.Add(tool);
            }

            var toolData = _db.GetTool(commonToolDataId);
            if (toolData == null || toolData.nextRarityTool == null) return false;

            // Remove the 3 tools used for fusion
            for (int i = 0; i < 3; i++)
            {
                // Unassign from any structure
                var planet = _state.GetActivePlanet();
                if (planet != null)
                {
                    foreach (var s in planet.structures)
                    {
                        if (s.assignedToolId == tools[i].instanceId)
                            s.assignedToolId = null;
                    }
                }
                _state.toolInventory.Remove(tools[i]);
            }

            // Add the upgraded tool
            AddTool(toolData.nextRarityTool.toolId);
            GameEvents.RaiseToolFused(toolData.nextRarityTool);
            return true;
        }

        public List<ToolInstance> GetToolsByDataId(string toolDataId) =>
            _state.toolInventory.Where(t => t.toolDataId == toolDataId).ToList();

        public List<ToolInstance> GetUnassignedTools()
        {
            var planet = _state.GetActivePlanet();
            if (planet == null) return _state.toolInventory;

            var assignedIds = new HashSet<string>();
            foreach (var s in planet.structures)
            {
                if (!string.IsNullOrEmpty(s.assignedToolId))
                    assignedIds.Add(s.assignedToolId);
            }

            return _state.toolInventory.Where(t => !assignedIds.Contains(t.instanceId)).ToList();
        }
    }
}
