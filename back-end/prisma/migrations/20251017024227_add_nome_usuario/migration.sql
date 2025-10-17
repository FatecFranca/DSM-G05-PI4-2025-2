/*
  Warnings:

  - A unique constraint covering the columns `[nomeUsuario]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nomeUsuario` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `nomeUsuario` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Usuario_nomeUsuario_key` ON `Usuario`(`nomeUsuario`);
