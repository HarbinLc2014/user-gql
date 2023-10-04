const graphql = require('graphql')
const _ = require('lodash')
const axios = require('axios')
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLFloat,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInputObjectType,
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
        traderName: { type: GraphQLString },
        storeId: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        type: { type: GraphQLString },
        address: { type: GraphQLString },
        note: { type: GraphQLString },
    }
})

const TradingProductDetailInputType =  new GraphQLInputObjectType({
    name: 'TradingProductDetailInput',
    fields: {
        productId: { type: GraphQLString },
        size: { type: GraphQLString },
        color: { type: GraphQLString },
        amount: { type: GraphQLInt },
    }
})
  

const TradingProductDetailType = new GraphQLObjectType({
    name: 'TradingProductDetail',
    fields: {
        productId: { type: GraphQLString },
        size: { type: GraphQLString },
        color: { type: GraphQLString },
        amount: { type: GraphQLInt }
    }
})

const TradingDetailInputType = new GraphQLInputObjectType({
    name: 'TradingDetailInput',
    fields: {
        productModelId: { type: GraphQLString },
        productType: { type: GraphQLString },
        purchasingPrice: { type: GraphQLFloat},
        labelPrice: { type: GraphQLFloat },
        disaccount: { type: GraphQLFloat },
        amount: { type: GraphQLInt },
        totalCost: { type: GraphQLFloat },
        products: { type: GraphQLList(TradingProductDetailInputType) }
    }
})

const TradingDetailType = new GraphQLObjectType({
    name: 'TradingDetail',
    fields: {
        productModelId: { type: GraphQLString },
        productType: { type: GraphQLString },
        purchasingPrice: { type: GraphQLFloat},
        labelPrice: { type: GraphQLFloat },
        disaccount: { type: GraphQLFloat },
        amount: { type: GraphQLInt },
        totalCost: { type: GraphQLFloat },
        products: { type: GraphQLList(TradingProductDetailType) }
    }
})

const TradingType = new GraphQLObjectType({
    name: 'Trading',
    fields: {
        id: { type: GraphQLString },
        tradingId: { type: GraphQLString },
        storeId: { type: GraphQLString },
        date: { type: GraphQLString },
        userId: { type: GraphQLString },
        username: { type: GraphQLString },
        storename: { type: GraphQLString },
        traderId: { type: GraphQLString },
        traderName: { type: GraphQLString },
        tradingType: { type: GraphQLString },
        status: { type: GraphQLString },
        note: { type: GraphQLString },
        totalFund: { type: GraphQLFloat },
        totalAmount: { type: GraphQLInt },
        tradingDetails: { type: new GraphQLNonNull(GraphQLList(TradingDetailType)) },
    }
})


const ProductModelType = new GraphQLObjectType({
    name: 'ProductModel',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        traderId: { type: GraphQLString },
        storeId: { type: GraphQLString },
        seasonDate: { type: GraphQLString },
        type: { type: GraphQLString },
        costPrice: { type: GraphQLFloat },
        labelPrice: { type: GraphQLFloat },
        disaccount: { type: GraphQLFloat },
        sellingPrice: { type: GraphQLFloat }
    }
})

const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: {
        productModelId: { type: new GraphQLNonNull(GraphQLString) },
        id: { type: new GraphQLNonNull(GraphQLString) },
        size: { type: new GraphQLNonNull(GraphQLString) },
        color: { type: new GraphQLNonNull(GraphQLString) },
        initialVolume: { type: new GraphQLNonNull(GraphQLInt) },
        restockVolume: { type: new GraphQLNonNull(GraphQLInt) },
        returnVolume: { type: new GraphQLNonNull(GraphQLInt) },
        currentStock: { type: new GraphQLNonNull(GraphQLInt) },
        purchasedVolume: { type: new GraphQLNonNull(GraphQLInt) },
        isOnSale: { type: new GraphQLNonNull(GraphQLBoolean) }
    }
})


