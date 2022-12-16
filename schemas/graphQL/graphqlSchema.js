const graphql = require('graphql')
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLSchema } = graphql

//modeller för mongodb
const Vendor = require('../vendorSchema')
const Product = require('../productSchemas')


// types eller modeller för graphql
const VendorType = new GraphQLObjectType({  // vendortype är leverantör. GraphQLObjectType() blir som en klass, ett objekt
    name: 'Vendor', 
    fields: () => ({ //vilka fält kommer leverantören att ha, i detta fall id, name och vilka värden har dessa. Så som vi definerat upp mongoDB schemas
        _id: { type: GraphQLID }, //heter _id för det ska matcha vår mongodb. /inte bra sätt att använda för att hämta ett id då den inte skiljer på olika datatyper som text och siffror utan definerar allt som samma 
        name: { type: GraphQLString },
        products: {
            type: new GraphQLList(ProductType), //en lista av typen productType
            resolve(parent, args) {
                return Product.find({ vendorId : parent._id })
            }
        }
    })
})

const ProductType = new GraphQLObjectType({ 
    name: 'Product', 
    fields: () => ({ 
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLString },
        category: { type: GraphQLString },
        tag: { type: GraphQLString },
        rating: { type: GraphQLString },
        imageName: { type: GraphQLString },
        vendor: {
            type: VendorType,
            resolve(parent, args) { //detta är sättet vi hämtar upp informationen på, parent är vår Product, args är vad vi skickar in till vår sökalgoritm
                return Vendor.findById(parent.vendorId) // en mongodb grej, vi kommer göra en modell för detta
            }
        }
    })
})

// roots - saker vi kan söka på för att hämta en leverantör, alla leverantörer, en produkt, alla produkter
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        vendor: {
            type: VendorType, 
            args: { id: { type: GraphQLID } }, //våra arguments eller params - parametrar som vi skickar med
            resolve(parent, args) {
                return Vendor.findById(args.id) //eftersom det skickas med som argument och inte som en parent del
            }
        },
        vendors: {
            type: new GraphQLList(VendorType), 
            resolve(parent, args) {
                return Vendor.find({})
            }
        },
        product: {
            type: ProductType, 
            args: { id: { type: GraphQLID } }, 
            resolve(parent, args) {
                return Product.findById(args.id)
            }
        },
        products: {
            type: new GraphQLList(ProductType), 
            resolve(parent, args) {
                return Product.find({})
            }
        }
    }
})

// mutation
const Mutation = new GraphQLObjectType({
    name: 'Mutation', 
    fields: {
        addVendor: { //skapar en ny leverantör - ett nytt objekt 
            type: VendorType,
            args: {
                name: { type: GraphQLString }
            },
            resolve(parent, args) {
                const vendor = new Vendor({ // mongodb stil
                    name: args.name
                }) 
                return vendor.save()
            }
        },
        addProduct: { //skapar en ny produkt - ett nytt objekt 
            type: ProductType,
            args: {
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                price: { type: GraphQLString },
                category: { type: GraphQLString },
                tag: { type: GraphQLString },
                rating: { type: GraphQLString },
                imageName: { type: GraphQLString },
                vendorId: { type: GraphQLID}
            },
            resolve(parent, args) {
                const product = new Product({ 
                    name: args.name,
                    description: args.description,
                    price: args.price,
                    category: args.category,
                    tag: args.tag,
                    rating: args.rating,
                    imageName: args.imageName,
                    vendorId: args.vendorId
                }) 
                return product.save()
            }
        }
    }
})

module.exports = new GraphQLSchema ({
    query: RootQuery,
    mutation: Mutation
})