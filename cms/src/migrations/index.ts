import * as migration_20261020_064235_initial from './20261020_064235_initial';
import * as migration_20261020_070329_gallery_and_images from './20261020_070329_gallery_and_images';

export const migrations = [
  {
    up: migration_20261020_064235_initial.up,
    down: migration_20261020_064235_initial.down,
    name: '20261020_064235_initial',
  },
  {
    up: migration_20261020_070329_gallery_and_images.up,
    down: migration_20261020_070329_gallery_and_images.down,
    name: '20261020_070329_gallery_and_images'
  },
];
