/*
  Warnings:

  - You are about to alter the column `tipo` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- DropForeignKey
ALTER TABLE `veiculo` DROP FOREIGN KEY `Veiculo_usuarioId_fkey`;

-- DropIndex
DROP INDEX `Veiculo_usuarioId_fkey` ON `veiculo`;

-- AlterTable
ALTER TABLE `usuario` MODIFY `tipo` ENUM('ADMIN', 'MORADOR', 'PORTEIRO') NOT NULL DEFAULT 'MORADOR';

-- AlterTable
ALTER TABLE `veiculo` ADD COLUMN `visitanteId` INTEGER NULL,
    MODIFY `usuarioId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Visitante` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `documento` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Veiculo` ADD CONSTRAINT `Veiculo_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Veiculo` ADD CONSTRAINT `Veiculo_visitanteId_fkey` FOREIGN KEY (`visitanteId`) REFERENCES `Visitante`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
