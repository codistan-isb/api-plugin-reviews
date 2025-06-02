import generateUID from "./generateUID.js";

export default async function updateStoreReview(
    context,
    args,
    accountId
) {
    const { collections } = context;
    const { Reviews } = collections
    const { reviewId, storeName, review, score } = args;

    if (!storeName || !storeName.trim()) {
        throw new Error("You must provide a storeName");
    }


    console.log("ACCOUNT ID", accountId);

    const now = new Date();

    if (reviewId && reviewId.trim()) {
        // --- update existing ---
        const update = {
            review,
            score,
            updatedAt: now
        };
        const result = await Reviews.findOneAndUpdate(
            { _id: reviewId },
            { $set: update },
            { returnDocument: "after" }
        );
        if (!result.value) throw new Error("Review not found");
        return result.value;
    } else {
        const newId = await generateUID();
        const doc = {
            _id: newId,
            storeName,
            createdBy: accountId,
            review,
            score,
            createdAt: now,
            updatedAt: now
        };
        const insert = await Reviews.insertOne(doc);
        if (!insert.insertedId) {
            throw new Error("Failed to create store review");
        }
        return Reviews.findOne({ _id: insert.insertedId });
    }
}
