import { db } from "@/lib/db";
import { audioFiles } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getAudioByPost(postId: number) {
    return db
        .select()
        .from(audioFiles)
        .where(eq(audioFiles.postId, postId))
        .orderBy(asc(audioFiles.order));
}

export async function createAudioFile(data: {
    postId: number;
    title: string;
    url: string;
    order?: number;
}) {
    const [inserted] = await db.insert(audioFiles).values(data).returning();
    return inserted;
}

export async function deleteAudioFile(id: number) {
    await db.delete(audioFiles).where(eq(audioFiles.id, id));
}

export async function updateAudioOrder(id: number, order: number) {
    await db.update(audioFiles).set({ order }).where(eq(audioFiles.id, id));
}