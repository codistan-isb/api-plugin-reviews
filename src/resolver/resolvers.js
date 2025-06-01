import updateProductReview from "../utils/updateProductReview.js";
import getProductReview from "../utils/getProductReview.js";
import accountByUserId from "../utils/accountByUserId.js"
import updateStoreReview from "../utils/updateStoreReview.js";
import getStoreReview from "../utils/getStoreReview.js";
const resolvers = {
  productReview: {
    async createdBy(parent, args, context, info) {
      let userInfo = await accountByUserId(context, parent.createdBy);
      return {
        name: userInfo.name
          ? userInfo.name
          : userInfo.profile.name
            ? userInfo.profile.name
            : userInfo.username
              ? userInfo.username
              : userInfo.profile.username
                ? userInfo.profile.username
                : "Anonymous",
        Image: userInfo.profile.picture
      }
    }
  },
  Query: {
    async productReviews(parent, args, context, info) {
      console.log("productReviews query", args)
      let query_response = await getProductReview(context, args);
      return query_response;
    },

    async storeReviews(parent, args, context, info) {
      console.log("productReviews query", args)
      let query_response = await getStoreReview(context, args);
      return query_response;
    }
  },
  Mutation: {

    async createOrUpdateProductReview(parent, args, context, info) {
      let accountId = context.userId;
      if (!accountId || accountId == null) {
        console.log("Unauthenticated user");
        throw new Error("Unauthenticated user");
      }
      let mutation_response = await updateProductReview(context, args.input, accountId);
      return mutation_response;
    },
    async createOrUpdateStoreReview(parent, { input }, context) {
      // enforce auth
      const accountId = context.userId;

      console.log("USER ID FROM TOKEN",)
      if (!accountId) {
        throw new Error("Unauthenticated user");
      }
      // delegate to our util
      return updateStoreReview(context, input, accountId);
    }
  },
};
export default resolvers;
