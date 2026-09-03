const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
 } = require("graphql");

 const Note= require("../models/Notes")
 const NoteType = new GraphQLObjectType({
  name: "Note",
  fields: () => ({
    Title: { type: GraphQLString },
    Content: { type: GraphQLString },
  }),
});
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",

  fields: {
    notes: {
      type: new GraphQLList(NoteType),

      async resolve() {
        return await Note.find();
      },
    },
  },
});
const Mutation = new GraphQLObjectType({
  name: "Mutation",

  fields: {
    addNote: {
      type: NoteType,

      args: {
        Title: { type: GraphQLString },
        Content: { type: GraphQLString },
      },

      async resolve(parent, args) {
        const note = new Note({
          Title: args.Title,
          Content: args.Content,
        });

        return await note.save();
      },
    },
  },
});
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});