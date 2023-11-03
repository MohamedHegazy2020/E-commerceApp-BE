import { GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { categoryModel } from "../../../../DB/Models/category.model.js";
import { categoryType } from "../../../utils/graphqlTypes.js";

export const getAllCategoriesResolver = {
	type: new GraphQLList(categoryType),

	resolve: async () => {
		const categories = await categoryModel.find();
		return categories;
	},
};
