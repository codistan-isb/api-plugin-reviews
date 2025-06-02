import _ from "lodash";
import ReactionError from "@reactioncommerce/reaction-error";
import decodeOpaqueId from "@reactioncommerce/api-utils/decodeOpaqueId.js";

/**
 * @name getStoreReview
 * @method
 * @memberof Catalog/NoMeteorQueries
 * @summary query the Catalog by shop ID and/or tag ID
 * @param {Object} context - an object containing the per-request state
 * @param {Object} params - request parameters
 * @param {String[]} [params.searchQuery] - Optional text search query
 * @param {String[]} [params.shopIds] - Shop IDs to include (OR)
 * @param {String[]} [params.tags] - Tag IDs to include (OR)
 * @returns {Promise<MongoCursor>} - A MongoDB cursor for the proper query
 */
export default async function getStoreReview(context, { storeName, sortOrder }) {
    const { collections } = context;
    const { Reviews } = collections;

    if ((!storeName || storeName.length === 0)
        //  && (!tagIds || tagIds.length === 0)
    ) {
        throw new ReactionError(
            "invalid-param",
            "You must provide storeName "
        );
    }
    const query = {
        "storeName": storeName,
    };
    const orderBy = {
        updatedAt: sortOrder == 'asc' ? 1 : -1
    }
    return Reviews.find(query).sort(orderBy).toArray();
}
