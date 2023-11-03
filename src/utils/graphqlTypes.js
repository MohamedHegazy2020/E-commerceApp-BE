import { GraphQLObjectType, GraphQLString } from "graphql";

export const imageType = new GraphQLObjectType({
	name: "imageType",
	fields: {
		secure_url: { type: GraphQLString },
		public_id: { type: GraphQLString },
	},
});
export const categoryType = new GraphQLObjectType({
	name: "categoryType",
	fields: {
		name: { type: GraphQLString },
		slug: { type: GraphQLString },
		image: { type: imageType },
		_id: { type: GraphQLString },
		createdBy: { type: GraphQLString },
		customId: { type: GraphQLString },	
		
	},
});

