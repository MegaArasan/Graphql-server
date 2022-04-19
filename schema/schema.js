const graphql = require("graphql");
const Book = require("../models/book");
const Author = require("../models/author");

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
} = graphql;

// var bookDatabase = [
//   {
//     // _id: "6253cc3a0d20957c2d5d1323",
//     title: "Antic Hay",
//     author: "Aldous Leonard Huxley",
//     description:
//       "Antic Hay is a comic novel by Aldous Huxley, published in 1923. The story takes place in London, and depicts the aimless or self-absorbed cultural elite in the sad and turbulent times following the end of World War I.",
//   },
//   {
//     // _id: "6253cd9e0d20957c2d5d1324",
//     title: "All Passion Spent",
//     author: "Vita Sackville-West",
//     description:
//       "All Passion Spent is a literary fiction novel by Vita Sackville-West. Published in 1931, it is one of Sackville-West's most popular works and has been adapted for television by the BBC. The novel addresses people's, especially women's, control of their own lives, a subject about which Sackville-West was greatly concerned although often pointing out that she did not consider herself a feminist.",
//   },
//   {
//     // _id: "6253ce0c0d20957c2d5d1325",
//     title: "Dying of the Light",
//     author: "George R. R. Martin",
//     description:
//       "Dying of the Light is a science fiction novel by American writer George R. R. Martin, published in 1977 by Simon & Schuster. Martin's original title was After the Festival; its title was changed before its first hardcover publication.",
//   },
//   {
//     // _id: "6253ceba0d20957c2d5d1326",
//     title: "Daredevil",
//     author: "Stan Lee",
//     description:
//       "Daredevil is the name of several comic book titles featuring the character Daredevil and published by Marvel Comics, beginning with the original Daredevil comic book series which debuted in 1964",
//   },
//   {
//     // _id: "6253cf240d20957c2d5d1327",
//     title: "Roger Rabbit",
//     author: "Stan Lee",
//     description:
//       "Roger Rabbit is an animated anthropomorphic rabbit. The character first appeared in author Gary K. Wolf's 1981 novel, Who Censored Roger Rabbit? In the book, Roger is a second-banana in popular comic strip",
//   },
//   {
//     // _id: "6253cfa50d20957c2d5d1328",
//     title: "Void Indigo",
//     author: "Steve Gerber",
//     description:
//       "Void Indigo was a short-lived and controversial comic book series written by Steve Gerber and drawn by Val Mayerik. It was published by Epic Comics from 1983 to 1984.",
//   },
//   {
//     // _id: "6253d0090d20957c2d5d1329",
//     title: "he Man-Thing and Howard the Duck",
//     author: "Steve Gerber",
//     description:
//       "The Man-Thing (Dr. Theodore  Sallis)[3] is a fictional character appearing in American comic books published by Marvel Comics. Created by writers Stan Lee, Roy Thomas, and Gerry Conway and artist Gray Morrow, the character first appeared in Savage Tales #1 (May 1971),[4] and went on to be featured in various titles and in his own series, including Adventure into Fear.",
//   },
//   {
//     // _id: "6253d08e0d20957c2d5d132a",
//     title: "Doctor Strange",
//     author: "Stan Lee",
//     description:
//       "Doctor Strange serves as the Sorcerer Supreme, the primary protector of Earth against magical and mystical threats. Strange was created during the Silver Age of Comic Books to bring a different kind of character and themes of mysticism to Marvel Comics.",
//   },
//   {
//     // _id: "6253d0fa0d20957c2d5d132b",
//     title: "Things Fall Apart",
//     author: "Chinua Achebe",
//     description:
//       "Things Fall Apart is the debut novel by Nigerian author Chinua Achebe, first published in 1958. It depicts pre-colonial life in the southeastern part of Nigeria and the invasion by Europeans during the late 19th century. It is seen as the archetypal modern African novel in English, and one of the first to receive global critical acclaim.",
//   },
//   {
//     // _id: "6253d1620d20957c2d5d132c",
//     title: "A Time to Kill",
//     author: "John_Grisham",
//     description:
//       "A Time to Kill is a 1989 legal thriller and debut novel by American author John Grisham. The novel was rejected by many publishers before Wynwood Press eventually gave it a 5,000-copy printing. When Doubleday published The Firm, Wynwood released a trade paperback of A Time to Kill, which became a bestseller.",
//   },
// ];

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    // author: { type: GraphQLString },
    description: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return Author.findOne({ name: parent.author });
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    book: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({ author: parent.name });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "ROOTqueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return bookDatabase.find((item) => {
        //   return item._id == args._id;/
        return Book.findById(args._id);
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({});
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Author.findById(args._id);
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          description: args.description,
        });
        l;
        return author.save();
      },
    },
    addBook: {
      type: BookType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        author: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let book = new Book({
          title: args.title,
          author: args.author,
          description: args.description,
        });
        return book.save();
      },
    },
    delBook: {
      type: BookType,
      args: { _id: { type: GraphQLID } },
      resolve(parent, args) {
        return Book.findByIdAndDelete({ _id: args._id });
      },
    },
    updateBook: {
      type: BookType,
      args: {
        _id: { type: GraphQLID },
        title: { type: GraphQLString },
        author: { type: GraphQLString },
        description: { type: GraphQLString },
      },
      resolve(parent, args) {
        let book = {
          title: args.title,
          author: args.author,
          description: args.description,
        };
        return Book.findByIdAndUpdate({ _id: args._id }, book, { new: true });
      },
    },
    updateAuthor: {
      type: AuthorType,
      args: {
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
      },
      resolve(parent, args) {
        let author = {
          name: args.name,
          description: args.description,
        };
        return Author.findByIdAndUpdate({ _id: args._id }, author, {
          new: true,
        });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
