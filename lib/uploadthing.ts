import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
    audioUploader: f({ audio: { maxFileSize: "128MB", maxFileCount: 1 } })
        .middleware(async () => {
            const session = await auth();
            if (!session) throw new Error("Unauthorized");
            return { userId: session.user?.email ?? "admin" };
        })
        .onUploadComplete(async ({ file }) => {
            return { url: file.ufsUrl };
        }),

    fatawaAudioUploader: f({ audio: { maxFileSize: "128MB", maxFileCount: 1 } })
        .middleware(async () => {
            const session = await auth();
            if (!session) throw new Error("Unauthorized");
            return { userId: session.user?.email ?? "admin" };
        })
        .onUploadComplete(async ({ file }) => {
            return { url: file.ufsUrl };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;