import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AlterAvatarFieldToAvatarId1598215570894
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'avatar');
    await queryRunner.addColumn(
      'users',
      new TableColumn({ name: 'avatar_id', type: 'uuid', isNullable: true }),
    );
    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        name: '',
        columnNames: ['avatar_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'files',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "users" DROP COLUMN "avatar_id" CASCADE',
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'avatar',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }
}