const StoreType = new GraphQLObjectType({
    name: 'Store',
    fields: {
        id: { type: GraphQLString },
        storename: { type: GraphQLString },
        owner: {
            type: UserType,
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/users/${parentValue.ownerId}`).then(response => response.data)
            }
        },
        staff: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/stores/${parentValue.id}/users`).then(response => response.data)
            }
        },
        clients: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
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
                return axios.post('http://localhost:3000/users', { id: myuuid, username, storeId }).then(res => res.data)
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, { id }) {
                return axios.delete(`http://localhost:3000/users/${id}`).then(res => res.data)
            }
        },
        editUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                username: { type: GraphQLString },
                storeId: { type: GraphQLString }
            },
            resolve(parentValue, args) {
                return axios.patch(`http://localhost:3000/users/${args.id}`, args).then(res => res.data)
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
                return axios.post(`http://localhost:3000/store`, { id: myuuid, storename: storename || '', ownerId: ownerId || '' }).then(res => res.data)
            }
        },
        addTrader: {
            type: TraderType,
            args: {
                // id: "101",
                traderName: { type: new GraphQLNonNull(GraphQLString) },
                storeId: { type: GraphQLString },
                email: { type: GraphQLString },
                phone: { type: GraphQLString },
                type: { type: GraphQLString },
                address: { type: GraphQLString },
                note: { type: GraphQLString }
            },
            resolve(parentValue, { traderName, storeId, email, phone, address, type, note }) {
                let myuuid = uuidv4();
                return axios.post(`http://localhost:3000/traders`, { id: myuuid, traderName, storeId, email, phone, address, type, note }).then(res => res.data)
            }
        },
        editTrader: {
            type: TraderType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                traderName: { type: GraphQLString },
                storeId: { type: GraphQLString },
                email: { type: GraphQLString },
                phone: { type: GraphQLString },
                type: { type: GraphQLString },
                address: { type: GraphQLString },
                note: { type: GraphQLString }
            },
            resolve(parentValue, args) {
                return axios.patch(`http://localhost:3000/traders/${args.id}`, args).then(res => res.data)
            }
        },
        deleteTrader: {
            type: TraderType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, { id }) {
                return axios.delete(`http://localhost:3000/traders/${id}`).then(res => res.data)
            }
        },
        addProductModel: {
            type: ProductModelType,
            args: {
                traderId: { type: GraphQLString },
                storeId: { type: new GraphQLNonNull(GraphQLString) },
                seasonDate: { type: GraphQLString },
                type: { type: GraphQLString },
                costPrice: { type: GraphQLFloat },
                labelPrice: { type: GraphQLFloat },
                disaccount: { type: GraphQLFloat },
                sellingPrice: { type: GraphQLFloat }
            },
            resolve(parentValue, args) {
                let myuuid = uuidv4();
                return axios.post(`http://localhost:3000/productmodels`, {
                    id: myuuid,
                    ...args
                }).then(res => res.data)
            }
        },
        editProductModel: {
            type: ProductModelType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                traderId: { type: GraphQLString },
                storeId: { type: new GraphQLNonNull(GraphQLString) },
                seasonDate: { type: GraphQLString },
                type: { type: GraphQLString },
                costPrice: { type: GraphQLFloat },
                labelPrice: { type: GraphQLFloat },
                disaccount: { type: GraphQLFloat },
                sellingPrice: { type: GraphQLFloat }
            },
            resolve(parentValue, args) {
                return axios.patch(`http://localhost:3000/productmodels/${id}`,args).then(res => res.data)
            }
        },
        deleteProductModel: {
            type: ProductModelType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, { id }) {
                return axios.delete(`http://localhost:3000/productModels/${id}`).then(res => res.data)
            }
        },
        addProduct: {
            type: ProductType,
            args: {
                productModelId: { type: new GraphQLNonNull(GraphQLString) },
                size: { type: new GraphQLNonNull(GraphQLString) },
                color: { type: new GraphQLNonNull(GraphQLString) },
                initialVolume: { type: new GraphQLNonNull(GraphQLInt) },
                restockVolume: { type: new GraphQLNonNull(GraphQLInt) },
                returnVolume: { type: new GraphQLNonNull(GraphQLInt) },
                currentStock: { type: new GraphQLNonNull(GraphQLInt) },
                purchasedVolume: { type: new GraphQLNonNull(GraphQLInt) },
                isOnSale: { type: new GraphQLNonNull(GraphQLBoolean) }
            },
            resolve(parentValue, args) {
                let myuuid = uuidv4();
                return axios.post(`http://localhost:3000/products`, {id: myuuid, ...args}).then(res=>res.data)
            }
        },
        editProduct: {
            type: ProductType,
            args:{
                id: { type: new GraphQLNonNull(GraphQLString) },
                productModelId: { type: new GraphQLNonNull(GraphQLString) },
                size: { type: new GraphQLNonNull(GraphQLString) },
                color: { type: new GraphQLNonNull(GraphQLString) },
                initialVolume: { type: new GraphQLNonNull(GraphQLInt) },
                restockVolume: { type: new GraphQLNonNull(GraphQLInt) },
                returnVolume: { type: new GraphQLNonNull(GraphQLInt) },
                currentStock: { type: new GraphQLNonNull(GraphQLInt) },
                purchasedVolume: { type: new GraphQLNonNull(GraphQLInt) },
                isOnSale: { type: new GraphQLNonNull(GraphQLBoolean) }
            },
            resolve(parentValue, args) {
                return axios.patch(`http://localhost:3000/products/${id}`,args).then(res => res.data)
            }
        },
        deleteProduct: {
            type: ProductType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, { id }) {
                return axios.delete(`http://localhost:3000/products/${id}`).then(res => res.data)
            }
        },
        addTrading: {
            type: TradingType,
            args: {
                tradingId: { type: GraphQLString },
                storeId: { type: GraphQLString },
                date: { type: GraphQLString },
                userId: { type: GraphQLString },
                username: { type: GraphQLString },
                storename: { type: GraphQLString },
                traderId: { type: GraphQLString },
                traderName: { type: GraphQLString },
                tradingType: { type: GraphQLString },
                status: { type: GraphQLString },
                note: { type: GraphQLString },
                totalFund: { type: GraphQLFloat },
                totalAmount: { type: GraphQLInt },
                tradingDetails: { type: new GraphQLNonNull(GraphQLList(TradingDetailInputType)) },
            },
            resolve(parentValue, args){
                let myuuid = uuidv4();
                return axios.post(`http://localhost:3000/tradings`, { id: myuuid, ...args }).then(res => res.data)
            }
        },
        // editTrading: {

        // },
        // deleteTrading: {

        // }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation

})