using CommonUtils;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AniTask
{
    public struct AnimationItem
    {
        public string skinFilePath;
        public string maxFilePath;
        public string animFilePath;
    }

    public struct GenAnimFileMetaData
    {
        public string animFileName;
        public string submitter;
    }

    public static class MockData
    {
        public static List<AnimationItem> mockGenFiles = new List<AnimationItem>()
        {
            new AnimationItem() {
                skinFilePath = "Animal/Animation/Dog/_Skin/_Ani_Animal_Dog_Skin.max",
                maxFilePath = "Animal/Animation/Dog/Ani_Animal_Dog_Bark.max",
                animFilePath = "Animal/AnimationData/Dog/Ani_Animal_Dog_Bark"
            },
             new AnimationItem() {
                 skinFilePath = "Animal/Animation/Dog/_Skin/_Ani_Animal_Dog_Skin.max",
                maxFilePath = "Animal/Animation/Dog/Ani_Animal_Dog_Personality1.max",
                animFilePath = "Animal/AnimationData/Dog/Ani_Animal_Dog_Personality1"
             },
             new AnimationItem() {
                skinFilePath = "Animal/Animation/Dog/_Skin/_Ani_Animal_Dog_Skin.max",
                maxFilePath = "Animal/Animation/Dog/Ani_Animal_Dog_Personality2.max",
                animFilePath = "Animal/AnimationData/Dog/Ani_Animal_Dog_Personality2"
             },
             new AnimationItem() {
                 skinFilePath = "Animal/Animation/Dog/_Skin/_Ani_Animal_Dog_Skin.max",
                maxFilePath = "Animal/Animation/Dog/Ani_Animal_Dog_Hit.max",
                animFilePath = "Animal/AnimationData/Dog/Ani_Animal_Dog_Hit"
             }
        };
        public static List<AnimationItem> mockCheckFiles = new List<AnimationItem>()
        {
             new AnimationItem() {
                skinFilePath = "Animal/Animation/Dog/_Skin/_Ani_Animal_Dog_Skin.max",
                maxFilePath = "Animal/Animation/Dog/Ani_Animal_Dog_Bark.max",
                animFilePath = "Animal/AnimationData/Dog/Ani_Animal_Dog_Bark"
            },
             new AnimationItem() {
                 skinFilePath = "Animal/Animation/Dog/_Skin/_Ani_Animal_Dog_Skin.max",
                maxFilePath = "Animal/Animation/Dog/Ani_Animal_Dog_Personality1.max",
                animFilePath = "Animal/AnimationData/Dog/Ani_Animal_Dog_Personality1"
             },
             new AnimationItem() {
                 skinFilePath = "Animal/Animation/Dog/_Skin/_Ani_Animal_Dog_Skin.max",
                maxFilePath = "Animal/Animation/Dog/Ani_Animal_Dog_Personality2.max",
                animFilePath = "Animal/AnimationData/Dog/Ani_Animal_Dog_Personality2"
             },
             new AnimationItem() {
                skinFilePath = "Animal/Animation/Dog/_Skin/_Ani_Animal_Dog_Skin.max",
                maxFilePath = "Animal/Animation/Dog/Ani_Animal_Dog_Hit.max",
                animFilePath = "Animal/AnimationData/Dog/Ani_Animal_Dog_Hit"
             }
        };
    }

    public class MockJob : JobNode
    {
        public MockJob() : base("生成动画文件")
        {

        }

        public void Init()
        {
            this.Start();
            Console.WriteLine("Generator Is Started ...");
        }

        public TaskMeta PrepareTask(AnimationItem item)
        {
            //copy file and task id to temp folder
            List<string> msScripts = new List<string>();
            //msScripts.Add(string.Format(@"loadMaxFile {0} quiet:true", AniMaxCommon.MaxscriptHelper.Str(tempSrcFile)));
            //string selectionMode = AniMaxCommon.AnimFile.MaxscriptHelper.SelectionMode.SelectionModeAnim;
            //string.Format(AniMaxCommon.AnimFile.MaxscriptHelper.SaveAnimFile("", tempResultFile, true, selectionMode));

            var genFileMeta = new GenAnimFileMetaData()
            {
                animFileName = item.animFilePath,
                submitter = "bin.fu"
            };

            var meta = new TaskMeta()
            {
                uuid = Utils.GUID(),
                name = "tasks.3dsmax",
                args = msScripts,
                createdAt = Utils.Now(),
                customData = JsonConvert.SerializeObject(genFileMeta)
            };
            return meta;
        }

        public void DispatchTasks()
        {
            for(int i = 0; i < 10; i++)
            {
                foreach (var item in MockData.mockGenFiles)
                {
                    var taskMeta = PrepareTask(item);
                    StartTask(taskMeta);
                }
            }
        }
    }
}
