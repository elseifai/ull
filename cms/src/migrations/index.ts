import * as migration_20261020_064235_initial from './20261020_064235_initial';
import * as migration_20261020_070329_gallery_and_images from './20261020_070329_gallery_and_images';
import * as migration_20261023_120000_media_prefix from './20261023_120000_media_prefix';
import * as migration_20261023_130000_media_object_key from './20261023_130000_media_object_key';

export const migrations = [
  {
    up: migration_20261020_064235_initial.up,
    down: migration_20261020_064235_initial.down,
    name: '20261020_064235_initial',
  },
  {
    up: migration_20261020_070329_gallery_and_images.up,
    down: migration_20261020_070329_gallery_and_images.down,
    name: '20261020_070329_gallery_and_images',
  },
  {
    up: migration_20261023_120000_media_prefix.up,
    down: migration_20261023_120000_media_prefix.down,
    name: '20261023_120000_media_prefix',
  },
  {
    up: migration_20261023_130000_media_object_key.up,
    down: migration_20261023_130000_media_object_key.down,
    name: '20261023_130000_media_object_key',
  },
];
