const graphql = require('graphql')
const _ = require('lodash')
const axios = require('axios')
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql
const { v4: uuidv4 } = require('uuid');

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        username: { type: GraphQLString },
        storeId: { type: GraphQLString }
    }
})

const TraderType = new GraphQLObjectType({
    name: 'Trader',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        tradername: { type: GraphQLString },
        storeId: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        type: { type: GraphQLString },
        address: { type: GraphQLString },
        note: { type: GraphQLString },
    }
})

// const TradeType = () => new GraphQLObjectType({
//     name: 'Trade',
//     fields: {
//         id: { type: GraphQLString },
//         tradingId: { type: GraphQLString },
//         storeId: { type: GraphQLString },
//         date: { type: GraphQLString },
//         userId: { type: GraphQLString },
//         username: { type: GraphQLString },
//         partnerId: { type: GraphQLString },
//         tradername: { type: GraphQLString },
//         tradingType: { type: GraphQLString },
//         totalFund: { type: GraphQLInt },
//         tradingDetails: { type: new GraphQLNonNull(GraphQLList(TradeDetailType)) },
//     }
// })

const TradeDetailType = new GraphQLObjectType({
    name: 'TradeDetail',
    fields: {
        productId: { type: GraphQLString },
        singlePrice: { type: GraphQLInt },
        amount: { type: GraphQLInt }
    }
})

const ProductModelType = () => new GraphQLObjectType({
    name: 'ProductModel',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        storeId: { type: GraphQLString },
        seasonDate: { type: GraphQLString },
        type: { type: GraphQLString },
        variety: { 
            type: new GraphQLList(ProductInfoType),
            resolve(parentValue, args){

            }
        }
    }
})

const ProductInfoType = new GraphQLObjectType({
    name: 'ProductInfo',
    fields: {
        productId: { type: new GraphQLNonNull(GraphQLString) }, 
        initialVolume: { type: new GraphQLNonNull(GraphQLInt) }, 
        restockVolume: { type: new GraphQLNonNull(GraphQLInt) }, 
        returnVolume: { type: new GraphQLNonNull(GraphQLInt)}, 
        currentStock: { type: new GraphQLNonNull(GraphQLInt) }, 
        purchasedVolume: { type: new GraphQLNonNull(GraphQLInt) }, 
        costPrice: { type: new GraphQLNonNull(GraphQLInt) }, 
        labelPrice: { type: new GraphQLNonNull(GraphQLInt) },
        disaccount: { type: GraphQLInt }
    }
})


const StoreType = new GraphQLObjectType({
    name: 'Store',
    fields: {
        id: { type: GraphQLString },
        storename: { type: GraphQLString } ,
        owner: {
            type: UserType,
            resolve(parentValue, args){
               return axios.get(`http://localhost:3000/users/${parentValue.ownerId}`).then(response => response.data)
            }
        },
        staff: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/stores/${parentValue.id}/users`).then(response => response.data)
            }
        },
        clients: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/stores/${parentValue.id}/users`).then(response => response.data)
            }
        }
    }
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/users/${args.id}`).then(response => response.data)
            }
        },
        store: {
            type: StoreType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/stores/${args.id}`).then(response => response.data)
            }
        }
    }
})

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                storeId: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, { username, storeId }) {
                let myuuid = uuidv4();
                return axios.post('http://localhost:3000/users', { id: myuuid, username, storeId }).then(res=>res.data)
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, { id }) {
                return axios.delete(`http://localhost:3000/users/${id}`).then(res=> res.data)
            }
        },
        editUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                username: { type: GraphQLString },
                storeId: { type: GraphQLString }
            },
            resolve(parentValue, args){
                return axios.patch(`http://localhost:3000/users/${args.id}`, args).then(res=>res.data)
            }
        },
        addStore: {
            type: StoreType,
            args: { 
                storename: { type: GraphQLString },
                ownerId: { type: GraphQLString },
             },
            resolve(parentValue, { storename = '', ownerId = '' }) {
                let myuuid = uuidv4();
                return axios.post(`http://localhost:3000/store`, { id: myuuid, storename: storename || '', ownerId: ownerId || '' }).then(res=>res.data)
            }
        },
        addTrader: {
            type: TraderType,
            args: {
                // id: "101",
                tradername: { type: new GraphQLNonNull(GraphQLString) },
                storeId: { type: GraphQLString },
                email: { type: GraphQLString },
                phone: { type: GraphQLString },
                type: { type: GraphQLString },
                address: { type: GraphQLString },
                note: { type: GraphQLString }
            },
            resolve(parentValue, { tradername, storeId, email, phone, address, type, note }) {
                let myuuid = uuidv4();
                return axios.post(`http://localhost:3000/traders`, { id: myuuid, tradername, storeId, email, phone, address, type, note }).then(res=>res.data)
            }
        },
        editTrader: {
            type: TraderType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                tradername: { type: GraphQLString },
                storeId: { type: GraphQLString },
                email: { type: GraphQLString },
                phone: { type: GraphQLString },
                type: { type: GraphQLString },
                address: { type: GraphQLString },
                note: { type: GraphQLString }
            },
            resolve(parentValue, args){
                return axios.patch(`http://localhost:3000/traders/${args.id}`, args).then(res=>res.data)
            }
        },
        deleteTrader: {
            type: TraderType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, { id }) {
                return axios.delete(`http://localhost:3000/traders/${id}`).then(res=> res.data)
            }
        },
        // registerProduct: {
        //     type: Product
        // },
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation

})