-- CreateTable
CREATE TABLE "photo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "photo_metadata" (
    "photoId" TEXT NOT NULL PRIMARY KEY,
    "height" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "contentType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "photo_metadata_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "photo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "photo_ratings" (
    "photoId" TEXT NOT NULL PRIMARY KEY,
    "likes" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "photo_ratings_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "photo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "album" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bannerId" TEXT NOT NULL,
    CONSTRAINT "album_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "photo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER'
);

-- CreateTable
CREATE TABLE "profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "photo" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_albumTophoto" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_albumTophoto_A_fkey" FOREIGN KEY ("A") REFERENCES "album" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_albumTophoto_B_fkey" FOREIGN KEY ("B") REFERENCES "photo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_albumTophoto_AB_unique" ON "_albumTophoto"("A", "B");

-- CreateIndex
CREATE INDEX "_albumTophoto_B_index" ON "_albumTophoto"("B");
