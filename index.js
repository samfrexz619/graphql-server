import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import db from './_db.js';

// types
import { typeDefs } from './schema.js';


const resolvers = {
  Query: {
    games() {
      return db.games
    },
    game(_, args) {
      return db.games.find(game => game.id === args.id)
    },
    authors() {
      return db.authors
    },
    author(_, args) {
      return db.authors.find(author => author.id === args.id)
    },
    reviews() {
      return db.reviews
    },
    review(_, args) {
      return db.reviews.find(review => review.id === args.id)
    }
  },
  Game: {
    reviews(parent) {
      return db.reviews.filter(rev => rev.game_id === parent.id)
    }
  },
  Author: {
    reviews(parent) {
      return db.reviews.filter(rev => rev.author_id === parent.id)
    }
  },
  Review: {
    author(parent) {
      return db.authors.find(a => a.id === parent.author_id)
    },
    game(parent) {
      return db.games.find(g => g.id === parent.game_id)
    },
  },
  Mutation: {
    deleteGame(_, args) {
      db.games = db.games.filter(g => g.id !== args.id)
      return db.games
    },
    addGame(_, args) {
      let game = {
        ...args.game,
        id: Math.floor(Math.random() * 10000).toString() //generates a random number between 0 and 1 then multiply it by 10,000, then floor it so it becomes an int and then convert it to string
      }
      db.games.push(game)
      return game
    },
    updateGame(_, args) {
      db.games = db.games.map(g => {
        if (g.id === args.id) {
          return { ...g, ...args.editGame }
        }
        return g
      })
      return db.games.find(g => g.id === args.id)
    }
  }
}

// server setup
const server = new ApolloServer({
  typeDefs,
  resolvers
})

const { url } = await startStandaloneServer(server, {
  listen: {
    port: 4000
  }
})

console.log('server is ready')