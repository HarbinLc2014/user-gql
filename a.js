const graphql = require('graphql')
const _ = require('lodash')
const axios = require('axios')
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLSchema
} = graphql

const stores = [
    { id: '23', name: "Bill's shop", ownerId: '20' },
    { id: '47', name: "Samantha's shop", ownerId: '21' }
]

const UserType = new GraphQLObjectType({
    name: 'User',
    field: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        storeId: { type: GraphQLString },

    }
})

const StoreType = new GraphQLObjectType({
    name: 'Store',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString } ,
    }
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        store: {
            type: StoreType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                // return _.find(stores, { id: args.id })
                return axios.get(`http://localhost:3000/stores/${args.id}`).then(response => response.data)
            }
        },
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                // return _.find(stores, { id: args.id })
                return axios.get(`http://localhost:3000/users/${args.id}`).then(response => response.data)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery

})