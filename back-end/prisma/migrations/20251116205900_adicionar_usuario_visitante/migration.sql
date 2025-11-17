/*
  Warnings:

  - Added the required column `usuarioId` to the `Visitante` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `visitante` ADD COLUMN `usuarioId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Visitante` ADD CONSTRAINT `Visitante_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
