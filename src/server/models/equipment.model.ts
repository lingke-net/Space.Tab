// 适配 mysql2，导出表名和字段名常量，无需sequelize

export const EQUIPMENT_INFO_TABLE = 'equipment_info';
export const EQUIPMENT_DISPOSITION_TABLE = 'equipment_disposition';

export const EquipmentInfoFields = [
  'info_uuid',
  'bios_id',
  'country',
  'user_id',
  'date',
];

export const EquipmentDispositionFields = [
  'info_uuid',
  'equipment_uuid',
  'system_architecture',
  'system',
  'system_id',
  'ram_info',
  'date',
  'wonderlab_run_file',
  'wonderlab_v',
]; 