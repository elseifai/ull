import * as migration_20261020_064235_initial from './20261020_064235_initial';
import * as migration_20261020_070329_gallery_and_images from './20261020_070329_gallery_and_images';
import * as migration_20261023_120000_media_prefix from './20261023_120000_media_prefix';
import * as migration_20261023_130000_media_object_key from './20261023_130000_media_object_key';
import * as migration_20261026_155548_cdn_media_and_private_files from './20261026_155548_cdn_media_and_private_files';
import * as migration_20261028_120000_umbrella_paths from './20261028_120000_umbrella_paths';
import * as migration_20261103_140000_enquiry_utm from './20261103_140000_enquiry_utm';
import * as migration_20261114_090000_parent_expectations from './20261114_090000_parent_expectations';

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
  {
    up: migration_20261026_155548_cdn_media_and_private_files.up,
    down: migration_20261026_155548_cdn_media_and_private_files.down,
    name: '20261026_155548_cdn_media_and_private_files',
  },
  {
    up: migration_20261028_120000_umbrella_paths.up,
    down: migration_20261028_120000_umbrella_paths.down,
    name: '20261028_120000_umbrella_paths',
  },
  {
    up: migration_20261103_140000_enquiry_utm.up,
    down: migration_20261103_140000_enquiry_utm.down,
    name: '20261103_140000_enquiry_utm',
  },
  {
    up: migration_20261114_090000_parent_expectations.up,
    down: migration_20261114_090000_parent_expectations.down,
    name: '20261114_090000_parent_expectations',
  },
];
