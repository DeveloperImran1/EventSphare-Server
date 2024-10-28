// const mongoose = require("mongoose");

// const ConversationSchema = new mongoose.Schema(
//   {
//     members: {
//         type: [String],
//     },
// },
// { timestamps: true }
// );

// const Conversation = mongoose.model("Conversation", ConversationSchema);
// module.exports = Conversation;

const mongoose = require("mongoose");

const conversationSchema =new mongoose.Schema({
    participants:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    messages:[ 
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Message",
            default:[]
        }
    ]
},{timestamps:true})

const Conversation = mongoose.model('Conversation',conversationSchema)
module.exports = Conversation;
