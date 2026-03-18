using UnityEngine;
using UnityEditor;
using System.IO;

namespace ProjectEvolvion.Editor
{
    public class SpriteImportConfig : AssetPostprocessor
    {
        // Auto-configure ALL PNGs under Assets/Sprites/ as proper sprites
        void OnPreprocessTexture()
        {
            if (!assetPath.StartsWith("Assets/Sprites/")) return;

            var importer = (TextureImporter)assetImporter;
            importer.textureType = TextureImporterType.Sprite;
            importer.spriteImportMode = SpriteImportMode.Single;
            importer.mipmapEnabled = false;
            importer.filterMode = FilterMode.Bilinear;
            importer.textureCompression = TextureImporterCompression.Compressed;
            importer.alphaIsTransparency = true;

            // UI sprites (panels, buttons, bars) need border for 9-slice
            if (assetPath.Contains("/UI/Panels/") || assetPath.Contains("/UI/Buttons/") || assetPath.Contains("/UI/Bars/"))
            {
                importer.spriteBorder = new Vector4(16, 16, 16, 16);
            }

            // Backgrounds need to be uncompressed for quality
            if (assetPath.Contains("/Backgrounds/") || assetPath.Contains("bg-space"))
            {
                importer.textureCompression = TextureImporterCompression.Uncompressed;
                importer.maxTextureSize = 2048;
            }

            // Icons and small sprites
            if (assetPath.Contains("/Icons/") || assetPath.Contains("/Effects/"))
            {
                importer.maxTextureSize = 128;
            }
        }

        // Menu item to force re-import all sprites
        [MenuItem("Evolvion/Reimportar Todos los Sprites")]
        public static void ReimportAllSprites()
        {
            string[] pngs = Directory.GetFiles("Assets/Sprites", "*.png", SearchOption.AllDirectories);
            int count = 0;

            foreach (string path in pngs)
            {
                string assetPath = path.Replace("\\", "/");
                var importer = AssetImporter.GetAtPath(assetPath) as TextureImporter;
                if (importer == null) continue;

                importer.textureType = TextureImporterType.Sprite;
                importer.spriteImportMode = SpriteImportMode.Single;
                importer.mipmapEnabled = false;
                importer.filterMode = FilterMode.Bilinear;
                importer.textureCompression = TextureImporterCompression.Compressed;
                importer.alphaIsTransparency = true;

                if (assetPath.Contains("/UI/Panels/") || assetPath.Contains("/UI/Buttons/") || assetPath.Contains("/UI/Bars/"))
                    importer.spriteBorder = new Vector4(16, 16, 16, 16);

                if (assetPath.Contains("/Backgrounds/") || assetPath.Contains("bg-space"))
                {
                    importer.textureCompression = TextureImporterCompression.Uncompressed;
                    importer.maxTextureSize = 2048;
                }

                if (assetPath.Contains("/Icons/") || assetPath.Contains("/Effects/"))
                    importer.maxTextureSize = 128;

                importer.SaveAndReimport();
                count++;
            }

            AssetDatabase.Refresh();
            Debug.Log($"[Evolvion] {count} sprites reimportados como Sprite2D.");
            EditorUtility.DisplayDialog("Sprites Configurados", $"{count} sprites configurados correctamente.", "OK");
        }
    }
}
