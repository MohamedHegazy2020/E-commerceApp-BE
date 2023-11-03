import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { getAllCategoriesResolver } from "./graphqlCategoryResolvers.js";

export const categorySchema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: "categoryQuerySchema",
		description: "category query schema",
		fields: {
			getAllCategories: getAllCategoriesResolver,
		},
	}),
});
