import { SCENE_URL_PREFIX } from '@/consts';

const sceneUrl = (url: string) => `${SCENE_URL_PREFIX}${url}`;

export const StoryData = [
  {
    id: 'BlackLake',
    name: ' Black-water\n          Lake',
    videoUrl: 'https://findtruman.io/assets/fcc/HSH.mp4',
    gameSceneUrl: sceneUrl('game-black-water'),
    storySceneUrl: sceneUrl('story-black-water'),
  },
  {
    id: 'Metaverse',
    name: 'Metaverse\n   Carnival',
    videoUrl: 'https://findtruman.io/assets/fcc/YYZJNH.mp4',
    gameSceneUrl: sceneUrl('game-the-trip'),
    storySceneUrl: sceneUrl('story-the-trip'),
  },
  {
    id: 'Church',
    name: 'Scarlet Church',
    videoUrl: 'https://findtruman.io/assets/fcc/XSJT.mp4',
    gameSceneUrl: sceneUrl('game-scarlet-church'),
    storySceneUrl: sceneUrl('story-scarlet-church'),
  },
  {
    id: 'PoliceStation',
    name: 'Police Station',
    videoUrl: 'https://findtruman.io/assets/fcc/police.mp4',
    gameSceneUrl: '',
    storySceneUrl: sceneUrl('story-police-station'),
  },
  {
    id: 'Hospital',
    name: 'Hospital',
    videoUrl: 'https://findtruman.io/assets/fcc/hospital.mp4',
    gameSceneUrl: '',
    storySceneUrl: sceneUrl('story-hospital'),
  },
  {
    id: 'Beelzebub',
    name: 'Beelzebub',
    videoUrl: 'https://findtruman.io/assets/fcc/abyss.mp4',
    gameSceneUrl: sceneUrl('game-the-abyss'),
    storySceneUrl: '',
  },
  {
    id: 'SevenDeadlySins',
    name: 'Seven Deadly\n           Sins',
    videoUrl: 'https://findtruman.io/assets/index-assets/HQ-FT-launch-ENG.mp4',
    twitterUrl:
      'https://twitter.com/search?q=(%23FT_Alpha_Test)%20(from%3AThomas26670%20OR%20from%3AAngelic25314540%20OR%20from%3AAxe509%20OR%20from%3AVincent10679122%20OR%20from%3AFindTruman)&src=typed_query&f=live',
  },
];

const _data = [...StoryData];
StoryData.push(..._data);
StoryData.push(..._data);
